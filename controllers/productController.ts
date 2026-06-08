import { Request, Response } from 'react'; // Wait, let's make sure we use express req/res
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Product, Category, Review, Brand } from '../models/Product';

export async function getProducts(req: ExpressRequest, res: ExpressResponse) {
  try {
    const { category, brand, search, priceMin, priceMax, rating, color, size, availability, discount, sort, page = '1' } = req.query;

    const query: any = {};

    // 1. Filter by category
    if (category) {
      const catsArray = Array.isArray(category) ? category : [category];
      const mappedCats = catsArray.map((cat: any) => {
        const catVal = cat.toString().toLowerCase().replace(/['\s-]/g, '').replace(/\+/g, '');
        if (catVal === 'mensclothing' || catVal === 'mensapparel' || catVal === 'mensgarments') return "Men's Clothing";
        if (catVal === 'womensclothing' || catVal === 'womensfashion') return "Women's Clothing";
        if (catVal === 'smartwatches' || catVal === 'watches') return "Smart Watches";
        if (catVal === 'bluetoothearbuds') return "Bluetooth Earbuds";
        if (catVal === 'sportswear') return "Sports Wear";
        if (catVal === 'homedecor') return "Home Decor";
        if (catVal === 'kitchenappliances') return "Kitchen Appliances";
        if (catVal === 'gamingaccessories') return "Gaming Accessories";
        if (catVal === 'bagsandtravelaccessories' || catVal === 'bagsandtravel') return "Bags and Travel Accessories";
        if (catVal === 'fitnessequipment') return "Fitness Equipment";
        if (catVal === 'sportsequipment') return "Sports Equipment";
        if (catVal === 'furniture') return "Furniture";
        if (catVal === 'smartphones') return "Smartphones";
        if (catVal === 'laptops') return "Laptops";
        if (catVal === 'speakers') return "Speakers";
        if (catVal === 'headphones') return "Headphones";
        if (catVal === 'shoes') return "Shoes";
        if (catVal === 'books') return "Books";
        if (catVal === 'monitors') return "Monitors";
        if (catVal === 'tablets') return "Tablets";
        if (catVal === 'cameras') return "Cameras";
        
        // Capitalize default
        const str = cat.toString();
        return str.charAt(0).toUpperCase() + str.slice(1);
      });
      query.category = { $in: mappedCats };
    }

    // 2. Filter by brand
    if (brand) {
      const brandsArray = Array.isArray(brand) ? brand : [brand];
      query.brand = { $in: brandsArray.map((b: any) => b.toString()) };
    }

    // 3. Search query
    if (search) {
      query.title = { $regex: search.toString(), $options: 'i' };
    }

    let products = await Product.find(query);

    // 4. In-memory logic to filter properties that are difficult in basic regex of Local DB model
    if (priceMin) {
      products = products.filter((p: any) => p.price >= parseFloat(priceMin.toString()));
    }
    if (priceMax) {
      products = products.filter((p: any) => p.price <= parseFloat(priceMax.toString()));
    }
    if (rating) {
      products = products.filter((p: any) => p.rating >= parseFloat(rating.toString()));
    }
    if (color) {
      products = products.filter((p: any) => p.colors && p.colors.includes(color.toString()));
    }
    if (size) {
      products = products.filter((p: any) => p.sizes && p.sizes.includes(size.toString()));
    }
    if (availability === 'instock') {
      products = products.filter((p: any) => p.stock > 0);
    }
    if (discount) {
      const disc = parseFloat(discount.toString());
      products = products.filter((p: any) => p.discount >= disc);
    }

    // Sort items
    if (sort === 'priceAsc') {
      products.sort((a: any, b: any) => a.price - b.price);
    } else if (sort === 'priceDesc') {
      products.sort((a: any, b: any) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a: any, b: any) => b.rating - a.rating);
    } else {
      // Default: Latest items (ID or seed indices) safely
      products.sort((a: any, b: any) => {
        const idB = String(b?._id || b?.id || '');
        const idA = String(a?._id || a?.id || '');
        return idB.localeCompare(idA);
      });
    }

    // 500 product list is large, we MUST apply pagination
    const itemsPerPage = 12;
    const pageNum = parseInt(page.toString()) || 1;
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedProducts = products.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage);

    // Categories and brands for the filter panel
    const categories = await Category.find({});
    // Extract unique brands dynamically
    const allProductsForBrands = await Product.find({});
    const uniqueBrands = Array.from(new Set(allProductsForBrands.map((p: any) => p.brand)));

    res.render('products', {
      title: 'Products Marketplace - Shopzy',
      products: paginatedProducts,
      currentPage: pageNum,
      totalPages,
      totalItems,
      categories,
      brands: uniqueBrands,
      filters: req.query
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Search Error', message: err.message });
  }
}

// Single Product detail controller
export async function getProductDetails(req: ExpressRequest, res: ExpressResponse) {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).render('error', { title: 'Product Not Found', message: 'The requested product could not be located.' });
    }

    // Reviews for the product
    const reviews = await Review.find({ product: id });

    // Similar Products (Same Category, excluding active item, limit 4)
    let similar = await Product.find({ category: product.category });
    similar = similar.filter((p: any) => (p.id || p._id) !== id).slice(0, 4);

    // Frequently Bought Together (2 random other products in same category for a package price!)
    let bundles = await Product.find({ category: product.category });
    bundles = bundles.filter((p: any) => (p.id || p._id) !== id).sort(() => 0.5 - Math.random()).slice(0, 2);

    res.render('product-detail', {
      title: `${product.title} - Shopzy`,
      product,
      reviews,
      similar,
      bundles
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Details Error', message: err.message });
  }
}

// Submitting a product review
export async function submitReview(req: any, res: ExpressResponse) {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`/login?redirect=${encodeURIComponent(`/products/${id}`)}`);
    }

    await Review.create({
      user: user.id || user._id,
      userName: user.name,
      product: id,
      rating: parseInt(rating),
      comment
    });

    // Recalculate average rating of product
    const allReviews = await Review.find({ product: id });
    const avgRating = allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(id, { rating: parseFloat(avgRating.toFixed(1)) });

    res.redirect(`/products/${id}?review_success=true`);
  } catch (err: any) {
    res.redirect(`/products/${id}?review_error=` + encodeURIComponent(err.message));
  }
}

// Comparisons controller page
export async function compareProducts(req: ExpressRequest, res: ExpressResponse) {
  const { productIds } = req.query; // Expecting commas list like pId1,pId2

  try {
    let ids: string[] = [];
    if (productIds) {
      ids = productIds.toString().split(',').filter(x => x.trim().length > 0);
    }

    const products = [];
    for (const id of ids.slice(0, 4)) { // Limit comparison to max 4 items
      const p = await Product.findById(id);
      if (p) products.push(p);
    }

    res.render('compare', {
      title: 'Compare Products - Shopzy',
      products
    });
  } catch (err: any) {
    res.status(500).render('error', { title: 'Comparison Error', message: err.message });
  }
}

// Global Instant Autocomplete/Suggestions API Endpoint
export async function getSuggestions(req: ExpressRequest, res: ExpressResponse) {
  const { term } = req.query;
  if (!term || term.toString().trim() === '') {
    return res.json([]);
  }

  try {
    const list = await Product.find({ title: { $regex: term.toString(), $options: 'i' } });
    const suggestions = list.slice(0, 6).map((p: any) => ({
      id: p.id || p._id,
      title: p.title,
      price: p.price,
      image: p.images[0]
    }));
    res.json(suggestions);
  } catch {
    res.json([]);
  }
}
