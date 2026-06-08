import bcrypt from 'bcryptjs';
import { Product, Category, Brand } from '../models/Product';
import { User } from '../models/User';
import { Banner as MarketingBanner } from '../models/Marketing';
import { Coupon as OrderCoupon } from '../models/Order';

const IMAGE_POOL: { [key: string]: string[] } = {
  'smartphones': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?w=600&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80'
  ],
  'laptops': [
    'https://images.unsplash.com/photo-1496181130204-755241524eab?w=600&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&q=80',
    'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=600&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80'
  ],
  'smart-watches': [
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80',
    'https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=600&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
  ],
  'bluetooth-earbuds': [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=600&q=80',
    'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80',
    'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&q=80',
    'https://images.unsplash.com/photo-1627834136628-6437151122f3?w=600&q=80'
  ],
  'speakers': [
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&q=80',
    'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80',
    'https://images.unsplash.com/photo-1528243097678-73904f09d526?w=600&q=80'
  ],
  'headphones': [
    'https://m.media-amazon.com/images/I/71ncxKR-6OL._AC_UY327_FMwebp_QL65_.jpg',
    'https://m.media-amazon.com/images/I/71Q-uiqUGSL._AC_UL480_FMwebp_QL65_.jpg',
    'https://m.media-amazon.com/images/I/51revx-zToL._AC_UY327_FMwebp_QL65_.jpg',
    'https://m.media-amazon.com/images/I/71sLOtsK2UL._AC_UY327_FMwebp_QL65_.jpg',
    'https://m.media-amazon.com/images/I/713UaQFqYDL._AC_UY327_FMwebp_QL65_.jpg'
  ],
  'mens-clothing': [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=600&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
    'https://images.unsplash.com/photo-1505633574484-cdb1fd7542d3?w=600&q=80'
  ],
  'womens-clothing': [
    'https://images.unsplash.com/photo-1567401893930-7bf715f5c53c?w=600&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80'
  ],
  'sports-wear': [
    'https://images.unsplash.com/photo-1483721310020-0085d41f17e3?w=600&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',
    'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&q=80'
  ],
  'shoes': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80'
  ],
  'furniture': [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80'
  ],
  'home-decor': [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80',
    'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80',
    'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=600&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'
  ],
  'kitchen-appliances': [
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&q=80',
    'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80',
    'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&q=80'
  ],
  'books': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&q=80'
  ],
  'gaming-accessories': [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80'
  ],
  'monitors': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80',
    'https://images.unsplash.com/photo-1551645121-d1034da75057?w=600&q=80',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80',
    'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&q=80'
  ],
  'tablets': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
    'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
    'https://images.unsplash.com/photo-1585518419721-cc38a5a7b310?w=600&q=80'
  ],
  'cameras': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    'https://images.unsplash.com/photo-1514996937519-63a3e397500b?w=600&q=80',
    'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=600&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    'https://images.unsplash.com/photo-1495707902641-75ca588d2562?w=600&q=80'
  ],
  'fitness-equipment': [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',
    'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80'
  ],
  'bags-and-travel': [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80',
    'https://images.unsplash.com/photo-1578632615469-5a50785002a2?w=600&q=80',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&q=80'
  ],
  'sports-equipment': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=600&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80'
  ]
};

const CATEGORIES = [
  { name: 'Smartphones', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
  { name: 'Laptops', slug: 'laptops', image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&q=80' },
  { name: 'Smart Watches', slug: 'smart-watches', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80' },
  { name: 'Bluetooth Earbuds', slug: 'bluetooth-earbuds', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80' },
  { name: 'Speakers', slug: 'speakers', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80' },
  { name: 'Headphones', slug: 'headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { name: "Men's Clothing", slug: 'mens-clothing', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80' },
  { name: "Women's Clothing", slug: 'womens-clothing', image: 'https://images.unsplash.com/photo-1567401893930-7bf715f5c53c?w=600&q=80' },
  { name: 'Sports Wear', slug: 'sports-wear', image: 'https://images.unsplash.com/photo-1483721310020-0085d41f17e3?w=600&q=80' },
  { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { name: 'Furniture', slug: 'furniture', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80' },
  { name: 'Home Decor', slug: 'home-decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80' },
  { name: 'Kitchen Appliances', slug: 'kitchen-appliances', image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&q=80' },
  { name: 'Books', slug: 'books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80' },
  { name: 'Gaming Accessories', slug: 'gaming-accessories', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80' },
  { name: 'Monitors', slug: 'monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80' },
  { name: 'Tablets', slug: 'tablets', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' },
  { name: 'Cameras', slug: 'cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80' },
  { name: 'Fitness Equipment', slug: 'fitness-equipment', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80' },
  { name: 'Bags and Travel Accessories', slug: 'bags-and-travel', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80' },
  { name: 'Sports Equipment', slug: 'sports-equipment', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80' }
];

const BRANDS = [
  { name: 'Apple', slug: 'apple' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Sony', slug: 'sony' },
  { name: 'Jabra', slug: 'jabra' },
  { name: 'Xiaomi', slug: 'xiaomi' },
  { name: 'Nike', slug: 'nike' },
  { name: 'Adidas', slug: 'adidas' },
  { name: 'Dell', slug: 'dell' },
  { name: 'HP', slug: 'hp' },
  { name: 'Raymond', slug: 'raymond' },
  { name: 'Zara', slug: 'zara' },
  { name: 'Puma', slug: 'puma' },
  { name: 'Asus', slug: 'asus' },
  { name: 'ASUS', slug: 'asus' },
  { name: 'Philips', slug: 'philips' },
  { name: 'OnePlus', slug: 'oneplus' },
  { name: 'Bose', slug: 'bose' },
  { name: 'JBL', slug: 'jbl' },
  { name: 'Logitech', slug: 'logitech' },
  { name: 'Google', slug: 'google' },
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Bang & Olufsen', slug: 'bang-olufsen' },
  { name: 'Anker', slug: 'anker' },
  { name: 'Harman Kardon', slug: 'harman-kardon' },
  { name: 'Nothing', slug: 'nothing' },
  { name: 'iQOO', slug: 'iqoo' },
  { name: 'Realme', slug: 'realme' },
  { name: 'Redmi', slug: 'redmi' },
  { name: 'POCO', slug: 'poco' },
  { name: 'Oppo', slug: 'oppo' },
  { name: 'Vivo', slug: 'vivo' },
  { name: 'Motorola', slug: 'motorola' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'Acer', slug: 'acer' },
  { name: 'MSI', slug: 'msi' },
  { name: 'Garmin', slug: 'garmin' },
  { name: 'Amazfit', slug: 'amazfit' },
  { name: 'Noise', slug: 'noise' },
  { name: 'boAt', slug: 'boat' },
  { name: 'Canon', slug: 'canon' },
  { name: 'Nikon', slug: 'nikon' },
  { name: 'Fujifilm', slug: 'fujifilm' },
  { name: 'Instant Pot', slug: 'instant-pot' },
  { name: 'LG', slug: 'lg' },
  { name: 'Prestige', slug: 'prestige' },
  { name: 'NutriBullet', slug: 'nutribullet' },
  { name: 'Panasonic', slug: 'panasonic' },
  { name: 'Havells', slug: 'havells' },
  { name: 'Morphy Richards', slug: 'morphy-richards' },
  { name: 'Pigeon', slug: 'pigeon' },
  { name: 'De\'Longhi', slug: 'delonghi' },
  { name: 'Bosch', slug: 'bosch' },
  { name: 'KitchenAid', slug: 'kitchenaid' },
  { name: 'Faber', slug: 'faber' },
  { name: 'Kent', slug: 'kent' },
  { name: 'Panasonic', slug: 'panasonic' },
  { name: 'Under Armour', slug: 'under-armour' },
  { name: 'Reebok', slug: 'reebok' },
  { name: 'OM System', slug: 'om-system' },
  { name: 'GoPro', slug: 'gopro' },
  { name: 'Insta360', slug: 'insta360' },
  { name: 'DJI', slug: 'dji' },
  { name: 'Leica', slug: 'leica' },
  { name: 'Ricoh', slug: 'ricoh' },
  { name: 'Seiko', slug: 'seiko' },
  { name: 'Art Street', slug: 'art-street' },
  { name: 'Generic', slug: 'generic' },
  { name: 'Homesake', slug: 'homesake' },
  { name: 'Ugaoo', slug: 'ugaoo' },
  { name: 'Solimo', slug: 'solimo' },
  { name: 'CraftVatika', slug: 'craftvatika' },
  { name: 'FurniCraft', slug: 'furnicraft' },
  { name: 'AGARO', slug: 'agaro' },
  { name: 'eCraftIndia', slug: 'ecraftindia' },
  { name: 'Status', slug: 'status' },
  { name: 'Giftana', slug: 'giftana' },
  { name: 'ExclusiveLane', slug: 'exclusivelane' },
  { name: 'Fourwalls', slug: 'fourwalls' },
  { name: 'Home Centre', slug: 'home-centre' },
  { name: 'Art Lounge', slug: 'artlounge' },
  { name: 'HomeTown', slug: 'hometown' },
  { name: 'Story@Home', slug: 'storyathome' },
  { name: 'Chitra Handicraft', slug: 'chitra-handicraft' },
  { name: 'Fire-Boltt', slug: 'fire-boltt' },
  { name: 'Titan', slug: 'titan' },
  { name: 'Fastrack', slug: 'fastrack' },
  { name: 'Huawei', slug: 'huawei' },
  { name: 'Sennheiser', slug: 'sennheiser' },
  { name: 'Skullcandy', slug: 'skullcandy' },
  { name: 'HyperX', slug: 'hyperx' },
  { name: 'SteelSeries', slug: 'steelseries' },
  { name: 'Razer', slug: 'razer' },
  { name: 'Audio-Technica', slug: 'audio-technica' },
  { name: 'Beyerdynamic', slug: 'beyerdynamic' },
  { name: 'SG', slug: 'sg' },
  { name: 'SS', slug: 'ss' },
  { name: 'Kookaburra', slug: 'kookaburra' },
  { name: 'Spalding', slug: 'spalding' },
  { name: 'Yonex', slug: 'yonex' },
  { name: 'Wilson', slug: 'wilson' },
  { name: 'Head', slug: 'head' },
  { name: 'Kore', slug: 'kore' },
  { name: 'Lifeline', slug: 'lifeline' },
  { name: 'Boldfit', slug: 'boldfit' },
  { name: 'PowerMax', slug: 'powermax' },
  { name: 'Reach', slug: 'reach' },
  { name: 'Stag', slug: 'stag' },
  { name: 'AmazonBasics', slug: 'amazonbasics' },
  { name: 'FitSimplify', slug: 'fitsimplify' },
  { name: 'RPM Fitness', slug: 'rpm-fitness' },
  { name: 'Aurion', slug: 'aurion' },
  { name: 'TriggerPoint', slug: 'triggerpoint' },
  { name: 'Nivia', slug: 'nivia' },
  { name: 'Kobo', slug: 'kobo' },
  { name: 'HRX', slug: 'hrx' },
  { name: 'Decathlon', slug: 'decathlon' },
  { name: 'HealthSense', slug: 'healthsense' },
  { name: 'American Tourister', slug: 'american-tourister' },
  { name: 'Safari', slug: 'safari' },
  { name: 'Skybags', slug: 'skybags' },
  { name: 'F Gear', slug: 'f-gear' },
  { name: 'Mosiso', slug: 'mosiso' },
  { name: 'J Pillow', slug: 'j-pillow' },
  { name: 'Comfy Living', slug: 'comfy-living' },
  { name: 'Eagle Creek', slug: 'eagle-creek' },
  { name: 'WildHorn', slug: 'wildhorn' },
  { name: 'North Star', slug: 'north-star' },
  { name: 'VIP', slug: 'vip' },
  { name: 'UGREEN', slug: 'ugreen' },
  { name: 'Master Lock', slug: 'master-lock' },
  { name: 'Fur Jaden', slug: 'fur-jaden' },
  { name: 'Redragon', slug: 'redragon' },
  { name: 'Microsoft', slug: 'microsoft' },
  { name: 'Green Soul', slug: 'green-soul' },
  { name: 'Cooler Master', slug: 'cooler-master' },
  { name: 'Cosmic Byte', slug: 'cosmic-byte' },
  { name: 'Govee', slug: 'govee' },
  { name: 'DeckUp', slug: 'deckup' },
  { name: 'PowerA', slug: 'powera' },
  { name: 'Oculus (Meta)', slug: 'oculus' },
  { name: 'Amkette', slug: 'amkette' },
  { name: 'EvoFox', slug: 'evofox' },
  { name: 'Maono', slug: 'maono' },
  { name: 'BenQ', slug: 'benq' },
  { name: 'ViewSonic', slug: 'viewsonic' },
  { name: 'Nokia', slug: 'nokia' }
];

const SPEC_VALUES: { [key: string]: { name: string; value: string }[] } = {
  'smartphones': [
    { name: 'Screen Size', value: '6.7 inches OLED Super Retina' },
    { name: 'RAM', value: '12 GB' },
    { name: 'Storage', value: '256 GB NVMe' },
    { name: 'Battery', value: '5000 mAh Fast Charge' }
  ],
  'laptops': [
    { name: 'Processor', value: 'Intel Core i7 13th Gen' },
    { name: 'RAM', value: '16 GB DDR5' },
    { name: 'Storage', value: '1 TB PCIe NVMe SSD' },
    { name: 'Graphics', value: 'NVIDIA RTX 4060 8GB' }
  ],
  'smart-watches': [
    { name: 'Display', value: '1.43" AMOLED Always-On' },
    { name: 'Sensors', value: 'SpO2 Heart Rate Sleep Tracker' },
    { name: 'Water Resistance', value: '5ATM Water Resistant' }
  ],
  'bluetooth-earbuds': [
    { name: 'Battery Life', value: 'Up to 36 Hours with case' },
    { name: 'ANC', value: 'Active Noise Cancellation 45dB' },
    { name: 'Connectivity', value: 'Bluetooth 5.3' }
  ]
};

const BLUETOOTH_EARBUDS_DATA = [
  {
    title: "AirPods Pro (3rd Gen)",
    brand: "Apple",
    category: "Bluetooth Earbuds",
    description: "Experience the pinnacle of personal audio. The AirPods Pro (3rd Gen) Premium TWS Earbuds feature industry-leading Adaptive Audio, active environmental tuning, and impeccable spatial accuracy for an unmatched listening landscape.",
    price: 24999,
    discount: 10,
    stock: 35,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1289&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Premium TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3 / H2 Chip" },
      { name: "ANC", value: "Yes, 2x Active Noise Cancellation" },
      { name: "Water Resistance", value: "IP54 Dust, Sweat and Water Resistant" }
    ]
  },
  {
    title: "AirPods 4",
    brand: "Apple",
    category: "Bluetooth Earbuds",
    description: "Iconic open-ear comfort meets modern acoustic engineering. The AirPods 4 TWS Earbuds deliver personalized Spatial Audio with dynamic head tracking, express charging, and highly responsive touch controls.",
    price: 14999,
    discount: 5,
    stock: 45,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1632414968156-fa30ab837b70?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Chip", value: "H2 Acoustic Chip" },
      { name: "Battery Life", value: "Up to 30 Hours with Case" }
    ]
  },
  {
    title: "Galaxy Buds 3 Pro",
    brand: "Samsung",
    category: "Bluetooth Earbuds",
    description: "Reimagined with a bold modern design. The Samsung Galaxy Buds 3 Pro Premium TWS Earbuds feature dynamic blade lights, high-fidelity 24-bit audio support, and intelligent Galaxy AI ambient adjustment.",
    price: 18999,
    discount: 8,
    stock: 25,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/31klCy7lHYL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Titanium Silver", "Pearl White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Premium TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.4" },
      { name: "Audio", value: "24-bit Hi-Fi Ultra High Quality Audio" },
      { name: "AI Support", value: "Galaxy AI Interpreter Mode Compatible" }
    ]
  },
  {
    title: "Galaxy Buds FE",
    brand: "Samsung",
    category: "Bluetooth Earbuds",
    description: "Exceptional everyday listening designed with user comfort in mind. The Galaxy Buds FE TWS Earbuds combine deep, punchy bass, highly effective active noise clearance, and ergonomic secure-wing tips.",
    price: 6999,
    discount: 15,
    stock: 30,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1655560378428-7605bda51749?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Graphite", "White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.2" },
      { name: "ANC", value: "Active Noise Cancellation" },
      { name: "Battery Life", value: "Up to 30 Hours with Case" }
    ]
  },
  {
    title: "WF-1000XM5",
    brand: "Sony",
    category: "Bluetooth Earbuds",
    description: "The official benchmark of active noise cancellation. Equipped with dual proprietary Processors, the Sony WF-1000XM5 Noise Cancelling Earbuds isolate external clutter and generate pure, studio-grade soundscapes.",
    price: 22999,
    discount: 5,
    stock: 18,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1648447267722-77cb7cf4c292?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black", "Silver"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Noise Cancelling Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Processor", value: "Integrated Processor V2 & QN2e" },
      { name: "Hi-Res Audio", value: "LDAC & DSEE Extreme Sound Enhancement" }
    ]
  },
  {
    title: "LinkBuds S",
    brand: "Sony",
    category: "Bluetooth Earbuds",
    description: "Never off, always on. Incredibly small and light, the Sony LinkBuds S TWS Earbuds switch seamlessly between ultra-clear ambient sound and highly focused active noise cancellation for safe urban awareness.",
    price: 11999,
    discount: 10,
    stock: 22,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Earth Blue", "White", "Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.2" },
      { name: "Weight", value: "Incredibly light at 4.8g per earbud" },
      { name: "Waterproof Grade", value: "IPX4 Sweat and Splashproof" }
    ]
  },
  {
    title: "QuietComfort Ultra Earbuds",
    brand: "Bose",
    category: "Bluetooth Earbuds",
    description: "Breathtaking audio realism designed for pure sanctuary. The Bose QuietComfort Ultra Premium Immersive ANC Earbuds personalize performance via CustomTune technology, delivering deep acoustic balance.",
    price: 25999,
    discount: 0,
    stock: 15,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1753973169894-ba4ebd59aff7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Triple Black", "White Smoke"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Premium ANC Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Spatial Audio", value: "Bose Immersive Audio Spatial Mode" },
      { name: "Calibration", value: "CustomTune Smart Room Acoustic Profiler" }
    ]
  },
  {
    title: "Elite 10 Gen 2",
    brand: "Jabra",
    category: "Bluetooth Earbuds",
    description: "The ultimate earbuds for work, workout, and leisure. The Jabra Elite 10 Gen 2 Premium TWS Earbuds offer unparalleled ComfortFit design, Dolby Atmos Spatial Audio, and dual-connection smart-case streaming.",
    price: 19999,
    discount: 5,
    stock: 20,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1668338573088-44540e37b403?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Cocoa Brown", "Titanium Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Premium TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3 LE Ready" },
      { name: "Spatial Sound", value: "Dolby Spatial Audio with Head Tracking" },
      { name: "IP Rating", value: "IP57 Fully Sweatproof-Dustproof" }
    ]
  },
  {
    title: "OnePlus Buds Pro 3",
    brand: "OnePlus",
    category: "Bluetooth Earbuds",
    description: "Sculpted with a premium vegan leather wrap texture and Dynaudio acoustic tuning. The OnePlus Buds Pro 3 dual-driver ANC Earbuds deliver crisp studio treble and roaring sub-bass notes.",
    price: 11999,
    discount: 8,
    stock: 28,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1699290438461-c89f6db093be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Midnight Oasis", "Lunar Silver"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "ANC Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.4" },
      { name: "Acoustics", value: "Dual Drivers Tuned by Dynaudio" },
      { name: "Noise Control", value: "Up to 50dB Adaptive Active Noise Cancellation" }
    ]
  },
  {
    title: "OnePlus Nord Buds 3 Pro",
    brand: "OnePlus",
    category: "Bluetooth Earbuds",
    description: "High-octane performance within reach. The OnePlus Nord Buds 3 Pro Budget TWS Earbuds packing 49dB hybrid active noise block, titanium-coated bass drivers, and massive 44-hour absolute battery capacity.",
    price: 4999,
    discount: 10,
    stock: 40,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1698244244114-b0eb90869056?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Starry Blue", "Soft Onyx"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Budget TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.4" },
      { name: "Acoustics", value: "12.4mm Titanized Dynamic Bass Drivers" },
      { name: "Battery", value: "Up to 44 Hours total play session" }
    ]
  },
  {
    title: "Buds Air 7 Pro",
    brand: "Realme",
    category: "Bluetooth Earbuds",
    description: "Immersive audio boundaries. The Realme Buds Air 7 Pro ANC Earbuds combine advanced high-resolution spatial algorithms, dual dynamic hardware drivers, and crystal-clear environmental mic buffers.",
    price: 5999,
    discount: 12,
    stock: 35,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1655804439989-24758d6e96b8?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Astral Gold", "Tech Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "ANC Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "ANC Tech", value: "50dB Hybrid Active Noise Cancellation" },
      { name: "Hi-Res Audio", value: "LDAC High-Definition Audio Codec Support" }
    ]
  },
  {
    title: "Buds T350",
    brand: "Realme",
    category: "Bluetooth Earbuds",
    description: "Daring and snappy everyday listening companion. The Realme Buds T350 TWS Earbuds package deep-boosted sound nodes, ergonomic featherweight build, and rapid flash charging layouts.",
    price: 2499,
    discount: 10,
    stock: 50,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1585565804112-f201f68c48b4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Satin Black", "Glaze White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Acoustics", value: "10mm Bass Boost Driver" },
      { name: "Latency", value: "88ms Super Low Latency Gaming Mode" }
    ]
  },
  {
    title: "Redmi Buds 6 Pro",
    brand: "Xiaomi",
    category: "Bluetooth Earbuds",
    description: "Premium acoustic technology for an executive auditory lifestyle. The Redmi Buds 6 Pro ANC Earbuds offer high-fidelity coaxial dual drivers, smart customized EQ templates, and incredibly quiet noise gating.",
    price: 5499,
    discount: 15,
    stock: 25,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/31NCVDyMSBL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Classic Black", "Ice White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "ANC Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Hardware", value: "Coaxial Dual Drivers (11mm + 6mm)" },
      { name: "ANC Gating", value: "Up to 52dB Extreme Noise Cancellation" }
    ]
  },
  {
    title: "Redmi Buds 6 Lite",
    brand: "Xiaomi",
    category: "Bluetooth Earbuds",
    description: "Essential listening dialed in with clean acoustic clarity. The Redmi Buds 6 Lite Budget TWS Earbuds offer clear voice calls via robust dual microphone configurations and full companion app access.",
    price: 2299,
    discount: 5,
    stock: 45,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/31dJ0TbMSQL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Polar Blue", "Slate Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Budget TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Microphone", value: "Dual Mic AI Environmental Noise Gating" },
      { name: "Battery Life", value: "Up to 36 Hours total" }
    ]
  },
  {
    title: "Airdopes 311 Pro",
    brand: "boAt",
    category: "Bluetooth Earbuds",
    description: "Ignite your casual sessions with Signature boAt high performance audio. The Airdopes 311 Pro TWS Earbuds sport rapid charge options, responsive touch surfaces, and smooth dual device pairing switches.",
    price: 1999,
    discount: 25,
    stock: 60,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Mint Green", "Active Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3 with IWP Technology" },
      { name: "Acoustics", value: "10mm Signature boAt Drivers" },
      { name: "Charging", value: "ASAP Fast Charge (10 mins = 150 mins play)" }
    ]
  },
  {
    title: "Airdopes Supreme",
    brand: "boAt",
    category: "Bluetooth Earbuds",
    description: "Pure sonic luxury tailored for intense everyday use. The boAt Airdopes Supreme ANC Earbuds present advanced environmental sound reduction algorithms and sweatproof durability grids.",
    price: 3499,
    discount: 10,
    stock: 35,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1598331668826-20cecc596b86?q=80&w=1336&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Navy", "Soft Gray"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "ANC Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "ANC", value: "Hybrid Active Noise Cancellation 32dB" },
      { name: "Durability Rating", value: "IPX5 Sweat & Water Protection" }
    ]
  },
  {
    title: "Noise Buds Combat X",
    brand: "Noise",
    category: "Bluetooth Earbuds",
    description: "Ultimate tactical responsiveness for zero combat delays. Engineered specifically for competitive tournaments, the Noise Buds Combat X Gaming Earbuds render footsteps and shootouts instantly.",
    price: 2499,
    discount: 15,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61bcY1YYXoL._SX522_.jpg"],
    colors: ["Cyber Green Neon", "Stealth Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Gaming Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.4" },
      { name: "Latency Rate", value: "38ms Ultra-Low Latency Combat Mode" },
      { name: "RGB Lights", value: "Breathing Gaming LED Accents" }
    ]
  },
  {
    title: "Noise Buds VS601",
    brand: "Noise",
    category: "Bluetooth Earbuds",
    description: "Featherweight everyday companion styled to stand out. Incorporates crisp voice-call focus structures, powerful high frequency drivers, and smooth voice assistant triggers.",
    price: 1799,
    discount: 10,
    stock: 48,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/31m9nH4zJfL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Stardust White", "Carbon Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Sound Engineering", value: "Tru Bass 11mm Advanced Drivers" },
      { name: "Voice Support", value: "Siri and Google Assistant Instantly Accessible" }
    ]
  },
  {
    title: "JBL Live Beam 3",
    brand: "JBL",
    category: "Bluetooth Earbuds",
    description: "Welcome to smart earbud innovation. The JBL Live Beam 3 Premium ANC Earbuds feature a revolutionary smart charging case with full vibrant touchscreen controls to tweak EQ and calls directly.",
    price: 14999,
    discount: 5,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/31WEBrY1PyL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Classic Silver", "Space Gray"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Premium ANC Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3 Multipoint" },
      { name: "Smart Case", value: "Integrated full touchscreen display" },
      { name: "Acoustics", value: "JBL Signature Spatial Audio" }
    ]
  },
  {
    title: "JBL Tune Beam 2",
    brand: "JBL",
    category: "Bluetooth Earbuds",
    description: "Punchy, deep bass that drives your day forward. The JBL Tune Beam 2 TWS Earbuds employ pure bass optimization, highly comfortable secure stick structures, and dynamic splash-proof chassis.",
    price: 5999,
    discount: 8,
    stock: 35,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/31iqsKhPxQL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Classic Blue", "Graphite Black", "Soft White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "TWS Earbuds" },
      { name: "Connectivity", value: "Bluetooth 5.3 Multipoint" },
      { name: "Bass Tech", value: "JBL Pure Bass Audio Profiling" },
      { name: "Battery Life", value: "Up to 48 Hours with charging case" }
    ]
  }
];

const SPEAKERS_DATA = [
  {
    title: "SoundLink Max",
    brand: "Bose",
    category: "Speakers",
    description: "Powerful portable Bluetooth speaker designed for maximum acoustic immersion. SoundLink Max delivers deep rich stereo performance, outdoor-ready resilience, and long-lasting playtime.",
    price: 34999,
    discount: 10,
    stock: 25,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/41FyxQrrdgL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Triple Black", "White Smoke"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Portable Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Battery Life", value: "Up to 20 Hours" },
      { name: "Durability", value: "IP67 Dustproof and Waterproof" }
    ]
  },
  {
    title: "SoundLink Flex Gen 2",
    brand: "Bose",
    category: "Speakers",
    description: "Clear, crisp, and ready for any adventure. The SoundLink Flex Gen 2 portable speaker features PositionIQ technology to optimize sound whichever way it stands or hangs.",
    price: 14999,
    discount: 5,
    stock: 40,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61QLvGAkkvL._SX679_.jpg"],
    colors: ["Black", "Stone Blue", "Sage Green"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Portable Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Sound Optimization", value: "PositionIQ Technology" },
      { name: "Dust & Water Resistance", value: "IP67" }
    ]
  },
  {
    title: "JBL PartyBox 320",
    brand: "JBL",
    category: "Speakers",
    description: "Bring the concert home or take it on the road. The JBL PartyBox 320 delivers massive JBL Pro Sound with synced dynamic light shows and convenient telescopic handle/wheels.",
    price: 39999,
    discount: 12,
    stock: 15,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/314EaEaACDL._SX300_SY300_QL70_FMwebp_.jpg"],
    colors: ["Midnight Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Party Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.4 / Auracast" },
      { name: "Output Power", value: "240W RMS" },
      { name: "Special Feature", value: "AI Sound Boost and Interactive Light Shows" }
    ]
  },
  {
    title: "JBL Flip 7",
    brand: "JBL",
    category: "Speakers",
    description: "The iconic portable companion upgraded. JBL Flip 7 features a new dual-way speaker design delivering stunning clarity, booming bass, and reliable waterproof performance.",
    price: 12999,
    discount: 8,
    stock: 45,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/41tP4RfhbfL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Squad", "Blue", "Black", "Red"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Portable Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Battery Life", value: "Up to 12 Hours" },
      { name: "Waterproof Rating", value: "IP67 Waterproof" }
    ]
  },
  {
    title: "JBL Charge 6",
    brand: "JBL",
    category: "Speakers",
    description: "Bold sound meets built-in powerbank. The JBL Charge 6 dual-driver speaker lets you stream music and charge your smartphone at the same time, without missing a single beat.",
    price: 16999,
    discount: 10,
    stock: 35,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/41IYZsihJ7L._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Teal", "Squad", "Black", "Red"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Portable Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Powerbank Function", value: "Charge external devices via USB port" },
      { name: "Battery", value: "Up to 20 Hours total life" }
    ]
  },
  {
    title: "SRS-XG500",
    brand: "Sony",
    category: "Speakers",
    description: "Go anywhere, party hard. Sony SRS-XG500 party speaker features high-efficiency tweeters, X-balanced speaker units, and sleek passive radiators for massive clear club vibes.",
    price: 29999,
    discount: 15,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/31jcIr2ZF9L._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Party Speaker" },
      { name: "Connectivity", value: "Bluetooth / USB Media Reader" },
      { name: "Durability", value: "IP66 Water-resistant and Dustproof" },
      { name: "Sound Feature", value: "MEGA BASS and Dynamic Ambient Lighting" }
    ]
  },
  {
    title: "ULT Field 7",
    brand: "Sony",
    category: "Speakers",
    description: "Engineered for massive, skull-thumping bass. The Sony ULT Field 7 brings live concert energy straight to your backyard with ULT buttons to toggle intense acoustic modes.",
    price: 24999,
    discount: 5,
    stock: 22,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/31qsqRlOZHL._SX300_SY300_QL70_FMwebp_.jpg"],
    colors: ["Forest Green", "Off White", "Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Portable Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Audio Customization", value: "ULT Bass modes (ULT1/ULT2)" },
      { name: "Fast Charge", value: "10-minute charge gives up to 3 hours play" }
    ]
  },
  {
    title: "ULT Tower 10",
    brand: "Sony",
    category: "Speakers",
    description: "The absolute pinnacle of audio systems. The Sony ULT Tower 10 is a tall party speaker that features omnidirectional sound, vibrant interactive party lights, and wireless microphone support.",
    price: 54999,
    discount: 7,
    stock: 8,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/2164z6VaP6L._SX300_SY300_QL70_FMwebp_.jpg"],
    colors: ["Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Party Speaker" },
      { name: "Connectivity", value: "Bluetooth / Optical input" },
      { name: "Soundstage", value: "360-degree Omnidirectional Sound" },
      { name: "Microphone Hookup", value: "Included wireless microphone for Karaoke" }
    ]
  },
  {
    title: "HomePod (3rd Gen)",
    brand: "Apple",
    category: "Speakers",
    description: "Impeccably detailed. Apple HomePod (3rd Gen) Smart Speaker utilizes high-excursion woofers, beamforming tweeters, and room-sensing intelligence to fill spaces with rich high-fidelity audio.",
    price: 32999,
    discount: 5,
    stock: 20,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/71MXrXqcyEL._SY741_.jpg"],
    colors: ["Midnight Black", "White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Smart Speaker" },
      { name: "Connectivity", value: "Wi-Fi and Bluetooth 5.3" },
      { name: "Assistant", value: "Siri Smart Assistant Built-in" },
      { name: "Audio Intelligence", value: "Room Sensing Adaptive EQ Optimization" }
    ]
  },
  {
    title: "HomePod Mini",
    brand: "Apple",
    category: "Speakers",
    description: "Small footprint, massive sound presence. The Apple HomePod Mini integrates seamlessly with Apple ecosystem devices to act as a smart hub while delivering beautiful 360-degree acoustics.",
    price: 10999,
    discount: 0,
    stock: 35,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61oYKFKUQoL._SY741_.jpg"],
    colors: ["Space Gray", "Blue", "Yellow", "Orange", "White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Smart Speaker" },
      { name: "Connectivity", value: "Wi-Fi and Bluetooth" },
      { name: "Size", value: "Ultra-compact ball design (3.3 inches tall)" },
      { name: "Smart Assistant", value: "Siri ready with intercom support" }
    ]
  },
  {
    title: "Echo Studio",
    brand: "Amazon",
    category: "Speakers",
    description: "Immersive smart audio like never before. The Amazon Echo Studio smart speaker features five directional speakers producing rich, immersive 3D spatial audio powered by Dolby Atmos and Sony 360 SDK.",
    price: 22999,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61H16Iw9AYL._SY450_.jpg"],
    colors: ["Charcoal Black", "Glacier White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Smart Speaker" },
      { name: "Connectivity", value: "Wi-Fi and Bluetooth" },
      { name: "Smart Control", value: "Alexa Voice Assistant Built-in" },
      { name: "Acoustics", value: "5-Speaker Config with 3D Spatial Audio" }
    ]
  },
  {
    title: "Echo Dot (6th Gen)",
    brand: "Amazon",
    category: "Speakers",
    description: "Our most popular smart speaker upgraded. The Amazon Echo Dot (6th Gen) features custom vocal enhancement, deeper bass response, and elegant LED clock front display.",
    price: 5499,
    discount: 8,
    stock: 50,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61W6P2lMujL._SY741_.jpg"],
    colors: ["Deep Sea Blue", "Charcoal Black", "Glacier White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Smart Speaker" },
      { name: "Connectivity", value: "Wi-Fi and Bluetooth" },
      { name: "Assistant", value: "Alexa Voice Control ready" },
      { name: "Smart Home", value: "Built-in temperature and motion sensors" }
    ]
  },
  {
    title: "Nest Audio",
    brand: "Google",
    category: "Speakers",
    description: "Acoustics designed to adapt to your environment. The Google Nest Audio smart speaker plays music dynamically with rich bass and crystal clear high vocal range tuned to perfection.",
    price: 8999,
    discount: 12,
    stock: 28,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/514gSxxyHcL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Chalk Grey", "Charcoal Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Smart Speaker" },
      { name: "Connectivity", value: "Wi-Fi and Bluetooth 5.0" },
      { name: "Smart Engine", value: "Google Assistant Built-in" },
      { name: "Multiroom support", value: "Group multiple Nest speakers easily" }
    ]
  },
  {
    title: "Beosound A1 3rd Gen",
    brand: "Bang & Olufsen",
    category: "Speakers",
    description: "Premium visual design matching sublime acoustics. The Bang & Olufsen Beosound A1 3rd Gen portable Bluetooth speaker provides true 360 sound inside a sandblasted pearl aluminum dome.",
    price: 29999,
    discount: 5,
    stock: 10,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/41Ry6jOdveL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Anthracite Black", "Grey Mist", "Gold Tone"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Premium Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.1 / aptX Adaptive" },
      { name: "Materials", value: "Pearl-blasted aluminum & polymer base" },
      { name: "Voice Assistant", value: "Alexa Voice assistant supported" }
    ]
  },
  {
    title: "Stone 1800 Pro",
    brand: "boAt",
    category: "Speakers",
    description: "Rugged exterior, powerful indoor acoustics. The boAt Stone 1800 Pro speaker delivers 45W boAt Signature Sound with dynamic passive bass radiators and robust travel handles.",
    price: 4499,
    discount: 20,
    stock: 45,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/418ot2c59BL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Active Black", "Military Green"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Power Output", value: "45W RMS Signature Sound" },
      { name: "Playback Mode", value: "Bluetooth, AUX, or USB Flash drives" }
    ]
  },
  {
    title: "Stone Lumos",
    brand: "boAt",
    category: "Speakers",
    description: "Set the mood right. The boAt Stone Lumos Bluetooth speaker features fully customizable 7-mode LED breathing light patterns paired with incredibly clear stereo audio.",
    price: 2999,
    discount: 15,
    stock: 40,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/51P3BOfehwL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Midnight Gold", "Carbon Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Ambient Lights", value: "7 LED Light Show Modes" },
      { name: "Charging Time", value: "Around 2.5 hours via Type-C" }
    ]
  },
  {
    title: "Soundcore Motion X600",
    brand: "Anker",
    category: "Speakers",
    description: "The world's first portable high-fidelity speaker with spatial audio. Inspired by theatre acoustics, the Soundcore Motion X600 features high-definition LDAC coding.",
    price: 18999,
    discount: 10,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/41Wut5WybfL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Polar Gray", "Aurora Green", "Steel Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Hi-Res Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3 / LDAC" },
      { name: "Audio Spec", value: "50W immersive Spatial Sound layout" },
      { name: "High-Res Certificate", value: "High-Res Wireless Audio certified" }
    ]
  },
  {
    title: "Soundcore Select Pro",
    brand: "Anker",
    category: "Speakers",
    description: "Outdoor-ready audio companion. Featuring BassUp technology, fully customize the EQ directly inside the Soundcore app, and enjoy synced party lights.",
    price: 7999,
    discount: 12,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/4144MiaF3OL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Onyx Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Portable Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Bass Technology", value: "BassUp Real-Time Low-End enhancement" },
      { name: "Playtime", value: "Up to 16 Hours on a single charge" }
    ]
  },
  {
    title: "Mi Portable Bluetooth Speaker 16W",
    brand: "Xiaomi",
    category: "Speakers",
    description: "16W of exceptionally clear, balanced, and punchy audio output. Engineered by Xiaomi, this portable speaker can easily form a dual wireless stereo group.",
    price: 2499,
    discount: 8,
    stock: 55,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/31Hm2SoCMtL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Blue", "Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Bluetooth Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Audio Out", value: "16W Dual Sound Modes" },
      { name: "Waterproof Case", value: "IPX7 waterproof construction" }
    ]
  },
  {
    title: "Harman Kardon Onyx Studio 9",
    brand: "Harman Kardon",
    category: "Speakers",
    description: "Impeccable acoustic geometry. The Harman Kardon Onyx Studio 9 premium speaker delivers room-filling luxury audio paired with an anodized aluminum handle.",
    price: 24999,
    discount: 10,
    stock: 10,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61G5dqP5IBL._SX300_SY300_QL70_FMwebp_.jpg"],
    colors: ["Classic Grey", "Midnight Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Premium Speaker" },
      { name: "Connectivity", value: "Bluetooth 5.3 Multipoint" },
      { name: "Calibration", value: "Auto-Self Tuning Acoustic Room Calibrator" },
      { name: "Transducer", value: "Dual Tweeter and Single Bass Woofer Config" }
    ]
  }
];

const SPORTS_WEAR_DATA = [
  {
    title: "Dri-FIT Running T-Shirt",
    brand: "Nike",
    category: "Sports Wear",
    description: "Supercharge your run with the Nike Dri-FIT Running T-Shirt. Crafted with sweat-wicking lightweight fabric and flat seams to keep you cool, dry, and entirely comfortable throughout your miles.",
    price: 1499,
    discount: 10,
    stock: 50,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61F+bjnAGiL._AC_SX679_.jpg"],
    colors: ["Black", "Royal Blue", "Heather Gray"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Recycled Polyester" },
      { name: "Fit", value: "Standard Fit" },
      { name: "Technology", value: "Nike Dri-FIT Tech" },
      { name: "Type", value: "Sports T-Shirt" }
    ]
  },
  {
    title: "Own The Run Tee",
    brand: "Adidas",
    category: "Sports Wear",
    description: "Designed for ultimate ventilation on warm-weather segments, the Adidas Own The Run Tee features moisture-absorbing Aeroready panels and 360-degree reflectivity for safe twilight jogs.",
    price: 1299,
    discount: 5,
    stock: 45,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71zK5dxxaVL._SY879_.jpg"],
    colors: ["Active Red", "Classic Black", "Glacier White"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Mock Eyelet Polyester" },
      { name: "Technology", value: "Aeroready Sweat Clearance" },
      { name: "Reflectivity", value: "360-degree reflective accents" },
      { name: "Type", value: "Sports T-Shirt" }
    ]
  },
  {
    title: "Active Training Shorts",
    brand: "Puma",
    category: "Sports Wear",
    description: "Move effortlessly through heavy weight reps and agility runs. The Puma Active Training Shorts combine extreme dryCELL moisture evacuation with highly breathable mesh panels.",
    price: 1199,
    discount: 15,
    stock: 35,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61dINsGfswL._SX679_.jpg"],
    colors: ["Puma Black", "Teal Blue"],
    sizes: ["M", "L", "XL"],
    specifications: [
      { name: "Material", value: "90% Polyester, 10% Elastane" },
      { name: "Inseam", value: "7 Inches" },
      { name: "Pocket Config", value: "Two secure side zip pockets" },
      { name: "Type", value: "Sports Shorts" }
    ]
  },
  {
    title: "Flex Running Shorts",
    brand: "Under Armour",
    category: "Sports Wear",
    description: "Featuring incredibly light, ultra-durable stretch-woven fabric, the Under Armour Flex Running Shorts move completely with your body. Packed with internal mesh brief liners for support.",
    price: 1599,
    discount: 12,
    stock: 30,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/41U773N4IXL._SX679_.jpg"],
    colors: ["Stealth Gray", "Black Jet"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Lightweight Polyester" },
      { name: "Lining", value: "Internal breathable brief lining" },
      { name: "Waistband", value: "Encased elastic with internal drawcord" },
      { name: "Type", value: "Sports Shorts" }
    ]
  },
  {
    title: "Performance Track Pants",
    brand: "Nike",
    category: "Sports Wear",
    description: "Train without heavy drag. The Nike Performance Track Pants offer sleek tapered cuts, ankle zippers for rapid on-and-off transitions, and responsive Dri-FIT stretch fabric.",
    price: 2499,
    discount: 10,
    stock: 28,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71EmFwDi3mL._SX569_.jpg"],
    colors: ["Jet Black", "Navy Blue"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "88% Polyester, 12% Spandex" },
      { name: "Cut", value: "Modern tapered design" },
      { name: "Zipper", value: "Ankle zippers for easy transitions over footwear" },
      { name: "Type", value: "Track Pants" }
    ]
  },
  {
    title: "Essentials Training Joggers",
    brand: "Adidas",
    category: "Sports Wear",
    description: "Impeccable casual warmth during brisk early morning warmups. The Adidas Essentials Training Joggers offer soft cotton-blend fleece, ribbed ankle cuffs, and signature side stripes.",
    price: 2299,
    discount: 5,
    stock: 40,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61MxYB5yOqL._SY741_.jpg"],
    colors: ["Medium Gray", "Midnight Black"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "70% Cotton, 30% Recycled Fleece" },
      { name: "Cuff Style", value: "Ribbed Elastic" },
      { name: "Brand Detail", value: "Iconic Adidas 3-Stripes branding" },
      { name: "Type", value: "Joggers" }
    ]
  },
  {
    title: "DryCELL Sports Hoodie",
    brand: "Puma",
    category: "Sports Wear",
    description: "Don't let the cooler weather disrupt your goals. Active training hoodie from Puma loaded with dryCELL high-efficiency moisture extraction and ergonomic raglan sleeves.",
    price: 2999,
    discount: 10,
    stock: 25,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61Jjm5Nj6GL._SY879_.jpg"],
    colors: ["Peacoat Blue", "Puma Gray"],
    sizes: ["M", "L", "XL", "2XL"],
    specifications: [
      { name: "Material", value: "100% Polyester Double Knit" },
      { name: "Hood Style", value: "Drawcord-adjustable hood" },
      { name: "Sleeve style", value: "Raglan sleeves for natural motion" },
      { name: "Type", value: "Sports Hoodie" }
    ]
  },
  {
    title: "Rival Fleece Hoodie",
    brand: "Under Armour",
    category: "Sports Wear",
    description: "Your absolute favorite warm-up hoodie. Extremely soft, mid-weight cotton-bend fleece with a brushed interior for premium insulation and a versatile athletic drape.",
    price: 3499,
    discount: 8,
    stock: 20,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/613G0VfIOjL._SX679_.jpg"],
    colors: ["Pitch Gray", "Royal Blue", "Black"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "80% Cotton, 20% Polyester fleece blend" },
      { name: "Interior", value: "Brushed fleece for enhanced warmth" },
      { name: "Pocket", value: "Front kangaroo pocket" },
      { name: "Type", value: "Sports Hoodie" }
    ]
  },
  {
    title: "Compression Training Tights",
    brand: "Reebok",
    category: "Sports Wear",
    description: "Unleash high performance velocity. Reebok Compression Training Tights lock in muscles to mitigate exhaustion, while Speedwick fiber keeps you exceptionally comfortable.",
    price: 1999,
    discount: 15,
    stock: 24,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61g2ATtn-CL._SY741_.jpg"],
    colors: ["Black", "Steel Blue"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "Speedwick 84% Polyester, 16% Elastane" },
      { name: "Compression", value: "Full tight compression lock-in fit" },
      { name: "Seams", value: "Flatlock stitching to eliminate chafing" },
      { name: "Type", value: "Compression Wear" }
    ]
  },
  {
    title: "Pro Combat Compression Tee",
    brand: "Nike",
    category: "Sports Wear",
    description: "The premier base-layer of elite athletes. The Nike Pro Combat Compression Tee locks onto your upper body to support optimal blood flow and keep muscles active.",
    price: 2199,
    discount: 10,
    stock: 35,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/51oRv6R40xL._SX679_.jpg"],
    colors: ["Steller White", "Stealth Black"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "84% Recycled Polyester, 16% Elastane" },
      { name: "Stitch Method", value: "Flat, irritation-free seams" },
      { name: "Ventilation", value: "Targeted underarm mesh venting panels" },
      { name: "Type", value: "Compression Wear" }
    ]
  },
  {
    title: "Team India Cricket Jersey",
    brand: "Adidas",
    category: "Sports Wear",
    description: "Bleed blue in pure pride. The Adidas official Team India ODI Cricket Jersey features premier tricolor details, breathable mesh, and official team badges.",
    price: 4999,
    discount: 5,
    stock: 15,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/41vCXKPiIXL.jpg"],
    colors: ["Indian Blue"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    specifications: [
      { name: "Material", value: "100% Recycled Primegreen Polyester" },
      { name: "Theme", value: "Official BCCI Team India Edition" },
      { name: "Collar Type", value: "Modern Ribbed Crew Neck" },
      { name: "Type", value: "Sports Jersey" }
    ]
  },
  {
    title: "Training Tracksuit Set",
    brand: "Puma",
    category: "Sports Wear",
    description: "All-in-one athletic coordination. This Puma training tracksuit set provides a regular-fit zip sweater paired with comfortable drawcord pants for active recovery.",
    price: 5499,
    discount: 12,
    stock: 18,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/31VFrcn57hL.jpg"],
    colors: ["Classic Navy", "Jet Black"],
    sizes: ["M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Premium Tricot Polyester" },
      { name: "Set Contains", value: "1 Zip-Up Jacket and 1 Track Pant" },
      { name: "Lining", value: "Highly breathable mesh interior lining" },
      { name: "Type", value: "Tracksuit" }
    ]
  }
];

const FITNESS_EQUIPMENT_DATA = [
  {
    title: "Yoga Mat (6mm Anti-Slip)",
    brand: "Boldfit",
    category: "Fitness Equipment",
    description: "Full physical and yoga exercise mat. High-density 6mm thickness offers premium cushioning while the double-sided textured non-slip design guarantees optimal grip and balance on any floor surface.",
    price: 999,
    discount: 8,
    stock: 45,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51VuwOmpbML._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Ocean Blue", "Slate Grey", "Olive Green"],
    sizes: ["6mm Premium"],
    specifications: [
      { name: "Material", value: "TPE (Eco-Friendly / Latex-Free)" },
      { name: "Thickness", value: "6mm Cushioning" },
      { name: "Features", value: "Non-slip dual texture, alignment lines, moisture-resistant" },
      { name: "Sub-Category", value: "Yoga Accessories" }
    ]
  },
  {
    title: "Adjustable Dumbbell Set 20kg",
    brand: "AmazonBasics",
    category: "Fitness Equipment",
    description: "The ultimate solution for home fitness heavy lifts. High-integrity iron plates with secure chrome bars can be adjusted incrementally to customise work load up to 20kg easily.",
    price: 4999,
    discount: 10,
    stock: 15,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/51RCPRgChnL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Black-Chrome"],
    sizes: ["20kg Set"],
    specifications: [
      { name: "Max Weight", value: "20kg package" },
      { name: "Material", value: "Durable chrome plates & steel bars" },
      { name: "Content", value: "4 x 2.5kg, 4 x 1.25kg plates, 2 spinlock bars, 4 collars" },
      { name: "Sub-Category", value: "Strength Training" }
    ]
  },
  {
    title: "Resistance Bands Set (11 pcs)",
    brand: "FitSimplify",
    category: "Fitness Equipment",
    description: "Complete physical therapy and resistance training pack. Consists of 5 natural latex tube bands with different tension grades, combined with ankle straps, door anchors and handles.",
    price: 799,
    discount: 5,
    stock: 30,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/712JFZ5ggDL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Multicolor"],
    sizes: ["11-pc Comfort Grip"],
    specifications: [
      { name: "Material", value: "100% Eco-Pure Latex" },
      { name: "Tension Grades", value: "Yellow (10 lbs) to Black (30 lbs), combined stack up to 100 lbs" },
      { name: "Accessories", value: "2 foam handles, 2 ankle straps, 1 door anchor, 1 travel pouch" },
      { name: "Sub-Category", value: "Fitness Accessories" }
    ]
  },
  {
    title: "Skipping Rope Steel Cable",
    brand: "RPM Fitness",
    category: "Fitness Equipment",
    description: "Engineered for high-speed workouts, double-unders and fitness drills. Equipped with precision ball bearings and an adjustable steel cable skin to ensure smooth, lightning-fast rotations without tangles.",
    price: 299,
    discount: 5,
    stock: 50,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/51IonJvZe1L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Pitch Black"],
    sizes: ["Standard 10ft Adjustable"],
    specifications: [
      { name: "Cable Material", value: "Coated steel wire cable" },
      { name: "Handle", value: "Lightweight anti-slip ergonomic grip" },
      { name: "Bearings", value: "360-degree high-speed ball bearings" },
      { name: "Sub-Category", value: "Cardio Equipment" }
    ]
  },
  {
    title: "Ab Roller Wheel Dual",
    brand: "Boldfit",
    category: "Fitness Equipment",
    description: "Double-wheel abdominal exerciser designed to build core stability. The dual-wheel tracking mechanism offers superior safety balance, cushioned handles prevent wrist fatigue, and included knee mat protects knees.",
    price: 699,
    discount: 10,
    stock: 25,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61rYoHhYS3L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Neon Blue-Black"],
    sizes: ["Heavy Duty Dual"],
    specifications: [
      { name: "Wheel Design", value: "Dual wide wheels" },
      { name: "Handle Material", value: "Sweat-wicking foam grip" },
      { name: "Extra Accessories", value: "High quality premium eva knee pad mat" },
      { name: "Sub-Category", value: "Abdominal Trainer" }
    ]
  },
  {
    title: "Push-Up Bars Steel Handle",
    brand: "Aurion",
    category: "Fitness Equipment",
    description: "Intensify push-up push angles and protect wrist joints. Designed with a sturdy heavy-duty industrial carbon steel arch, layered with thick protective foam pads to assure full non-slip control.",
    price: 599,
    discount: 8,
    stock: 20,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61vx0ibQE4L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Steel Grey-Black"],
    sizes: ["Standard Pair"],
    specifications: [
      { name: "Material", value: "High-tensile carbon steel" },
      { name: "Grip", value: "Textured soft foam handle cushion" },
      { name: "Stability", value: "Non-skid protective base caps" },
      { name: "Sub-Category", value: "Strength Training" }
    ]
  },
  {
    title: "Foam Roller Muscle Massager",
    brand: "TriggerPoint",
    category: "Fitness Equipment",
    description: "Target core tightness and speed up muscle recovery. Multi-density surface grid channels oxygen and blood directly to tight knots, imitating a professional therapeutic deep-tissue massage.",
    price: 1499,
    discount: 5,
    stock: 18,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61vVFFaZUML._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Bright Lime Green"],
    sizes: ["13-inch Classic"],
    specifications: [
      { name: "Material", value: "Premium EVA foam over solid hollow core" },
      { name: "Max Load", value: "Up to 500 lbs static weight limit" },
      { name: "Design", value: "Multi-patterned matrix grid" },
      { name: "Sub-Category", value: "Recovery Equipment" }
    ]
  },
  {
    title: "Gym Gloves (Men/Women)",
    brand: "Nivia",
    category: "Fitness Equipment",
    description: "Engineered for heavy lifters. Built with highly breathable, sweat-wicking leather mesh, extra integrated palm reinforcements, and deep velcro wrist locks to prevent blisters and hand slippage.",
    price: 499,
    discount: 5,
    stock: 40,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/81LCXygJMNL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Stealth Black"],
    sizes: ["M", "L", "XL"],
    specifications: [
      { name: "Material", value: "Breathable leather mesh & stretch fabric" },
      { name: "Padding", value: "Dynamic palm gel pads" },
      { name: "Closure", value: "Hook & loop wrist stabilizer wrap" },
      { name: "Sub-Category", value: "Gym Accessories" }
    ]
  },
  {
    title: "Ankle Weights Pair 2kg",
    brand: "Kobo",
    category: "Fitness Equipment",
    description: "Add resistance to yoga steps, cardio jogs or leg extensions. Made with soft neoprene fabric filled with premium sand particles, adjustable sturdy velcro loops wrap safely around wrists or ankles.",
    price: 899,
    discount: 10,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61eDVT3Rw9L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Ocean Blue"],
    sizes: ["2kg Pair (1kg each)"],
    specifications: [
      { name: "Weight", value: "2kg pair (1kg per side)" },
      { name: "Material", value: "Soft mercerised skin-friendly neoprene" },
      { name: "Securing strap", value: "Heavy-duty adjustable metal buckle system" },
      { name: "Sub-Category", value: "Fitness Accessories" }
    ]
  },
  {
    title: "Hand Grip Strengthener Set",
    brand: "Boldfit",
    category: "Fitness Equipment",
    description: "Immensely build up finger, wrist and forearm grip power. Complete set features an adjustable mechanical hand-squeezer (10kg-40kg resistance), finger expander, stretch control rings, and wrist ball.",
    price: 399,
    discount: 5,
    stock: 60,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61rnIAUkCML._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Orange-Black"],
    sizes: ["Standard Squeezer Set"],
    specifications: [
      { name: "Squeezer Resistance", value: "10kg to 40kg analog dial control" },
      { name: "Material", value: "Lightweight polymer and high-elastic steel spring" },
      { name: "Set Items", value: "Hand grip, finger exerciser, grip ring, egg ball" },
      { name: "Sub-Category", value: "Fitness Accessories" }
    ]
  },
  {
    title: "Kettlebell 10kg Cast Iron",
    brand: "AmazonBasics",
    category: "Fitness Equipment",
    description: "Sleek tournament-grade cast iron kettlebell built to support dynamic full-body workouts. Excellent grip handle distributes weight evenly for explosive deadlifts, squats, swings, and snatches.",
    price: 1999,
    discount: 10,
    stock: 12,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51wfFVr-G0L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Stone Black-Grey"],
    sizes: ["10kg Heavy"],
    specifications: [
      { name: "Material", value: "Solid cast iron Core" },
      { name: "Coating", value: "Protective rust-resistant paint finish" },
      { name: "Handle Width", value: "Generous wide handle grip width" },
      { name: "Sub-Category", value: "Strength Training" }
    ]
  },
  {
    title: "Pull-Up Bar Door Mounted",
    brand: "HRX",
    category: "Fitness Equipment",
    description: "Instantly create a professional chin-up gym at home. Heavy-duty telescopic chrome steel pipe extends to fit standard door frames without screws or drill damage. Padded non-slip soft foam handles.",
    price: 1499,
    discount: 10,
    stock: 15,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/717rrpDUKpL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Chrome-Red"],
    sizes: ["Adjustable 62-100cm"],
    specifications: [
      { name: "Width Range", value: "Telescopic adjustment from 62cm up to 100cm" },
      { name: "Max Load", value: "Supports up to 120kg safely" },
      { name: "Handle Cushion", value: "Dual layered tear-resistant foam pads" },
      { name: "Sub-Category", value: "Installation Equipment" }
    ]
  },
  {
    title: "Medicine Ball 5kg",
    brand: "Aurion",
    category: "Fitness Equipment",
    description: "Solid weighted rubber companion for explosive core throwing and athletic drills. Textured grooved grip skin maintains absolute control during sweat-filled workouts, providing durable rebound bounces.",
    price: 1299,
    discount: 8,
    stock: 22,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71cxjF7elaL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Two-Tone Blue Yellow"],
    sizes: ["5kg Heavy Weight"],
    specifications: [
      { name: "Material", value: "Natural reinforced solid rubber structure" },
      { name: "Texture", value: "Textured textured non-slip grip" },
      { name: "Rebound", value: "Modest shock-absorbing bounce back" },
      { name: "Sub-Category", value: "Conditioning Equipment" }
    ]
  },
  {
    title: "Resistance Tube with Handles",
    brand: "Decathlon",
    category: "Fitness Equipment",
    description: "Highly versatile resistance tubing for general muscle toning and muscle stretching. Premium double layers of natural latex rubber tube are encased under custom comfort protective fabric.",
    price: 699,
    discount: 5,
    stock: 35,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/71NvWDYgo7L._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Slate Grey"],
    sizes: ["Medium Tension"],
    specifications: [
      { name: "Material", value: "Thermoplastic Elastomer Rubber" },
      { name: "Length", value: "1.2m core elastic length" },
      { name: "Grip Handle", value: "Non-skid sweat-proof plastic polymer" },
      { name: "Sub-Category", value: "Conditioning Equipment" }
    ]
  },
  {
    title: "Foldable Exercise Bench",
    brand: "PowerMax",
    category: "Fitness Equipment",
    description: "Incredible space-saving home workout bench. Offers multiple incline/decline positions to target chest, shoulders, and core, with a high grade dense leather padding for perfect backrest support.",
    price: 6999,
    discount: 10,
    stock: 8,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/614fnfW3JBL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black-Carbon Accent"],
    sizes: ["Multipurpose Folding Size"],
    specifications: [
      { name: "Frame", value: "Heavy duty tubular steel tubing frame" },
      { name: "Settings", value: "7-level adjustable backrest decline, 3-level seat incline" },
      { name: "Storage", value: "10-second fast folding system" },
      { name: "Sub-Category", value: "Strength Training" }
    ]
  },
  {
    title: "Smart Fitness Scale Bluetooth",
    brand: "HealthSense",
    category: "Fitness Equipment",
    description: "Next-gen smart bioelectrical impedance analysis scales. Accurately syncs weight, BMI, body fat ratio, muscle density and liquid levels to your companion dynamic mobile app.",
    price: 1999,
    discount: 5,
    stock: 20,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61zSfR0VjaL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Ultra Glass White"],
    sizes: ["Smart Bluetooth"],
    specifications: [
      { name: "Sensors", value: "4 High-precision G-Sensors" },
      { name: "Power", value: "3 x AAA Batteries (included)" },
      { name: "Mobile App", value: "Android & iOS Bluetooth direct synch" },
      { name: "Sub-Category", value: "Diagnostic Equipment" }
    ]
  }
];

const SPORTS_EQUIPMENT_DATA = [
  {
    title: "English Willow Cricket Bat",
    brand: "SG",
    category: "Sports Equipment",
    description: "Designed for intermediate to professional levels of cricket play. Crafted with Grade 1 English Willow for superb response, pick-up, and control. Ideal for leather ball matches and practice sessions.",
    price: 8999,
    discount: 10,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/41wq0Ul2J0L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Natural Wood"],
    sizes: ["Full Size SH"],
    specifications: [
      { name: "Material", value: "Premium Grade 1 English Willow" },
      { name: "Handle Type", value: "Premium Singapore Cane" },
      { name: "Weight", value: "1160-1200g" },
      { name: "Sub-Category", value: "Cricket Equipment" }
    ]
  },
  {
    title: "Kashmir Willow Cricket Bat",
    brand: "SS",
    category: "Sports Equipment",
    description: "Perfect for club matches and practice nets. SS Kashmir Willow bat provides massive edges and a sweet spot built for hard-hitting power. Extremely durable build quality.",
    price: 3999,
    discount: 12,
    stock: 25,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/518kh8lRXhL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Natural Wood"],
    sizes: ["Full Size SH"],
    specifications: [
      { name: "Material", value: "Select Kashmir Willow" },
      { name: "Grip", value: "High-traction Octagonal Grip" },
      { name: "Weight", value: "1220-1250g" },
      { name: "Sub-Category", value: "Cricket Equipment" }
    ]
  },
  {
    title: "Cricket Kit Bag Pro",
    brand: "SG",
    category: "Sports Equipment",
    description: "Heavy-duty nylon construction with premium wheels. Plenty of room to store bats, helmets, pads, and personal accessories under full protective cover.",
    price: 2499,
    discount: 5,
    stock: 18,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/51AGpTLkUpL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Black-Blue"],
    sizes: ["Standard XL"],
    specifications: [
      { name: "Material", value: "1680D Cordura Fabric" },
      { name: "Wheels", value: "Heavy-duty Tractor Wheels" },
      { name: "Compartments", value: "3 Large storage zip compartments" },
      { name: "Sub-Category", value: "Cricket Accessories" }
    ]
  },
  {
    title: "Official Leather Cricket Ball",
    brand: "Kookaburra",
    category: "Sports Equipment",
    description: "The premier standard for turf matches. Handmade with Grade 1 alum tanned steer hide and a traditional five-ply quilted core for consistent seam response.",
    price: 899,
    discount: 5,
    stock: 40,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71K9p0st-ZL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Cherry Red"],
    sizes: ["Standard Match Weight"],
    specifications: [
      { name: "Material", value: "Alum Tanned Steer Hide" },
      { name: "Stitching", value: "80-85 hand-stitched seams" },
      { name: "Weight", value: "156g" },
      { name: "Sub-Category", value: "Cricket Equipment" }
    ]
  },
  {
    title: "Football Premier League Edition",
    brand: "Adidas",
    category: "Sports Equipment",
    description: "Inspired by the official high-stakes league match ball. Boasts seamless TSBE heat-bonded construction for perfect touch and low water intake.",
    price: 2499,
    discount: 10,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/81LukCXCiTL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["White-Neon Blue"],
    sizes: ["Size 5"],
    specifications: [
      { name: "Construction", value: "TSBE Thermally Bonded" },
      { name: "Bladder", value: "Butyl bladder for maximum air retention" },
      { name: "Material", value: "100% TPU cover" },
      { name: "Sub-Category", value: "Football Equipment" }
    ]
  },
  {
    title: "FIFA Training Football",
    brand: "Nike",
    category: "Sports Equipment",
    description: "Engineered for intense training sessions and park drills. Features machine-stitched casing with a textured skin for durable flight traction.",
    price: 1999,
    discount: 15,
    stock: 35,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/716R1H7ZcvL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Yellow-Orange-Black"],
    sizes: ["Size 5"],
    specifications: [
      { name: "Casing", value: "Machine-stitched TPU" },
      { name: "Traction", value: "Nike Aerowsculpt grooves" },
      { name: "Bladder", value: "Rubber bladder for rebound persistence" },
      { name: "Sub-Category", value: "Football Equipment" }
    ]
  },
  {
    title: "Professional Basketball",
    brand: "Spalding",
    category: "Sports Equipment",
    description: "The iconic legacy grip built for indoor hardwoods and outdoor courts. Deep channels and premium composite leather cover offer immaculate touch control.",
    price: 2999,
    discount: 10,
    stock: 20,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71ISZ0leC1L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Classic Amber"],
    sizes: ["Official Size 7"],
    specifications: [
      { name: "Material", value: "ZK Composite Leather" },
      { name: "Size", value: "Official Men's Size 7 (29.5\")" },
      { name: "Performance", value: "Full Pebbled Texture grip texture" },
      { name: "Sub-Category", value: "Basketball Equipment" }
    ]
  },
  {
    title: "Indoor/Outdoor Basketball Hoop",
    brand: "Spalding",
    category: "Sports Equipment",
    description: "High-performance portable basketball hoop system. Features a durable polycarbonate backboard, all-weather nylon net, and stable water/sand-filled base.",
    price: 12999,
    discount: 8,
    stock: 8,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/51EZRZI0S0L._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Black-Orange"],
    sizes: ["Standard adjustable"],
    specifications: [
      { name: "Backboard", value: "44-inch Polycarbonate" },
      { name: "Base", value: "32-gallon portable water/sand base" },
      { name: "Rim", value: "Pro Slam breakaway steel rim" },
      { name: "Sub-Category", value: "Basketball Equipment" }
    ]
  },
  {
    title: "Badminton Racquet Nanoflare 700",
    brand: "Yonex",
    category: "Sports Equipment",
    description: "Super-lightweight aero-frame badminton racquet. Elevates speed, rapid swing-speed, and high elasticity for lightning-fast rally defense and clearing power.",
    price: 6999,
    discount: 10,
    stock: 16,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61S51C1xdhL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Cyan Blue", "Magenta Rose"],
    sizes: ["4U (Avg 83g)"],
    specifications: [
      { name: "Frame", value: "HM Graphite / M40X / SUPER HMG" },
      { name: "Flex", value: "Medium stiffness" },
      { name: "Stringing", value: "Pre-strung to 24-26 lbs dynamic tension" },
      { name: "Sub-Category", value: "Badminton Equipment" }
    ]
  },
  {
    title: "Feather Shuttlecock Pack (12)",
    brand: "Yonex",
    category: "Sports Equipment",
    description: "Tournament-grade duck feather shuttlecocks. Offers stable flight trajectory and excellent consistency across temperature fluctuations.",
    price: 1499,
    discount: 5,
    stock: 50,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61FGWTCmY5L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["White"],
    sizes: ["12-Pack"],
    specifications: [
      { name: "Feather", value: "Duck Feather" },
      { name: "Base", value: "100% Solid Natural Cork" },
      { name: "Recommended speed", value: "Speed 77 (Medium)" },
      { name: "Sub-Category", value: "Badminton Accessories" }
    ]
  },
  {
    title: "Tennis Racquet Clash 100",
    brand: "Wilson",
    category: "Sports Equipment",
    description: "The premier evolution of tennis control. FreeFlex and StableSmart carbon mapping technologies allow the frame to bend in new fluid dimensions for superb accuracy.",
    price: 14999,
    discount: 5,
    stock: 10,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/61wHlwtepML._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Infrabred Red-Black"],
    sizes: ["4 3/8 Grip"],
    specifications: [
      { name: "Head Size", value: "100 sq in" },
      { name: "Pattern", value: "16x19 Power string matrix" },
      { name: "Weight", value: "295g unstrung frame" },
      { name: "Sub-Category", value: "Tennis Equipment" }
    ]
  },
  {
    title: "Tennis Ball Pack (3)",
    brand: "Head",
    category: "Sports Equipment",
    description: "Premium pressurized tennis balls. Built with extra-duty felt and unique SmartOptik technology for optimal visibility and maximum durability on all court surfaces.",
    price: 799,
    discount: 5,
    stock: 45,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71vd3VTwtKL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Neon Green"],
    sizes: ["3-Can Pack"],
    specifications: [
      { name: "Felt", value: "Extra-Duty Wool Felt" },
      { name: "Technology", value: "SmartOptik bright felt core" },
      { name: "Core", value: "High-density pressure rubber core" },
      { name: "Sub-Category", value: "Tennis Accessories" }
    ]
  },
  {
    title: "Adjustable Dumbbell Set 20kg",
    brand: "Kore",
    category: "Sports Equipment",
    description: "Saves massive gym space. Features a high-integrity chrome dumbbell pair with micro-adjustable plates from 2.5kg to 20kg to fine-tune home gym heavy-lifts.",
    price: 5999,
    discount: 12,
    stock: 15,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61NEUWb5A4L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black-Chrome"],
    sizes: ["20kg Set"],
    specifications: [
      { name: "Max Weight", value: "20kg total set package" },
      { name: "Material", value: "Virgin Heavy Rubberized PVC Plates with Chrome rods" },
      { name: "Toggles", value: "Safe Spinlock collars included" },
      { name: "Sub-Category", value: "Fitness Equipment" }
    ]
  },
  {
    title: "Olympic Weight Bench",
    brand: "Lifeline",
    category: "Sports Equipment",
    description: "Heavy-duty workout station for flat, incline, and decline bench presses. Comprises a solid steel upright support frame and leg developer extension setup safely.",
    price: 12999,
    discount: 10,
    stock: 12,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51-O6UujoqL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Grey-Black"],
    sizes: ["Standard size"],
    specifications: [
      { name: "Frame", value: "2x2 inch high-tensile carbon steel" },
      { name: "Pads", value: "High-density foam roller cushions" },
      { name: "Adjustability", value: "5-position adjustable incline angles" },
      { name: "Sub-Category", value: "Fitness Equipment" }
    ]
  },
  {
    title: "Yoga Mat Premium 6mm",
    brand: "Boldfit",
    category: "Sports Equipment",
    description: "Non-slip eco-conscious textured alignment mat. 6mm thick premium cushioning protects sensitive joints and posture balance during complex stretches.",
    price: 1299,
    discount: 8,
    stock: 40,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71OmlNi3hwL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Lilac Violet", "Mint Green", "Ocean Blue"],
    sizes: ["6mm Premium"],
    specifications: [
      { name: "Thickness", value: "6mm Premium Elastic-EVA" },
      { name: "Traction", value: "Double-sided non-slip grip texture" },
      { name: "Material", value: "100% Eco-friendly durable TPE" },
      { name: "Sub-Category", value: "Yoga Equipment" }
    ]
  },
  {
    title: "Resistance Bands Set",
    brand: "Boldfit",
    category: "Sports Equipment",
    description: "Full physical therapy workout set. Features 5 primary latex tube bands with custom tension grades to optimize full-body functional strength.",
    price: 999,
    discount: 10,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/613d+tzUrvL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Multicolor"],
    sizes: ["5-Band set"],
    specifications: [
      { name: "Latex Grade", value: "100% Eco-Pure Natural Latex" },
      { name: "Total Tension", value: "Up to 150 lbs custom combination load" },
      { name: "Accessories", value: "Includes 2 Cushioned handles, 2 Ankle straps, 1 Door anchor" },
      { name: "Sub-Category", value: "Fitness Accessories" }
    ]
  },
  {
    title: "Treadmill T-500",
    brand: "PowerMax",
    category: "Sports Equipment",
    description: "High-durability smart folding electric treadmill. Features a 2.5HP silent motor, custom hydraulic drop speed tracking, and heart-rate monitoring handles.",
    price: 34999,
    discount: 10,
    stock: 8,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/51XXJJPlP3L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Matte Black"],
    sizes: ["Standard foldaway size"],
    specifications: [
      { name: "Motor", value: "2.5 HP Continuous Duty DC Motor" },
      { name: "Speed Range", value: "1.0 - 14.0 km/h with quick toggle keys" },
      { name: "Incline", value: "3 Manual adjust incline levels" },
      { name: "Sub-Category", value: "Fitness Equipment" }
    ]
  },
  {
    title: "Exercise Bike X100",
    brand: "Reach",
    category: "Sports Equipment",
    description: "Foldable quiet magnetic exercise bike. Integrates comfortable cushioned seat backrests and a responsive LCD metrics screen displaying clear distance records.",
    price: 18999,
    discount: 10,
    stock: 10,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/510nshq2BuL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Steel Grey-Blue"],
    sizes: ["Standard adjustable size"],
    specifications: [
      { name: "Resistance", value: "8 levels of adjustable magnetic tension" },
      { name: "Metrics Panel", value: "Speed, Distance, Calories, Pulse, Time tracker" },
      { name: "Flywheel", value: "4kg precision-balanced silent flywheel" },
      { name: "Sub-Category", value: "Fitness Equipment" }
    ]
  },
  {
    title: "Table Tennis Paddle Carbon Pro",
    brand: "Stag",
    category: "Sports Equipment",
    description: "ITTF Registered tournament racket. Constructed with a 5-ply blade reinforced with dual carbon layers for phenomenal speed and aggressive shot spins.",
    price: 2299,
    discount: 10,
    stock: 22,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/716TvDzDYvL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Red-Black"],
    sizes: ["Standard Paddle"],
    specifications: [
      { name: "Rubber", value: "Stag ITTF Registered Ninja rubber" },
      { name: "Blade", value: "Dual Carbon-Fiber and 5-ply select lightweight wood" },
      { name: "Speed Rating", value: "95 / Spin 90 / Control 85" },
      { name: "Sub-Category", value: "Table Tennis Equipment" }
    ]
  },
  {
    title: "Table Tennis Ball Pack (6)",
    brand: "Stag",
    category: "Sports Equipment",
    description: "ITTA 3-Star superior Table Tennis balls. Premium seam balance provides consistent circular rebounds and maximum durability across intense matches.",
    price: 399,
    discount: 5,
    stock: 50,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/81udvSHlnzL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Bright Orange", "Tournament White"],
    sizes: ["6-Pack"],
    specifications: [
      { name: "Rating", value: "3-Star Official ITTF Competition Standard" },
      { name: "Diameter", value: "40+ mm size" },
      { name: "Material", value: "Celluloid-free plastic polymer" },
      { name: "Sub-Category", value: "Table Tennis Accessories" }
    ]
  }
];

const GAMING_ACCESSORIES_DATA = [
  {
    title: "RGB Gaming Keyboard",
    brand: "Redragon",
    category: "Gaming Accessories",
    description: "Upgrade your battle station with tactile, high-speed membrane keys. Engineered with customizable multi-mode RGB backlighting, dynamic media shortcut controls, and anti-ghosting keys for supreme precision during intense matching sessions.",
    price: 1999,
    discount: 10,
    stock: 25,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/415ycu6WFZL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Classic Black", "Arctic White"],
    sizes: ["Full Size 104 keys"],
    specifications: [
      { name: "Connectivity", value: "Gold-plated braided USB cable" },
      { name: "Backlight", value: "7-color RGB breathing modes" },
      { name: "Switch Type", value: "Tactile silent feeling membrane switches" },
      { name: "Sub-Category", value: "Gaming Keyboards" }
    ]
  },
  {
    title: "Wired Gaming Mouse 7200 DPI",
    brand: "Logitech",
    category: "Gaming Accessories",
    description: "Uncompromised gaming accuracy and speed. Harness a professional-grade 7200 DPI optical tracker with fully customizable buttons and light sync technology for seamless, lag-free sweeps.",
    price: 1499,
    discount: 10,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Jet Black", "Ice White"],
    sizes: ["Standard Ergonomic"],
    specifications: [
      { name: "Tracker Sensor", value: "High-precision 7200 DPI Optical sensor" },
      { name: "Buttons", value: "6 programmable layout toggles" },
      { name: "Cable length", value: "2.1m high-flex braided wire" },
      { name: "Sub-Category", value: "Gaming Mice" }
    ]
  },
  {
    title: "Wireless Gaming Headset",
    brand: "HyperX",
    category: "Gaming Accessories",
    description: "Legendary comfort meets wireless liberation. Equipped with super-low latency dual wireless connection technology, immersive spatial audio drivers, and a studio-clear flip-to-mute cardioid mic.",
    price: 3999,
    discount: 8,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71JPttDoucL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Charcoal Red", "Midnight Black"],
    sizes: ["Over-Ear Comfort"],
    specifications: [
      { name: "Connection", value: "2.4GHz Ultra-low Latency wireless & Bluetooth 5.2" },
      { name: "Driver Size", value: "53mm dynamic neodymium magnets" },
      { name: "Battery Life", value: "Up to 30 hours high-volume playground" },
      { name: "Sub-Category", value: "Gaming Headsets" }
    ]
  },
  {
    title: "Gaming Mouse Pad Extended XL",
    brand: "Razer",
    category: "Gaming Accessories",
    description: "Sleek, friction-free microtextured textile surface. Designed with thick, locked stitched edges and anti-slip natural rubber layouts to anchor your gaming keyboard and mouse securely.",
    price: 999,
    discount: 5,
    stock: 35,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71gLBOoEc4L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Raven Black"],
    sizes: ["Extended XL (900x400x4mm)"],
    specifications: [
      { name: "Surface Material", value: "Ultra-slick micro-weave cloth" },
      { name: "Base Material", value: "Heavy textured anti-slip rubberized base" },
      { name: "Stitch Quality", value: "Double density anti-fraying locked thread edges" },
      { name: "Sub-Category", value: "Mouse Pads" }
    ]
  },
  {
    title: "Xbox Controller Wireless",
    brand: "Microsoft",
    category: "Gaming Accessories",
    description: "The gold standard for seamless cross-platform control. Elegant textured grips, hybrid D-pad alignment, and lightning-fast Bluetooth pairings for Xbox Series X|S, One, PC, and active smart devices.",
    price: 4999,
    discount: 5,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/51k9LDNgwSL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Carbon Black", "Robot White", "Velocity Green"],
    sizes: ["Standard Console Fit"],
    specifications: [
      { name: "Compatibility", value: "Xbox Series X|S, Xbox One, Windows, Android, iOS" },
      { name: "Battery life", value: "Up to 40 hours with standard AA power cells" },
      { name: "Haptics", value: "Impulse Triggers with tactile vibrational feedback" },
      { name: "Sub-Category", value: "Game Controllers" }
    ]
  },
  {
    title: "PS5 DualSense Controller",
    brand: "Sony",
    category: "Gaming Accessories",
    description: "Immerse yourself in virtual actions like never before. Experience responsive adaptive triggers, dynamic tactile rumble simulation, and an integrated vocal microphone, all within a futuristic comfortable design.",
    price: 5499,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/51qcJKGmDXL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Midnight Black", "Classic White", "Cosmic Red"],
    sizes: ["PlayStation 5 Standard"],
    specifications: [
      { name: "Haptic Tech", value: "Dual actuators responsive rumble haptic feedback" },
      { name: "Triggers", value: "Dynamic Adaptive tension triggers" },
      { name: "Connection Type", value: "USB Type-C and low-power Bluetooth" },
      { name: "Sub-Category", value: "Game Controllers" }
    ]
  },
  {
    title: "Gaming Chair Ergonomic",
    brand: "Green Soul",
    category: "Gaming Accessories",
    description: "Maximized postured support for high-intensity work or play sessions. Highlights a premium breathable structural seat, memory foam neck and lumbar supports, and customizable 3D armrests.",
    price: 8999,
    discount: 12,
    stock: 10,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51WUaFNDRDL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Black-Orange", "Stealth Grey", "Teal-Indigo"],
    sizes: ["Adjustable High-Back Profile"],
    specifications: [
      { name: "Material", value: "Premium breathable mesh with high-durability PU leather frames" },
      { name: "Gas Lift", value: "Class 4 premium explosion-safe cylinder" },
      { name: "Reclination", value: "90 to 180 degrees continuous tilting adjust lock" },
      { name: "Sub-Category", value: "Gaming Furniture" }
    ]
  },
  {
    title: "Laptop Cooling Pad RGB",
    brand: "Cooler Master",
    category: "Gaming Accessories",
    description: "Quiet, powerful ventilation grids safeguard high-value laptops against thermal throttling. Packed with large high-rotation silent wind fans and customizable dynamic RGB strip surrounds.",
    price: 1499,
    discount: 10,
    stock: 20,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/71K5NVsURhL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Solid Black"],
    sizes: ["Fits up to 17\" Notebooks"],
    specifications: [
      { name: "Fanning", value: "5 High-volume super-quiet 120mm fans" },
      { name: "Adjustability", value: "5 ergonomic height profile stands" },
      { name: "Power Connection", value: "Dual USB pass-through safety ports" },
      { name: "Sub-Category", value: "Gaming Coolers" }
    ]
  },
  {
    title: "Mechanical Keyboard Blue Switch",
    brand: "Cosmic Byte",
    category: "Gaming Accessories",
    description: "Satisfying tactile key returns. High-performance mechanical key blue switches provide audible clicks and rapid rebound actions, back-lit with vibrant customizable lighting lines.",
    price: 2499,
    discount: 10,
    stock: 15,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71ZSWt-kA+L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic White", "Midnight Onyx"],
    sizes: ["Compact 87-key Tenkeyless"],
    specifications: [
      { name: "Switch life", value: "Up to 50 million clickable key strikes" },
      { name: "Keycaps", value: "Double-shot injected wear-resistant keycaps" },
      { name: "Lighting", value: "Multi-pattern dynamic glow backlights" },
      { name: "Sub-Category", value: "Gaming Keyboards" }
    ]
  },
  {
    title: "Gaming Earphones In-Ear",
    brand: "JBL",
    category: "Gaming Accessories",
    description: "Highly portable acoustic gaming ear buds. Fitted with premium dynamic driver coils to pick up footsteps, paired with an elegant extension vocal microphone to guide coordinates.",
    price: 1499,
    discount: 5,
    stock: 30,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/51Q8DUDT2eL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Vibrant Orange", "Stealth Black"],
    sizes: ["Universal Soft Silicon Tips"],
    specifications: [
      { name: "Drivers", value: "8.8mm QuantumSound performance coils" },
      { name: "Microphone", value: "Detachable boom microphone + inline controls" },
      { name: "Jack Type", value: "Universal L-shape 3.5mm headphone connector" },
      { name: "Sub-Category", value: "Gaming Earphones" }
    ]
  },
  {
    title: "Streaming Webcam Full HD",
    brand: "Logitech",
    category: "Gaming Accessories",
    description: "Broadcast your games in full, crisp high-definition resolution at fluid frame speeds. Dynamic lighting adjustments and dual noise-cancelling mics capture you elegantly.",
    price: 2999,
    discount: 5,
    stock: 15,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61nTmIUB0LL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Coal Gray"],
    sizes: ["Full HD Desktop Mount"],
    specifications: [
      { name: "Max Resolution", value: "1080p Full HD at fluid 30FPS" },
      { name: "Lens Focus", value: "Premium Auto-focus precision glass lens" },
      { name: "Mounting Option", value: "Universal tripod-ready clip mounts" },
      { name: "Sub-Category", value: "Camcorders & Webcams" }
    ]
  },
  {
    title: "RGB LED Strip for Setup",
    brand: "Govee",
    category: "Gaming Accessories",
    description: "Amplify visual moods in your gaming den. These premium smart ambient LED strips synchronize colors with match audio patterns, adjusted via dynamic mobile controllers.",
    price: 799,
    discount: 5,
    stock: 40,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71WUpQGKieL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Multi-Color RGBIC"],
    sizes: ["5 Meters / 16.4 ft Roll"],
    specifications: [
      { name: "LED Chips", value: "Ultra-bright SMD dynamic diodes" },
      { name: "Smart Controls", value: "Wireless App and Voice assistant syncs" },
      { name: "Sync Tech", value: "Integrated high-sensitivity audio-sync pickup" },
      { name: "Sub-Category", value: "Setup Lighting" }
    ]
  },
  {
    title: "Gaming Desk Large Size",
    brand: "DeckUp",
    category: "Gaming Accessories",
    description: "Crafted specifically for heavy dual-monitor system arrays. Boasts a scratch-resistant clean carbon composite surface, dedicated headset hangers, and clean wire slots.",
    price: 6999,
    discount: 10,
    stock: 8,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61YCsJXvHJL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Stealth Black-Red"],
    sizes: ["Large (120 x 60 x 75 cm)"],
    specifications: [
      { name: "Desktop Material", value: "High-density carbon fiber textured particle boards" },
      { name: "Leg Framing", value: "Heavy-duty dual structural Z-shape steel rods" },
      { name: "Weight capacity", value: "Holds up to 100 kilograms stable" },
      { name: "Sub-Category", value: "Gaming Furniture" }
    ]
  },
  {
    title: "Controller Charging Dock",
    brand: "PowerA",
    category: "Gaming Accessories",
    description: "Instantly recharge up to two controllers simultaneously. Fitted with secure fast magnetic alignment clips and sleek LED battery indicators.",
    price: 1999,
    discount: 5,
    stock: 22,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61J2UWjOm3L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Obsidian Black", "Classic White"],
    sizes: ["Dual Loading Cradle"],
    specifications: [
      { name: "Compatibility", value: "Xbox Series X|S / PS5 (variant dependent)" },
      { name: "Indicator Panel", value: "Responsive LED charging trackers (Red is charging, Green is full)" },
      { name: "Safety Chipset", value: "Smart overcharge prevention circuitry" },
      { name: "Sub-Category", value: "Charging Accessories" }
    ]
  },
  {
    title: "VR Headset Entry Level",
    brand: "Oculus (Meta)",
    category: "Gaming Accessories",
    description: "Enter massive virtual domains instantly. Features premium high-resolution lenses, integrated 3D audio, and dual motion tracking controllers for complete immersion.",
    price: 24999,
    discount: 10,
    stock: 5,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/41U9gx4GHHL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Arctic Slate Grey"],
    sizes: ["Standard 128GB Storage"],
    specifications: [
      { name: "Display Panel", value: "Dual fast-switch LCD panels (1832x1920 per eye)" },
      { name: "Refresh Rate", value: "Highly fluid 90Hz frame speed tracking" },
      { name: "Processor Engine", value: "Qualcomm Snapdragon XR2 high-grade processor" },
      { name: "Sub-Category", value: "VR Systems" }
    ]
  },
  {
    title: "Gaming Trigger Buttons Mobile",
    brand: "Amkette",
    category: "Gaming Accessories",
    description: "Add competitive console-like mechanical buttons to your mobile games. Durable anti-slip clamps latch securely onto your smartphone layout for instant actions.",
    price: 299,
    discount: 0,
    stock: 45,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/71jwlxkd3mL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Clear-Red Accent"],
    sizes: ["Universal Fit Clamps"],
    specifications: [
      { name: "Switch Action", value: "Mechanical metal click buttons" },
      { name: "Phone Limit", value: "Fits display depths from 6.5mm up to 10.5mm easily" },
      { name: "Contact Type", value: "Scratch-safe conductive soft silicon blocks" },
      { name: "Sub-Category", value: "Mobile Accessories" }
    ]
  },
  {
    title: "Mobile Gamepad Controller",
    brand: "EvoFox",
    category: "Gaming Accessories",
    description: "Harness complete tactical accuracy on mobile platforms. Full-format Bluetooth analog trigger controllers with textured grips and low-latency response engines.",
    price: 999,
    discount: 5,
    stock: 25,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/611rMRMIHAL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Slate Gray and Cyan"],
    sizes: ["Universal Stretchable Fit"],
    specifications: [
      { name: "Connection Option", value: "Low-energy Bluetooth 5.0 and direct USB input" },
      { name: "Battery rating", value: "Recharges in 2h, plays continuously for up to 12h" },
      { name: "Compatibility", value: "Android, iOS, iPadOS dynamic layouts" },
      { name: "Sub-Category", value: "Game Controllers" }
    ]
  },
  {
    title: "External SSD 1TB Gaming",
    brand: "Samsung",
    category: "Gaming Accessories",
    description: "Reduce gaming load speeds instantly. Features an ultra-compact dynamic metal frame offering incredible reading and writing speeds via high-capacity Type-C connections.",
    price: 6999,
    discount: 5,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/618tjFtlqEL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Titanium Black", "Classic Red"],
    sizes: ["1 TB High-capacity"],
    specifications: [
      { name: "Transfer Speed", value: "Up to 1050 MB/s read, 1000 MB/s write" },
      { name: "Interface Link", value: "USB 3.2 Gen 2 backward-compatible interfaces" },
      { name: "Durability Rating", value: "Shockproof and drop-tested from up to 2 meters" },
      { name: "Sub-Category", value: "Gaming Storage" }
    ]
  },
  {
    title: "Noise Cancelling Gaming Mic",
    brand: "Maono",
    category: "Gaming Accessories",
    description: "Deliver crystal-clear tactical audio callouts. Pro-level USB condenser microphone boasts a simple tap-to-mute safety switch and active noise isolating card patterns.",
    price: 1999,
    discount: 5,
    stock: 20,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71s97KWopKL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Matte Onyx Black"],
    sizes: ["Desktop Mount Kit"],
    specifications: [
      { name: "Polar Pattern", value: "Precise Cardioid noise-isolation path" },
      { name: "Sample Rate", value: "High-grade 192kHz/24-bit audio resolution" },
      { name: "Connector Pin", value: "Plug-and-play USB Type-C interface" },
      { name: "Sub-Category", value: "Gaming Microphones" }
    ]
  },
  {
    title: "Gaming Console Stand with Cooling",
    brand: "Sony",
    category: "Gaming Accessories",
    description: "The complete setup optimizer for your gaming console. Offers vertical console dock support, quiet high-airflow cooling fans, and secondary controller slots.",
    price: 1499,
    discount: 10,
    stock: 15,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/81jrnsmHlPL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Stealth Matte Black"],
    sizes: ["Standard Console Base"],
    specifications: [
      { name: "Fanning Tech", value: "Dual adjustable thermal cooling fans" },
      { name: "Charging Sockets", value: "Dual fast-loading charge slots with indicator lights" },
      { name: "Power Source", value: "Direct console USB bus powered connection" },
      { name: "Sub-Category", value: "Console Docks" }
    ]
  }
];

const BAGS_AND_TRAVEL_DATA = [
  {
    title: "Laptop Backpack 15.6 inch Waterproof",
    brand: "American Tourister",
    category: "Bags and Travel Accessories",
    description: "Prepare for dynamic commutes with this high-durability waterproof laptop backpack. Fits up to a 15.6-inch laptop snugly, complemented by multi-layered organizers, ergonomic back padding, and secure compartments.",
    price: 1499,
    discount: 10,
    stock: 25,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71kVQOhWKKL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Space Gray", "Midnight Blue"],
    sizes: ["15.6 Inch"],
    specifications: [
      { name: "Material", value: "Water-resistant Polyester" },
      { name: "Capacity", value: "28 Litres" },
      { name: "Laptop compatibility", value: "Up to 15.6 inches screen size" },
      { name: "Sub-Category", value: "Backpacks" }
    ]
  },
  {
    title: "Travel Duffle Bag Medium Size",
    brand: "Safari",
    category: "Bags and Travel Accessories",
    description: "The ideal weekend cabin companion. This spacious, lightweight duffle features premium hardware zipper pullers, easy-access side compartments, and a comfortable, adjustable padded shoulder strap.",
    price: 1299,
    discount: 15,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61gcx5XKm5L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Navy Blue", "Crimson Red"],
    sizes: ["Medium"],
    specifications: [
      { name: "Material", value: "Heavy-duty tear-resistant Nylon" },
      { name: "Capacity", value: "45 Litres" },
      { name: "Dimensions", value: "52cm x 28cm x 30cm" },
      { name: "Sub-Category", value: "Duffle Bags" }
    ]
  },
  {
    title: "Cabin Trolley Bag (20 inch)",
    brand: "Skybags",
    category: "Bags and Travel Accessories",
    description: "Glide elegantly through busy terminals with 360-degree silent spinner wheels. This light yet super-tough scratchless polycarbonate cabin trolley provides dynamic interior space separators and a secure number lock system safely.",
    price: 2999,
    discount: 20,
    stock: 12,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51GabyHxCrL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Teal Blue", "Charcoal Black"],
    sizes: ["20 Inch (Cabin Ready)"],
    specifications: [
      { name: "Material", value: "Scratch-resistant Polycarbonate shell" },
      { name: "Wheels", value: "4 Multi-directional silent spinner wheels" },
      { name: "Lock Type", value: "Integrated 3-digit combination tracker" },
      { name: "Sub-Category", value: "Trolley Bags" }
    ]
  },
  {
    title: "Hard Shell Suitcase Set (3 pcs)",
    brand: "AmazonBasics",
    category: "Bags and Travel Accessories",
    description: "The premium absolute packing solution. Includes three coordinated sizes (20-inch, 24-inch, and 28-inch) built with a flexible premium ABS hard shell to protect electronics and travel layers against heavy-loading impact safely.",
    price: 8999,
    discount: 10,
    stock: 8,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71ILcGfK+WL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Jet Black", "Navy Blue", "Slate Grey"],
    sizes: ["3-Piece Combo Set"],
    specifications: [
      { name: "Material", value: "Extra-thick premium rigid ABS polymer" },
      { name: "Included Sizes", value: "Cabin (20\"), Medium (24\"), Large (28\")" },
      { name: "Expansion", value: "Up to 15% expandable structural packing capacity" },
      { name: "Sub-Category", value: "Suitcase Sets" }
    ]
  },
  {
    title: "Anti-Theft Backpack USB Charging",
    brand: "F Gear",
    category: "Bags and Travel Accessories",
    description: "Secured lock and sleek modern commuter styling. Features hidden back zippers, anti-slash protective layers, and an integrated external USB port to power up your smartphone active devices on the go.",
    price: 1999,
    discount: 5,
    stock: 20,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61egMfcDWlL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Stealth Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Material", value: "Water-resistant Oxford fabric & polyester lining" },
      { name: "Security", value: "Hidden zippers & TSA-approved combination lock support" },
      { name: "USB Port", value: "Dynamic built-in USB charging cable interface (power bank not included)" },
      { name: "Sub-Category", value: "Backpacks" }
    ]
  },
  {
    title: "Travel Organizer Pouch Set",
    brand: "Mosiso",
    category: "Bags and Travel Accessories",
    description: "Never lose tiny vanity items, chargers or tickets. Complete multipack features durable high-density nylon storage bags with transparent mesh review panels and strong dual-zipper pull paths.",
    price: 699,
    discount: 5,
    stock: 35,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71MT8J4ziHL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Rose Quartz", "Slate Blue"],
    sizes: ["3-pc Set"],
    specifications: [
      { name: "Material", value: "Lightweight breathable Nylon" },
      { name: "Waterproof Grade", value: "Splash-resistant surfaces" },
      { name: "Contents", value: "1 Large pouch, 1 Medium pouch, 1 Small accessories pouch" },
      { name: "Sub-Category", value: "Travel Pouches" }
    ]
  },
  {
    title: "Packing Cubes Set (6 pcs)",
    brand: "AmazonBasics",
    category: "Bags and Travel Accessories",
    description: "Organize suitcase apparel and minimize fabric wrinkles. 6-piece premium system comprises four variable apparel packing cubes, a laundry sack, and a dedicated shoe bag for efficient suitcase arrangement.",
    price: 999,
    discount: 10,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71ti-OdugXL._SX679_.jpg"],
    colors: ["Slate Grey", "Midnight Navy"],
    sizes: ["6-Piece Set"],
    specifications: [
      { name: "Material", value: "Heavy-duty ripstop nylon fabrics" },
      { name: "Sizes Included", value: "XS, S, M, L, laundry bag, shoes bag" },
      { name: "Mesh Windows", value: "Breathable open mesh tops for quick identification" },
      { name: "Sub-Category", value: "Packing Cubes" }
    ]
  },
  {
    title: "Neck Pillow Memory Foam",
    brand: "J Pillow",
    category: "Bags and Travel Accessories",
    description: "Experience dynamic 360-degree head and neck support. Manufactured with responsive temperature-sensitive slow rebound memory foam, covered in soft breathable microtrace velvet that can be washed easily.",
    price: 599,
    discount: 5,
    stock: 50,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61ktHYSbSIL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Deep Indigo", "Silver Grey"],
    sizes: ["Ergonomic Adult Fit"],
    specifications: [
      { name: "Filler", value: "Slow rebound premium polyurethane memory foam" },
      { name: "Cover Material", value: "100% skin-friendly plush micro-velvet cover" },
      { name: "Portability", value: "Includes smart compressible travel storage pouch" },
      { name: "Sub-Category", value: "Travel Accessories" }
    ]
  },
  {
    title: "Eye Mask Sleep Travel",
    brand: "Comfy Living",
    category: "Bags and Travel Accessories",
    description: "Contoured memory foam blackout eye mask. Specially shaped 3D design eliminates pressure on your eyes and face while blocking out 100% of light, guaranteeing a resting posture for long flights.",
    price: 199,
    discount: 5,
    stock: 80,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/710uY4E5lvL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Ink Black"],
    sizes: ["Universal Adjustable Elastic"],
    specifications: [
      { name: "Material", value: "High-density slow recovery memory sponge and soft silk" },
      { name: "Strap Type", value: "Anti-slip adjustable velcro buckle band" },
      { name: "Light Blocking", value: "100% complete zero light leakage nosewing adaptation" },
      { name: "Sub-Category", value: "Travel Accessories" }
    ]
  },
  {
    title: "Luggage Scale Digital",
    brand: "Eagle Creek",
    category: "Bags and Travel Accessories",
    description: "Prevent surprise excess luggage fees during airport check-ins. Compact and portable digital scale weighs up to 50kg with dynamic weight locks and high-visibility back-lit LCD screen records.",
    price: 799,
    discount: 10,
    stock: 40,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71M6MiefSYL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Sleek Silver"],
    sizes: ["Pocket Size"],
    specifications: [
      { name: "Weight Limit", value: "Up to 50kg / 110 lbs" },
      { name: "Precision", value: "10g accuracy margin" },
      { name: "Power", value: "1 x CR2032 lithium button cell battery (included)" },
      { name: "Sub-Category", value: "Travel Accessories" }
    ]
  },
  {
    title: "Passport Holder Wallet",
    brand: "WildHorn",
    category: "Bags and Travel Accessories",
    description: "Crafted details for seasoned globetrotters. Genuine leather passport sleeve offers built-in RFID blocking shields to protect card chips against wireless identity theft safely.",
    price: 499,
    discount: 12,
    stock: 25,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71pH-+yZ-SL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Classic Tan", "Mocha Brown"],
    sizes: ["Standard Passport size"],
    specifications: [
      { name: "Material", value: "100% Genuine Forest Leather" },
      { name: "Slots", value: "1 passport slot, 4 credit card holders, 1 boarding pass deck" },
      { name: "Security", value: "RFID Shield block integration" },
      { name: "Sub-Category", value: "Passport Holders" }
    ]
  },
  {
    title: "Travel Toiletry Bag Hanging",
    brand: "AmazonBasics",
    category: "Bags and Travel Accessories",
    description: "Keep bathroom vanity essentials dry and organized. Includes an integrated premium metal hook to hang from towel bars, paired with multiple transparent water-resistant pouches.",
    price: 699,
    discount: 5,
    stock: 35,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/41eDcUjScpL._AC_SR250,250_QL65_.jpg"],
    colors: ["Slate Black"],
    sizes: ["Standard Standard XL"],
    specifications: [
      { name: "Material", value: "Waterproof Oxford fabric surfaces & leakproof interior lining" },
      { name: "Hook", value: "360-degree rotating high grade steel hanger" },
      { name: "Pockets", value: "2 side zip bags & 1 deep elastic partition core" },
      { name: "Sub-Category", value: "Toiletry Bags" }
    ]
  },
  {
    title: "Shoe Packing Bag Set",
    brand: "North Star",
    category: "Bags and Travel Accessories",
    description: "Segregate dust and soiled footwear from fresh garments. 4-pack premium shoe pouches are fitted with heavy zippers and pull loops for breezy handling.",
    price: 399,
    discount: 5,
    stock: 45,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/61CS5gs2avL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Dusk Blue-Black"],
    sizes: ["4-Can Pack"],
    specifications: [
      { name: "Material", value: "Lightweight dust-proof water-resistant Non-woven fabric" },
      { name: "Set Size", value: "4 individual draw envelopes" },
      { name: "Capacity", value: "Fits running shoes and high heel shoes safely up to size 12" },
      { name: "Sub-Category", value: "Shoe Storage" }
    ]
  },
  {
    title: "Waterproof Laptop Sleeve",
    brand: "Lenovo",
    category: "Bags and Travel Accessories",
    description: "Ultra-slim dynamic armor protection for high-value laptops. Waterproof surface fabrics guard against spills, complemented by a soft impact-absorbing inner fleece lining to cushion drops.",
    price: 899,
    discount: 8,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/81R1yyA3LLL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Carbon Grey"],
    sizes: ["14-15 Inch Universal"],
    specifications: [
      { name: "Material", value: "Splash-proof high density neoprene jacket" },
      { name: "Lining", value: "Scratch-free delicate bubble velvet fleece" },
      { name: "Accessories Pocket", value: "1 front zippered pocket for mouse and charge blocks" },
      { name: "Sub-Category", value: "Laptop Sleeves" }
    ]
  },
  {
    title: "Foldable Duffel Bag",
    brand: "VIP",
    category: "Bags and Travel Accessories",
    description: "The ideal emergency pack for souvenirs cataloged over shopping sprees. Collapse the spacious 30L duffle flat into its own compact self-zipping pouch when not in use.",
    price: 999,
    discount: 10,
    stock: 25,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/41rcebgjIHL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Bright Indigo Blue"],
    sizes: ["Foldable 30L"],
    specifications: [
      { name: "Material", value: "Hexagonal ripstop lightweight nylon fabric" },
      { name: "Folded Size", value: "18 x 18 cm compact pocket size" },
      { name: "Unfolded Size", value: "22 x 45 x 30 cm" },
      { name: "Sub-Category", value: "Duffle Bags" }
    ]
  },
  {
    title: "Travel Cable Organizer Case",
    brand: "UGREEN",
    category: "Bags and Travel Accessories",
    description: "Keep cables, SD cards, USB sticks and charging cubes beautifully untangled. Double-deck heavy-molded frame houses variable customized card loops and mesh organizer bands safely.",
    price: 599,
    discount: 5,
    stock: 40,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61VY631nNJL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Stealth Grey"],
    sizes: ["Double-Deck Standard"],
    specifications: [
      { name: "Material", value: "Shock-absorbing water-resistant EVA shell" },
      { name: "Internal Design", value: "12 elastic rings, 6 mesh card slots, 1 big mesh zipper core" },
      { name: "Dimensions", value: "24.5cm x 17.5cm x 5.0cm" },
      { name: "Sub-Category", value: "Electronics Accessories" }
    ]
  },
  {
    title: "TSA Approved Luggage Lock Set",
    brand: "Master Lock",
    category: "Bags and Travel Accessories",
    description: "Durable mechanical safety locks that meet TSA airline travel guidelines. 3-dial dynamic numeric locks shield bags from random pilfering while permitting custom code adjustments.",
    price: 899,
    discount: 5,
    stock: 50,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/7191e9hrFlL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Solid Black", "Classic Red"],
    sizes: ["2-Pack Set"],
    specifications: [
      { name: "Material", value: "Copolymer steel wire and zinc lock cylinder" },
      { name: "Combination", value: "3 digit customizable combination" },
      { name: "TSA Compliant", value: "Red dot alert indicates if luggage has been inspected" },
      { name: "Sub-Category", value: "Travel Accessories" }
    ]
  },
  {
    title: "Travel First Aid Kit Bag",
    brand: "Generic",
    category: "Bags and Travel Accessories",
    description: "Your health guardian on road trips. High-visibility red canvas zipper bag keeps band-aids, antiseptics, gauze rolls and safety scissors safe and sterile inside waterproof loops.",
    price: 499,
    discount: 5,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/71XRX4JdIAL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Rescue Red"],
    sizes: ["Standard Kit Size"],
    specifications: [
      { name: "Material", value: "EVA reinforced premium Oxford nylon fabric" },
      { name: "Waterproof", value: "Sealed splash-proof zipper teeth" },
      { name: "Content Slots", value: "6 mesh internal divider panels" },
      { name: "Sub-Category", value: "Survival Accessories" }
    ]
  },
  {
    title: "RFID Blocking Passport Cover",
    brand: "Fur Jaden",
    category: "Bags and Travel Accessories",
    description: "Minimalist and sleek travelers shield. Comprises premium eco-leather designed with integrated shielding fabrics to neutralize high frequency scanning waves elegantly.",
    price: 399,
    discount: 5,
    stock: 40,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/91VwqpYdcAL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Classic Slate Gray", "Blush Pink"],
    sizes: ["Standard Protective Sleeve"],
    specifications: [
      { name: "Material", value: "Smooth synthetic PU leather polymer" },
      { name: "Shield Tech", value: "Advanced protective RFID blocking lining material" },
      { name: "Capacity", value: "Fits 1 booklet passport, 2 active cash debit cards" },
      { name: "Sub-Category", value: "Passport Holders" }
    ]
  },
  {
    title: "Compression Packing Bags Set",
    brand: "AmazonBasics",
    category: "Bags and Travel Accessories",
    description: "Increase trunk luggage volume by up to 80% without a vacuum. Simply pack garments and hand-roll the bags to vent dynamic air bubbles through the unique one-way bottom valve securely.",
    price: 1199,
    discount: 10,
    stock: 35,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/81ZDgFHFuLL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Clear transparent"],
    sizes: ["8-Piece Combo Set"],
    specifications: [
      { name: "Material", value: "Extra-thick double layer PE + PA plastic blends" },
      { name: "Contents", value: "4 Medium size rolling bags (35x50cm), 4 Large size rolling bags (40x60cm)" },
      { name: "Operation", value: "Tear-resistant double sliding track, hand-roll vent exit" },
      { name: "Sub-Category", value: "Packing Cubes" }
    ]
  }
];

const MONITORS_DATA = [
  {
    title: "24\" Full HD IPS Monitor 75Hz",
    brand: "LG",
    category: "Monitors",
    description: "Experience vibrant color truth and wide-angle clarity. Packed with a 75Hz refresh rate, AMD FreeSync, and a nearly borderless sleek bezel design to enhance home offices or gaming setups easily.",
    price: 9999,
    discount: 10,
    stock: 20,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71n9u-Tdm3L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Black"],
    sizes: ["24-Inch"],
    specifications: [
      { name: "Display Size", value: "24 Inches" },
      { name: "Panel Type", value: "IPS Panel" },
      { name: "Refresh Rate", value: "75 Hz" },
      { name: "Resolution", value: "1920 x 1080 Full HD" }
    ]
  },
  {
    title: "27\" Full HD Gaming Monitor 144Hz",
    brand: "Samsung",
    category: "Monitors",
    description: "Conquer every enemy with immaculate response speeds. A high-refresh 144Hz screen ensures fluid graphics, AMD FreeSync Premium eliminates screen tearing, and the ergonomic stand keeps you comfortable.",
    price: 14999,
    discount: 12,
    stock: 18,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/81auiYTeqFL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Dark Charcoal Black"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Refresh Rate", value: "144 Hz" },
      { name: "Response Time", value: "1ms (MPRT)" },
      { name: "Resolution", value: "1920 x 1080 Full HD" }
    ]
  },
  {
    title: "27\" 2K QHD IPS Monitor",
    brand: "Dell",
    category: "Monitors",
    description: "Get more screen real estate with 2K QHD resolution. Delivers outstanding color accuracy with 99% sRGB coverage, built-in dual HDMI ports, and ComfortView Plus to minimize harmful blue light emissions.",
    price: 21999,
    discount: 8,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71I355JtcPL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Platinum Silver"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Panel Type", value: "IPS Panel" },
      { name: "Resolution", value: "2560 x 1440 2K QHD" },
      { name: "Color Accuracy", value: "99% sRGB" }
    ]
  },
  {
    title: "32\" 4K UHD Monitor",
    brand: "BenQ",
    category: "Monitors",
    description: "Breathtaking 4K visual immersion. Perfect for creative professionals and entertainment enthusiasts, featuring specialized HDRi technology, high-end built-in speakers, and elite eye-care protection.",
    price: 32999,
    discount: 5,
    stock: 10,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71x+FvsXgQL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Metallic Grey"],
    sizes: ["32-Inch"],
    specifications: [
      { name: "Display Size", value: "32 Inches" },
      { name: "Resolution", value: "3840 x 2160 4K UHD" },
      { name: "HDR Technology", value: "HDRi Intelligence Optimizer" },
      { name: "Audio", value: "Built-in 2.1 Channel Speakers" }
    ]
  },
  {
    title: "24\" Curved Gaming Monitor 165Hz",
    brand: "MSI",
    category: "Monitors",
    description: "Immersive curved screen designed for extreme gaming setups. Built with a fast 1500R curvature, high-speed 165Hz refresh rate, and rapid 1ms response dynamics to ensure absolute playground control.",
    price: 12999,
    discount: 10,
    stock: 22,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71CtRyAxklL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Matte Black"],
    sizes: ["24-Inch"],
    specifications: [
      { name: "Display Size", value: "24 Inches" },
      { name: "Curvature", value: "1500R Curved Screen" },
      { name: "Refresh Rate", value: "165 Hz" },
      { name: "Response Time", value: "1ms" }
    ]
  },
  {
    title: "27\" Ultrawide Monitor 21:9",
    brand: "LG",
    category: "Monitors",
    description: "Super-wide 21:9 panoramic presentation lets you multitask effectively. Features HDR10 support, IPS color accuracy, and dynamic split-screen controls to streamline professional developer workspaces.",
    price: 24999,
    discount: 10,
    stock: 14,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71YYPRI7SsL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Black"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Aspect Ratio", value: "21:9 Ultrawide" },
      { name: "Panel Type", value: "IPS Panel" },
      { name: "HDR Range", value: "HDR10 Compliant" }
    ]
  },
  {
    title: "24\" Bezel-less IPS Monitor",
    brand: "Acer",
    category: "Monitors",
    description: "Stunning bezel-free views. High-end IPS screen delivers consistent and accurate colors, ultra-slim profile footprint, and VGA/HDMI connectivity perfect for dual display arrays.",
    price: 8999,
    discount: 8,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/81zC7E7pDwL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Stealth Black"],
    sizes: ["24-Inch"],
    specifications: [
      { name: "Display Size", value: "24 Inches" },
      { name: "Bezel Design", value: "ZeroFrame Bezel-less design" },
      { name: "Panel Type", value: "IPS (In-Plane Switching)" },
      { name: "Refresh Rate", value: "75 Hz" }
    ]
  },
  {
    title: "27\" Gaming Monitor 1ms Response",
    brand: "ASUS",
    category: "Monitors",
    description: "Engineered for rapid competitive battles. Features ASUS Extreme Low Motion Blur (ELMB) technology to completely eliminate ghosting, alongside G-SYNC compatibility for tear-free gaming.",
    price: 17999,
    discount: 10,
    stock: 16,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/81gMjOO-kyL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Elite Black"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Response Time", value: "1ms ELMB Response" },
      { name: "Refresh Rate", value: "144 Hz" },
      { name: "Sync Tech", value: "NVIDIA G-SYNC Compatible" }
    ]
  },
  {
    title: "32\" Curved QHD Monitor",
    brand: "Samsung",
    category: "Monitors",
    description: "Deeply curved screen provides complete viewing comfort. Supports a sharp QHD resolution for fine details, high-contrast VA panel layouts, and beautiful cinematic entertainment loops.",
    price: 22999,
    discount: 12,
    stock: 12,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71j46QHGyZL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Midnight Blue-Black"],
    sizes: ["32-Inch"],
    specifications: [
      { name: "Display Size", value: "32 Inches" },
      { name: "Curvature", value: "1800R Deep Curve" },
      { name: "Resolution", value: "2560 x 1440 QHD" },
      { name: "Contrast Ratio", value: "3000:1 High Contrast" }
    ]
  },
  {
    title: "23.8\" Office Monitor Full HD",
    brand: "HP",
    category: "Monitors",
    description: "Redefine comfort and productivity. Elegant slim-profile office display featuring a dynamic micro-edge IPS screen, intuitive height adjustments, and built-in eye fatigue protection.",
    price: 8499,
    discount: 5,
    stock: 25,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71ywNx0P-gL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Silver-Black"],
    sizes: ["24-Inch"],
    specifications: [
      { name: "Display Size", value: "23.8 Inches" },
      { name: "Height Adjust", value: "Fully adjustable ergonomic height stand" },
      { name: "Panel Tech", value: "IPS Panel with Anti-glare coating" },
      { name: "Resolution", value: "1920 x 1080 Full HD" }
    ]
  },
  {
    title: "27\" 4K HDR Monitor",
    brand: "Dell",
    category: "Monitors",
    description: "Lose yourself in lifelike multi-dimensional colors. Premium 4K HDR display utilizing high-integrity IPS technology, integrated speakers, and convenient single USB Type-C connectivity.",
    price: 27999,
    discount: 10,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71Ja+uEiW8L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Platinum Grey"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Resolution", value: "3840 x 2160 4K UHD" },
      { name: "HDR Standard", value: "VESA DisplayHDR 400" },
      { name: "Port Link", value: "USB-C with 65W Power Delivery" }
    ]
  },
  {
    title: "24\" 144Hz Esports Monitor",
    brand: "Lenovo",
    category: "Monitors",
    description: "Gain the perfect tactical advantage in esports. High performance 144Hz screen, extremely low 0.5ms response tracking, and Lenovo Artery software controls to customize setups instantly.",
    price: 11999,
    discount: 8,
    stock: 20,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61+-4gtS0TL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Raven Black"],
    sizes: ["24-Inch"],
    specifications: [
      { name: "Display Size", value: "24 Inches" },
      { name: "Refresh Rate", value: "144 Hz" },
      { name: "Response Time", value: "0.5ms (MPRT)" },
      { name: "Sync Support", value: "AMD FreeSync Premium" }
    ]
  },
  {
    title: "34\" Ultrawide Curved Monitor",
    brand: "LG",
    category: "Monitors",
    description: "Outstanding curved workspace panoramic immersion. Offers a generous 21:9 curved display area, high contrast, and dynamic HDR graphics to maximize active developer arrays.",
    price: 34999,
    discount: 5,
    stock: 8,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61yTyGeNQrL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Sleek Black"],
    sizes: ["34-Inch"],
    specifications: [
      { name: "Display Size", value: "34 Inches" },
      { name: "Acoustics", value: "Built-in 7W stereo speakers with MaxxAudio" },
      { name: "Aspect Ratio", value: "21:9 Curved Ultrawide" },
      { name: "Resolution", value: "3440 x 1440 Wide QHD" }
    ]
  },
  {
    title: "27\" IPS Color Accurate Monitor",
    brand: "BenQ",
    category: "Monitors",
    description: "Tailored specifically for photographers and designers. Comes with certified color accuracy, dynamic HDR compatibility, and specialized color-mode presets.",
    price: 19999,
    discount: 5,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/818umK6iuWL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Slate Grey"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Color Standards", value: "99% sRGB & Rec.709 color accuracy" },
      { name: "Certification", value: "Calman Verified & Pantone Validated" },
      { name: "Resolution", value: "2560 x 1440 QHD" }
    ]
  },
  {
    title: "24\" 75Hz Eye Care Monitor",
    brand: "ViewSonic",
    category: "Monitors",
    description: "Superb daily display comfort. Flicker-Free technology and a Blue Light Filter shield your eyes during extended sessions, housed in a thin-bezel structure.",
    price: 7999,
    discount: 5,
    stock: 25,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61i0JglIF8L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Midnight Black"],
    sizes: ["24-Inch"],
    specifications: [
      { name: "Display Size", value: "24 Inches" },
      { name: "Eye Protection", value: "Flicker-Free & Blue Light Filter" },
      { name: "Panel Type", value: "SuperClear IPS Panel" },
      { name: "Refresh Rate", value: "75 Hz" }
    ]
  },
  {
    title: "32\" 144Hz Gaming Monitor",
    brand: "MSI",
    category: "Monitors",
    description: "Massive 32-inch high-performance curved screen. Dominate virtual worlds with high-fidelity color ranges, 144Hz display, and smart console optimizations.",
    price: 24999,
    discount: 10,
    stock: 10,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/81FhBqfXO9L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Raven Black"],
    sizes: ["32-Inch"],
    specifications: [
      { name: "Display Size", value: "32 Inches" },
      { name: "Curvature", value: "1500R Curved Screen" },
      { name: "Refresh Rate", value: "144 Hz" },
      { name: "Sync Tech", value: "AMD FreeSync Premium" }
    ]
  },
  {
    title: "27\" 2K Gaming Monitor 165Hz",
    brand: "ASUS",
    category: "Monitors",
    description: "Get lightning-fast response times and sharp QHD graphics. Packed with native 165Hz capabilities, HDR10 high dynamic range, and ergonomic customizable stands.",
    price: 25999,
    discount: 10,
    stock: 14,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61aXeba5E5L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Charcoal Black"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Resolution", value: "2560 x 1440 2K QHD" },
      { name: "Refresh Rate", value: "165 Hz" },
      { name: "Response Time", value: "1ms (GTG)" }
    ]
  },
  {
    title: "24\" LED Monitor Basic Office",
    brand: "Philips",
    category: "Monitors",
    description: "Simple, highly efficient display system built for home offices and school workflows. Boasts vivid colors, EasyRead modes, and low power dissipation.",
    price: 6999,
    discount: 8,
    stock: 35,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/81-pe8AZQLL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Solid Black"],
    sizes: ["24-Inch"],
    specifications: [
      { name: "Display Size", value: "24 Inches" },
      { name: "Panel Type", value: "Vibrant VA Panel" },
      { name: "Ports", value: "HDMI and VGA Input ports" },
      { name: "Contrast Ratio", value: "4000:1 High Contrast" }
    ]
  },
  {
    title: "49\" Super Ultrawide Gaming Monitor",
    brand: "Samsung",
    category: "Monitors",
    description: "Enter a whole new realm of immersive visuals. Huge 32:9 dual-QHD curve panel equivalent to two 27-inch displays, running on Quantum Mini LED backlight grids.",
    price: 89999,
    discount: 10,
    stock: 5,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/71sO3OcrlNL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Arctic Silver-Black"],
    sizes: ["49-Inch"],
    specifications: [
      { name: "Display Size", value: "49 Inches" },
      { name: "Aspect Ratio", value: "32:9 Super Ultrawide" },
      { name: "Resolution", value: "5120 x 1440 Dual QHD" },
      { name: "Refresh Rate", value: "240 Hz Extreme Speed" }
    ]
  },
  {
    title: "27\" 4K Professional Designer Monitor",
    brand: "LG",
    category: "Monitors",
    description: "Superb pixel accuracy and vibrant HDR400 profiles. Tailored for creative experts, featuring premium IPS technology, seamless USB-C data loops, and factory-level calibrations.",
    price: 29999,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/81AUYa6h+wL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Silver-Black"],
    sizes: ["27-Inch"],
    specifications: [
      { name: "Display Size", value: "27 Inches" },
      { name: "Resolution", value: "3840 x 2160 4K UHD" },
      { name: "Color Range", value: "DCI-P3 95% wide range" },
      { name: "Connectivity", value: "USB Type-C with multi-port hubs" }
    ]
  }
];

const TABLETS_DATA = [
  {
    title: "iPad 10th Gen 64GB",
    brand: "Apple",
    category: "Tablets",
    description: "Strikingly color-filled iPad design with an expansive 10.9-inch Liquid Retina display. Driven by the mighty A14 Bionic chip to run apps dynamically. Features advanced cameras, superfast wireless connections, and all-day battery life to maximize study or play workflows.",
    price: 34999,
    discount: 10,
    stock: 25,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61kMIKm23VL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Blue", "Silver", "Pink", "Yellow"],
    sizes: ["64GB"],
    specifications: [
      { name: "Display", value: "10.9-inch Liquid Retina display with True Tone" },
      { name: "Processor", value: "A14 Bionic chip with 6-core CPU and 4-core GPU" },
      { name: "Camera", value: "12MP Wide rear camera, 12MP Ultra Wide front camera" },
      { name: "Storage", value: "64GB ultra-fast storage" }
    ]
  },
  {
    title: "iPad Air M2 128GB",
    brand: "Apple",
    category: "Tablets",
    description: "Incredibly fast iPad Air powered by the groundbreaking Apple M2 chip. Supports a stunning 11-inch Liquid Retina display, superb wireless links, and compatibility with Apple Pencil Pro for ultimate creative output.",
    price: 59999,
    discount: 8,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71OjEuJ2o3L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Space Grey", "Starlight", "Purple", "Blue"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11-inch Liquid Retina LED backlit Multi-Touch display" },
      { name: "Processor", value: "Apple M2 chip with 8-core CPU and 9-core GPU" },
      { name: "Camera", value: "12MP Wide back camera, landscape 12MP Ultra Wide front camera" },
      { name: "Storage", value: "128GB high-speed memory" }
    ]
  },
  {
    title: "iPad Pro 11\" M4 256GB",
    brand: "Apple",
    category: "Tablets",
    description: "The thinnest Apple product ever, featuring the mind-blowing Ultra Retina XDR display powered by state-of-the-art Tandem OLED technology. Unleashes the next-generation M4 chip for unprecedented graphics performance and AI capabilities.",
    price: 89999,
    discount: 5,
    stock: 12,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/61kV643xjIL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Space Black", "Silver"],
    sizes: ["256GB"],
    specifications: [
      { name: "Display", value: "11-inch Ultra Retina XDR Tandem OLED" },
      { name: "Processor", value: "Apple M4 chip with 9-core CPU and 10-core GPU" },
      { name: "Camera", value: "12MP Wide back camera, landscape 12MP Ultra Wide front camera with Center Stage" },
      { name: "Storage", value: "256GB NVMe-class storage" }
    ]
  },
  {
    title: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    category: "Tablets",
    description: "Premium Android multi-tasker featuring a brilliant 120Hz Dynamic AMOLED 2X display. IP68 certified dust and water resistance allows you to bring your work and entertainment anywhere, guided by the signature high-precision S Pen.",
    price: 74999,
    discount: 10,
    stock: 15,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71O5U+2PKWL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Graphite", "Beige"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11-inch Dynamic AMOLED 2X Display (120Hz)" },
      { name: "Processor", value: "Snapdragon 8 Gen 2 for Galaxy" },
      { name: "Durability", value: "IP68 Water & Dust Resistant" },
      { name: "Stylus", value: "S Pen with ultra-low latency included" }
    ]
  },
  {
    title: "Samsung Galaxy Tab S9 FE",
    brand: "Samsung",
    category: "Tablets",
    description: "Fun meets functionality in a stylish package. Galaxy Tab S9 Fan Edition features a bright 90Hz display, a durable water-resistant frame, an included S Pen, and long battery life to power through your day.",
    price: 32999,
    discount: 10,
    stock: 20,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61l5a94VKkL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Gray", "Silver", "Mint", "Lavender"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "10.9-inch WQXGA smooth 90Hz screen" },
      { name: "Processor", value: "Exynos 1380 Octa-core processor" },
      { name: "Camera", value: "8MP Rear camera, 12MP Ultra-wide front camera" },
      { name: "Battery", value: "8000 mAh high-capacity battery" }
    ]
  },
  {
    title: "Samsung Galaxy Tab A9+",
    brand: "Samsung",
    category: "Tablets",
    description: "The perfect family-friendly companion. Boasts a massive 11-inch screen running on a fluid 90Hz refresh rate, quad-speaker surround sound system, and Samsung Kids lockouts for safe play.",
    price: 19999,
    discount: 12,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61MTXDqdidL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Graphite", "Silver", "Navy"],
    sizes: ["64GB"],
    specifications: [
      { name: "Display", value: "11.0-inch LCD display (90Hz)" },
      { name: "Processor", value: "Snapdragon 695 Octa-Core" },
      { name: "Audio", value: "Quad Speakers with Dolby Atmos support" },
      { name: "Connectivity", value: "Wi-Fi + 5G Cellular capability" }
    ]
  },
  {
    title: "OnePlus Pad",
    brand: "OnePlus",
    category: "Tablets",
    description: "Introducing the world's first 7:5 Read-Fit ratio screen. Delivering a fast, incredibly smooth 144Hz display, paired with a high-capacity battery supporting blazing 67W SUPERVOOC charging.",
    price: 37999,
    discount: 8,
    stock: 14,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61tTZgq1OIL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Halo Green"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11.61-inch 144Hz 7:5 Read-Fit display" },
      { name: "Processor", value: "MediaTek Dimensity 9000 flagship chip" },
      { name: "Battery", value: "9510 mAh with 67W SUPERVOOC flash charge" },
      { name: "Memory", value: "8GB LPDDR5 RAM" }
    ]
  },
  {
    title: "OnePlus Pad Go",
    brand: "OnePlus",
    category: "Tablets",
    description: "All-day entertainment made accessible. Packs a razor-sharp 2.4K display certified with dual eye-care protection, paired with Omnibearing quad speakers.",
    price: 24999,
    discount: 10,
    stock: 22,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61HTBi5HNQL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Twin Mint"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11.35-inch 2.4K eye-care display" },
      { name: "Processor", value: "MediaTek Helio G99 gaming processor" },
      { name: "Audio", value: "Dolby Atmos Quad Speaker array" },
      { name: "Connectivity", value: "Wi-Fi + 4G LTE enabled" }
    ]
  },
  {
    title: "Xiaomi Pad 6",
    brand: "Xiaomi",
    category: "Tablets",
    description: "Redefine productivity with an advanced 144Hz 7-stage variable refresh screen. Enclosed in a slim metallic unibody frame, perfect for streaming high-definition cinema or running office tasks easily.",
    price: 26999,
    discount: 10,
    stock: 25,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/81ft5tpZOhL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Graphite Grey", "Mist Blue"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11-inch 2.8K Crystal Clear 144Hz screen" },
      { name: "Processor", value: "Snapdragon 870 Octa-core peak performance" },
      { name: "Battery", value: "8840 mAh battery with 33W fast charger" },
      { name: "Material", value: "Premium Aluminum Alloy unibody housing" }
    ]
  },
  {
    title: "Xiaomi Pad 6 Pro",
    brand: "Xiaomi",
    category: "Tablets",
    description: "Heavyweight performance built for professional productivity. Driven by the high-octane Snapdragon 8+ Gen 1 chipset, supporting a magnificent wide gamut 144Hz display.",
    price: 32999,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71+7HlVQhhL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "Blue", "Gold"],
    sizes: ["256GB"],
    specifications: [
      { name: "Display", value: "11-inch 2.8K IPS display with 144Hz refresh" },
      { name: "Processor", value: "Snapdragon 8+ Gen 1 flagship processor" },
      { name: "Camera", value: "50MP Dual rear camera, 20MP front camera" },
      { name: "Battery", value: "8600 mAh with blazing 67W turbo charge" }
    ]
  },
  {
    title: "Lenovo Tab P12",
    brand: "Lenovo",
    category: "Tablets",
    description: "Expand your mind on a massive 12.7-inch 3K streaming canvas. Multitask fluidly across split screens, complete homework, or stream videos enriched by JBL quad speaker systems.",
    price: 27999,
    discount: 10,
    stock: 15,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/81R5CG+S5LL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Oatmeal Gray"],
    sizes: ["256GB"],
    specifications: [
      { name: "Display", value: "12.7-inch 3K (2944x1840) LCD display" },
      { name: "Processor", value: "MediaTek Dimensity 7050 Octa-core" },
      { name: "Audio", value: "JBL Quad Speakers with Dolby Atmos" },
      { name: "Stylus", value: "Lenovo Tab Pen Plus companion included" }
    ]
  },
  {
    title: "Lenovo Tab M10 Plus",
    brand: "Lenovo",
    category: "Tablets",
    description: "Third-generation modern study companion. Stunning 10.61-inch 2K IPS screen meets low-blue light eye certification, optimized beautifully with Google Kids space integrations.",
    price: 14999,
    discount: 5,
    stock: 20,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71qxj-OeOWL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Storm Grey", "Frost Blue"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "10.6-inch 2K IPS display with 400 nits brightness" },
      { name: "Processor", value: "Snapdragon 680 octa-core" },
      { name: "Audio", value: "Quad Speakers optimized with Dolby Atmos" },
      { name: "OS", value: "Android 12 with guaranteed updates" }
    ]
  },
  {
    title: "Lenovo Tab Extreme",
    brand: "Lenovo",
    category: "Tablets",
    description: "Unmatched cinematic excellence in a huge 14.5-inch 120Hz OLED screen. Fuses professional processing speeds, dual USB-C ports, and high-fidelity octa-speakers for total audio immersion.",
    price: 59999,
    discount: 10,
    stock: 8,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61ZEkMXevXL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Storm Grey"],
    sizes: ["256GB"],
    specifications: [
      { name: "Display", value: "14.5-inch 3K 120Hz OLED display (HDR10+)" },
      { name: "Processor", value: "MediaTek Dimensity 9000 trailblazer processor" },
      { name: "Audio", value: "8 JBL speakers with Dolby Atmos tuning" },
      { name: "OS", value: "Android 13 loaded with split screen optimizers" }
    ]
  },
  {
    title: "Realme Pad 2",
    brand: "Realme",
    category: "Tablets",
    description: "Smoother gestures, sharper screens. Boosts a stunning ultra-fluid 120Hz 2K display alongside quad mega-speakers tuned with Dolby Atmos in dynamic color-blocked designs.",
    price: 18999,
    discount: 5,
    stock: 18,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/71SIULlPnYL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Inspiration Green", "Imagination Grey"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11.5-inch 120Hz 2K resolution screen" },
      { name: "Processor", value: "MediaTek Helio G99 high speed gaming chip" },
      { name: "Battery", value: "8360 mAh with 33W SUPERVOOC fast charge" },
      { name: "Audio", value: "Quad Speakers with Dolby Atmos" }
    ]
  },
  {
    title: "Realme Pad X",
    brand: "Realme",
    category: "Tablets",
    description: "Enter a high-performance playground with 5g speeds. The Realme Pad X delivers Snapdragon power, premium 11-inch Display visuals, and certified low blue-light emission guards.",
    price: 24999,
    discount: 8,
    stock: 15,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71gRAJn8qiL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Glacier Blue", "Glowing Grey"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11-inch WUXGA+ Full View Screen" },
      { name: "Processor", value: "Snapdragon 695 5G-grade chipset" },
      { name: "Battery", value: "8340 mAh with 33W Dart Charge compatibility" },
      { name: "Audio", value: "Quad Stereo speakers with Smart PA systems" }
    ]
  },
  {
    title: "Nokia T21 Tablet",
    brand: "Nokia",
    category: "Tablets",
    description: "Built to last. Standard military-grade tough aluminum casing utilizing a scratch-safe glass front, paired with an elegant 2K screen supporting interactive stylus pens.",
    price: 16999,
    discount: 5,
    stock: 22,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/61JBkkpSw7L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Charcoal Grey"],
    sizes: ["64GB"],
    specifications: [
      { name: "Display", value: "10.4-inch 2K display with Active Pen support" },
      { name: "Processor", value: "Unisoc T612 secure octa-core processor" },
      { name: "Durability", value: "Toughened glass with solid aluminum frames" },
      { name: "OS", value: "Clean Android 12 with 2-year OS updates" }
    ]
  },
  {
    title: "Amazon Fire HD 10",
    brand: "Amazon",
    category: "Tablets",
    description: "Great value entertainment companion. Brilliant 10.1-inch 1080p display is ideal for streaming Prime videos, scrolling recipes, and controlling smart homes via Alexa voice loops.",
    price: 12999,
    discount: 10,
    stock: 18,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61Xu9ZPbkWL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "Denim Blue", "Olive Green"],
    sizes: ["64GB"],
    specifications: [
      { name: "Display", value: "10.1-inch Full HD (1920x1200) LCD display" },
      { name: "Processor", value: "MediaTek MT8183 Octa-Core" },
      { name: "Battery", value: "Up to 12 hours of reading or streaming" },
      { name: "Voice Support", value: "Hands-free built-in Alexa support" }
    ]
  },
  {
    title: "Amazon Fire Max 11",
    brand: "Amazon",
    category: "Tablets",
    description: "The biggest, most powerful Fire tablet. Premium 11-inch colorful touchscreen, durable aluminum framing, and built-in fingerprint scanners for secure device unlocking.",
    price: 17999,
    discount: 5,
    stock: 12,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/51WBM2VGYCL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Grey-Silver"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "11-inch 2K (2000x1200) touchscreen" },
      { name: "Processor", value: "MediaTek MT8188J Octa-core" },
      { name: "Camera", value: "8MP Front camera and 8MP Rear camera" },
      { name: "Security", value: "Integrated Fingerprint sensor power-key" }
    ]
  },
  {
    title: "Huawei MatePad 11",
    brand: "Huawei",
    category: "Tablets",
    description: "Experience outstanding multi-window productivity. Brilliant highly detailed 120Hz display paired with Huawei M-Pencil stylus support to craft gorgeous illustrations or digital documents easily.",
    price: 39999,
    discount: 10,
    stock: 10,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/41y3-OB6qnL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Matte Grey"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "10.95-inch 120Hz high refresh screen" },
      { name: "Processor", value: "Snapdragon 865 Octa-Core" },
      { name: "OS", value: "HarmonyOS customized multi-window layouts" },
      { name: "Audio", value: "Quad Speakers tuned by Harman Kardon" }
    ]
  },
  {
    title: "Microsoft Surface Go 4",
    brand: "Microsoft",
    category: "Tablets",
    description: "Windows 11 power packaged in an ultra-portable design. The Surface Go 4 provides high-integrity processing power, an integrated multi-angle kickstand, and full laptop-grade compatibility.",
    price: 64999,
    discount: 5,
    stock: 10,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61EAc0XaQ9L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Platinum"],
    sizes: ["128GB"],
    specifications: [
      { name: "Display", value: "10.5-inch PixelSense touchscreen display" },
      { name: "Processor", value: "Intel Processor N200 high efficiency CPU" },
      { name: "Operating System", value: "Windows 11 Home in S mode" },
      { name: "Connectivity", value: "Premium USB-C, Surface Connect, and Wi-Fi 6" }
    ]
  }
];

const LAPTOPS_DATA = [
  {
    title: "MacBook Air M5 13\"",
    brand: "Apple",
    category: "Laptops",
    description: "The absolute peak of thin and light laptops. Now powered by the groundbreaking M5 chip, delivering next-level performance and incredible battery life of up to 18 hours in a silent, fanless design.",
    price: 114999,
    discount: 5,
    stock: 25,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1717865499857-ec35ce6e65fa?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Space Gray", "Midnight", "Starlight"],
    sizes: ["8GB Unified Memory", "16GB Unified Memory"],
    specifications: [
      { name: "Processor", value: "Apple M5 8-Core CPU / 10-Core GPU" },
      { name: "RAM", value: "16 GB Unified Memory" },
      { name: "Storage", value: "512 GB Superfast SSD" },
      { name: "Display", value: "13.6-inch Liquid Retina Display" }
    ]
  },
  {
    title: "MacBook Pro M5 14\"",
    brand: "Apple",
    category: "Laptops",
    description: "Built for creators, innovators, and professionals. The MacBook Pro 14\" features the stunning Liquid Retina XDR screen with up to 1600 nits brightness and the hyper-powerful M5 chip for seamless multitasking.",
    price: 174999,
    discount: 0,
    stock: 18,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1526925712774-2833a7ecd0d4?q=80&w=1274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Space Black", "Silver"],
    sizes: ["16GB Unified Memory", "24GB Unified Memory"],
    specifications: [
      { name: "Processor", value: "Apple M5 Pro 10-core CPU" },
      { name: "RAM", value: "24 GB Unified Memory" },
      { name: "Storage", value: "1 TB Solid State Drive" },
      { name: "Display", value: "14.2-inch Liquid Retina XDR screen" }
    ]
  },
  {
    title: "MacBook Pro M5 16\"",
    brand: "Apple",
    category: "Laptops",
    description: "The ultimate laptop with extreme computing boundaries. Housing an expansive 16-inch workspace and exceptional pro graphics capabilities of Apple M5 Max, engineered for the most demanding workloads.",
    price: 239999,
    discount: 5,
    stock: 12,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1509701852059-c221a6f1e878?q=80&w=1091&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Space Black", "Silver"],
    sizes: ["32GB Unified Memory", "64GB Unified Memory"],
    specifications: [
      { name: "Processor", value: "Apple M5 Max 14-core CPU" },
      { name: "RAM", value: "32 GB Unified Memory" },
      { name: "Storage", value: "1 TB Ultra-Fast SSD" },
      { name: "Display", value: "16.2-inch Liquid Retina XDR screen" }
    ]
  },
  {
    title: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    description: "Experience the epitome of craftsmanship and design. Built with premium materials like carbon fiber and machined aluminum, the lightweight Dell XPS 13 combines a borderless InfinityEdge design with extreme speed.",
    price: 89999,
    discount: 8,
    stock: 22,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Platinum Silver", "Graphite Black"],
    sizes: ["16GB RAM | 512GB SSD", "16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core Ultra 7 155H" },
      { name: "RAM", value: "16 GB LPDDR5X Dual-Channel" },
      { name: "Storage", value: "512 GB NVMe M.2 SSD" },
      { name: "Display", value: "13.4-inch FHD+ InfinityEdge IPS" }
    ]
  },
  {
    title: "Dell XPS 15",
    brand: "Dell",
    category: "Laptops",
    description: "Power your intense creative workflows. The Dell XPS 15 is equipped with dedicated NVIDIA GeForce graphics, an immersive display, and an expansive carbon fiber wrist rest context.",
    price: 139999,
    discount: 10,
    stock: 14,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1554246247-6993b606e8b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Mineral Silver"],
    sizes: ["32GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i9-13900H Processor" },
      { name: "RAM", value: "32 GB DDR5 4800MHz" },
      { name: "Storage", value: "1 TB PCIe NVMe M.2 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4050 6GB GDDR6" }
    ]
  },
  {
    title: "Dell Inspiron 15",
    brand: "Dell",
    category: "Laptops",
    description: "The ideal everyday workhorse. Multitask with ease utilizing high-performance Intel Core components, built-in FHD video webcam covers, and comfortable ergonomic hinges.",
    price: 54999,
    discount: 5,
    stock: 35,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Platinum Silver", "Carbon Black"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i5-1235U Processor" },
      { name: "RAM", value: "16 GB DDR4 3200MHz" },
      { name: "Storage", value: "512 GB PCIe M.2 SSD" },
      { name: "Display", value: "15.6-inch FHD Antiglare Screen" }
    ]
  },
  {
    title: "Dell Inspiron 3530",
    brand: "Dell",
    category: "Laptops",
    description: "Thoughtfully designed for daily assignments. Incorporating a lift hinge that keeps typing postures comfortable, express charging systems, and crisp fluid audio integrations.",
    price: 47999,
    discount: 5,
    stock: 40,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1611258623154-c01feea09b1b?q=80&w=1128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Silver"],
    sizes: ["8GB RAM | 512GB SSD", "16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i3-1305U Processor" },
      { name: "RAM", value: "8 GB DDR4 3200MHz" },
      { name: "Storage", value: "512 GB NVMe SSD" },
      { name: "Display", value: "15.6-inch 120Hz ComfortView display" }
    ]
  },
  {
    title: "HP Pavilion 15",
    brand: "HP",
    category: "Laptops",
    description: "Modern metallic layout meets high digital performance. Features Audio by B&O for rich immersive acoustic sound outputs, and a vibrant micro-edge workspace frame.",
    price: 62999,
    discount: 7,
    stock: 30,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1565375706404-082d37dd1f5d?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Warm Silver", "Forest Teal"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "AMD Ryzen 5 7530U Processor" },
      { name: "RAM", value: "16 GB DDR5 Memory" },
      { name: "Storage", value: "512 GB M.2 NVMe SSD" },
      { name: "Display", value: "15.6-inch FHD IPS Backlit Touch" }
    ]
  },
  {
    title: "HP Victus Gaming Laptop",
    brand: "HP",
    category: "Laptops",
    description: "Uplift your gameplay sessions. HP Victus offers incredible processing speed, premium dual fan ventilation systems, and a high refresh rate display layout.",
    price: 68999,
    discount: 10,
    stock: 25,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1619532550465-ad4dc9bd680a?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Mica Silver", "Performance Blue"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i5-13420H Processor" },
      { name: "RAM", value: "16 GB DDR5 Dual-Channel" },
      { name: "Storage", value: "512 GB PCIe Gen4 NVMe M.2" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 3050 4GB" }
    ]
  },
  {
    title: "HP OmniBook X",
    brand: "HP",
    category: "Laptops",
    description: "Next-gen Snapdragon-powered AI notebook. Designed for hyper-efficient operations with dedicated neural processors ready for CoPilot+ intelligent work.",
    price: 99999,
    discount: 5,
    stock: 15,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1599299009482-3b5326fc52e4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Boreal Teal", "Stellar Gray"],
    sizes: ["16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Snapdragon X Elite X1E-78-100" },
      { name: "RAM", value: "16 GB LPDDR5X Dual-Channel" },
      { name: "Storage", value: "1 TB PCIe NVMe SSD" },
      { name: "Display", value: "14.0-inch 2.2K Touch Screen" }
    ]
  },
  {
    title: "HP Spectre x360",
    brand: "HP",
    category: "Laptops",
    description: "The luxury standard for convertible laptops. Spectacular gem-cut chassis, integrated smart stylus pens, and an exceptionally rich immersive OLED screen panel.",
    price: 129999,
    discount: 8,
    stock: 10,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1618424562492-f778e25652a1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Nightfall Black", "Nocturne Blue"],
    sizes: ["16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core Ultra 7 155H" },
      { name: "RAM", value: "16 GB LPDDR5x Dual-Channel" },
      { name: "Storage", value: "1 TB PCIe 4.0 NVMe SSD" },
      { name: "Display", value: "14.0-inch 2.8K 120Hz OLED Touch" }
    ]
  },
  {
    title: "Lenovo IdeaPad Slim 5",
    brand: "Lenovo",
    category: "Laptops",
    description: "Unbelievable portability combined with daily structural reliability. A slim design certified to military-grade standards to survive drop and bump impacts during commutes.",
    price: 79999,
    discount: 10,
    stock: 35,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1763162410742-1d0097cea556?q=80&w=1217&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Cloud Gray", "Abyss Blue"],
    sizes: ["16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "AMD Ryzen 7 7730U" },
      { name: "RAM", value: "16 GB DDR4 3200MHz" },
      { name: "Storage", value: "1 TB PCIe NVMe SSD" },
      { name: "Display", value: "15.6-inch FHD Antiglare Display" }
    ]
  },
  {
    title: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    category: "Laptops",
    description: "The gold standard of corporate executive laptops. Incredibly strong and lightweight carbon-fiber chassis, legendary robust tactile keyboards, and multiple integrated lock systems.",
    price: 149999,
    discount: 5,
    stock: 15,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1763162139130-240507e9fad5?q=80&w=1321&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Carbon Matte Black"],
    sizes: ["32GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core Ultra 7 vPro 155U" },
      { name: "RAM", value: "32 GB LPDDR5X Dual-Channel" },
      { name: "Storage", value: "1 TB Gen 4 NVMe M.2 SSD" },
      { name: "Display", value: "14.0-inch WUXGA IPS ComfortView" }
    ]
  },
  {
    title: "Lenovo LOQ Gaming Laptop",
    brand: "Lenovo",
    category: "Laptops",
    description: "Step into elite gaming tiers without breaking budgets. Features hyper-efficient cooling configurations, custom system optimization profiles, and Nahimic 3D soundscapes.",
    price: 84999,
    discount: 10,
    stock: 20,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Storm Gray"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i7-13650H Processor" },
      { name: "RAM", value: "16 GB DDR5 5200MHz" },
      { name: "Storage", value: "512 GB PCIe M.2 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4050 6GB" }
    ]
  },
  {
    title: "Lenovo Legion Pro 5",
    brand: "Lenovo",
    category: "Laptops",
    description: "A supreme gaming notebook engineered for raw performance. Dominating competitive arenas with Coldfront cooling vents, elite refresh displays, and Lenovo AI engine assistance.",
    price: 149999,
    discount: 5,
    stock: 12,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Steel Gray"],
    sizes: ["32GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i9-14900HX Processor" },
      { name: "RAM", value: "32 GB DDR5 Dual-Channel" },
      { name: "Storage", value: "1 TB Gen4 NVMe M.2 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4070 8GB" }
    ]
  },
  {
    title: "ASUS Vivobook 15",
    brand: "ASUS",
    category: "Laptops",
    description: "Elegant layout matches everyday functionality. Built with 180-degree lay-flat hinges, physical webcam security slider covers, and anti-microbial product shell protections.",
    price: 52999,
    discount: 8,
    stock: 40,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1636211990414-8edec17ba047?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Quiet Blue", "Icelight Silver"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i5-1235U Processor" },
      { name: "RAM", value: "16 GB DDR4 Dual-Channel" },
      { name: "Storage", value: "512 GB super-responsive SSD" },
      { name: "Display", value: "15.6-inch FHD anti-glare screen" }
    ]
  },
  {
    title: "ASUS Zenbook 14 OLED",
    brand: "ASUS",
    category: "Laptops",
    description: "Incredibly premium portable visual masterworks. Exceptionally sleek profile featuring Pantone-validated 120Hz OLED screen grids and professional Harmon Kardon speakers.",
    price: 89999,
    discount: 7,
    stock: 18,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1630794180018-433d915c34ac?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Ponder Blue", "Foggy Silver"],
    sizes: ["16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core Ultra 5 125H" },
      { name: "RAM", value: "16 GB LPDDR5X Dual-Channel" },
      { name: "Storage", value: "1 TB PCIe 4.0 NVMe SSD" },
      { name: "Display", value: "14.0-inch 3K 120Hz OLED Touch" }
    ]
  },
  {
    title: "ASUS ROG Strix G16",
    brand: "ASUS",
    category: "Laptops",
    description: "Specifically engineered to win competitive tournaments. Housing premium liquid metal thermal cooling nodes, custom RGB keyboard regions, and ultra high graphic limits.",
    price: 129999,
    discount: 5,
    stock: 15,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1695891888323-661dbe27dc79?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Volcano Black"],
    sizes: ["16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i7-13650HX Processor" },
      { name: "RAM", value: "16 GB DDR5 4800MHz" },
      { name: "Storage", value: "1 TB NVMe M.2 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4060 8GB" }
    ]
  },
  {
    title: "ASUS TUF Gaming A15",
    brand: "ASUS",
    category: "Laptops",
    description: "Rugged durability combined with blistering gaming limits. certified drop protections, high vent designs, and stable long run times.",
    price: 74999,
    discount: 10,
    stock: 22,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1645385890999-43dcd4f4a703?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Industrial Gray"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "AMD Ryzen 7 7735HS Processor" },
      { name: "RAM", value: "16 GB DDR5 4800MHz" },
      { name: "Storage", value: "512 GB PCIe M.2 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 3050 4GB" }
    ]
  },
  {
    title: "Acer Aspire 7",
    brand: "Acer",
    category: "Laptops",
    description: "High-octane daily workflows in clean minimalist frames. Features dual copper ventilation channels to deal with complex demands and customizable parameters.",
    price: 54999,
    discount: 10,
    stock: 30,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Elegant Charcoal"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "AMD Ryzen 5 5625U Processor" },
      { name: "RAM", value: "16 GB DDR4 Dual-Channel" },
      { name: "Storage", value: "512 GB M.2 NVMe SSD" },
      { name: "Graphics", value: "NVIDIA GeForce GTX 1650 4GB" }
    ]
  },
  {
    title: "Acer Nitro V",
    brand: "Acer",
    category: "Laptops",
    description: "Start your intense gaming sessions instantly. Immersive surround acoustics, hyper-cool copper ventilation circuits, and stellar refresh setups.",
    price: 69999,
    discount: 8,
    stock: 25,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1693206578613-144dd540b892?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Shale Black"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i5-13420H Processor" },
      { name: "RAM", value: "16 GB DDR5 Memory" },
      { name: "Storage", value: "512 GB PCIe Gen4 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4050 6GB" }
    ]
  },
  {
    title: "Acer Predator Helios Neo 16",
    brand: "Acer",
    category: "Laptops",
    description: "Conquer digital horizons with raw brutal performance parameters. High-density screen pixels, custom programmable keys, and AeroBlade air cooling nodes.",
    price: 124999,
    discount: 5,
    stock: 14,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1522198428577-adf2d374b05b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Predator Abyssal Black"],
    sizes: ["16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i7-14700HX Processor" },
      { name: "RAM", value: "16 GB DDR5 Memory" },
      { name: "Storage", value: "1 TB Gen 4 NVMe M.2 SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4060 8GB" }
    ]
  },
  {
    title: "MSI Katana 15",
    brand: "MSI",
    category: "Laptops",
    description: "Slice through tough gameplay tasks seamlessly. Featuring high precision mechanical construct elements, customized heat pipes, and high graphics thresholds.",
    price: 89999,
    discount: 10,
    stock: 15,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1623040522601-18ef4bf3ddc9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Tech Black"],
    sizes: ["16GB RAM | 1TB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i7-13620H Processor" },
      { name: "RAM", value: "16 GB DDR5 5200MHz" },
      { name: "Storage", value: "1 TB M.2 Gen4 NVMe SSD" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4060 8GB" }
    ]
  },
  {
    title: "MSI Cyborg 15",
    brand: "MSI",
    category: "Laptops",
    description: "Translucent cyberpunk industrial styling coupled with extreme portable graphic layouts. Beautifully designed with durable and light composite material blends.",
    price: 79999,
    discount: 5,
    stock: 20,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1617294864705-eaf3c911259f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Translucent Blue Black"],
    sizes: ["16GB RAM | 512GB SSD"],
    specifications: [
      { name: "Processor", value: "Intel Core i5-12450H Processor" },
      { name: "RAM", value: "16 GB DDR5 4800MHz" },
      { name: "Storage", value: "512 GB Gen4 SSD M.2" },
      { name: "Graphics", value: "NVIDIA GeForce RTX 4050 6GB" }
    ]
  }
];

const MENS_CLOTHING_DATA = [
  {
    title: "Classic Cotton Crew Neck T-Shirt",
    brand: "Levi's",
    category: "Men's Clothing",
    description: "Keep it simple and classic with this comfortable cotton crew neck t-shirt. Features a soft-touch breathable fabric designed for everyday casual wear.",
    price: 999,
    discount: 10,
    stock: 50,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1661181475147-bbd20ef65781?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Navy Blue", "Heather Gray", "Classic White"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Breathable Cotton" },
      { name: "Fit", value: "Regular Fit" },
      { name: "Sleeve", value: "Short Sleeve" },
      { name: "Neckline", value: "Crew Neck" }
    ]
  },
  {
    title: "Premium Slim Fit Polo T-Shirt",
    brand: "US Polo Assn.",
    category: "Men's Clothing",
    description: "Elevate your smart-casual look with this premium slim-fit polo, sporting the iconic signature embroidery. Styled with rich piqued fabric and classic ribbed collars.",
    price: 1499,
    discount: 15,
    stock: 40,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1744551358329-d14e62a178a8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Royal Blue", "Forest Green", "Crimson Red"],
    sizes: ["M", "L", "XL", "XXL"],
    specifications: [
      { name: "Material", value: "95% Cotton, 5% Elastane" },
      { name: "Fit", value: "Slim Fit" },
      { name: "Knit Type", value: "Fine Pique Knit" },
      { name: "Wash Care", value: "Machine Wash Cold" }
    ]
  },
  {
    title: "Casual Graphic Printed T-Shirt",
    brand: "H&M",
    category: "Men's Clothing",
    description: "A trendy street-inspired graphic tee featuring artful illustrations. Made of premium medium-weight cotton jersey that holds its shape beautifully.",
    price: 899,
    discount: 5,
    stock: 35,
    rating: 4.4,
    images: ["https://plus.unsplash.com/premium_photo-1692650759344-84ff0f26ff1e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Off-white", "Acid Wash Charcoal", "Sage Green"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Ring-Spun Cotton" },
      { name: "Print Type", value: "Soft-feel Screen Print" },
      { name: "Neckline", value: "Ribbed Crew Neck" },
      { name: "Sleeve", value: "Relaxed Drop Shoulder" }
    ]
  },
  {
    title: "Regular Fit Solid Shirt",
    brand: "Allen Solly",
    category: "Men's Clothing",
    description: "Look dapper from work to weekend. This regular fit solid dress shirt offers superior comfort, breathable weave, and crisp collars that stay sharp all day.",
    price: 1799,
    discount: 20,
    stock: 30,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1569140691316-937a883073fc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Sky Blue", "Classic White", "Soft Pink"],
    sizes: ["38", "40", "42", "44"],
    specifications: [
      { name: "Material", value: "100% Premium Cotton" },
      { name: "Fit", value: "Regular Tailored Fit" },
      { name: "Collar Type", value: "Semi-Spread Collar" },
      { name: "Sleeve Type", value: "Full Sleeve" }
    ]
  },
  {
    title: "Linen Full Sleeve Shirt",
    brand: "Louis Philippe",
    category: "Men's Clothing",
    description: "Crafted for discerning tastes, this pure linen luxury shirt offers lightweight luxury. Naturally moisture-wicking and exceptionally cool for sophisticated daytime wear.",
    price: 2499,
    discount: 10,
    stock: 25,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1740711152088-88a009e877bb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Beige", "Mint Green", "Ocean Blue"],
    sizes: ["M", "L", "XL", "XXL"],
    specifications: [
      { name: "Material", value: "100% Pure Organic Linen" },
      { name: "Fit", value: "Custom Fit" },
      { name: "Texture", value: "Slub Linen Weave" },
      { name: "Sleeve", value: "Full Sleeve with mitered cuffs" }
    ]
  },
  {
    title: "Checked Casual Shirt",
    brand: "Peter England",
    category: "Men's Clothing",
    description: "Infuse versatile styles into your wardrobe with this checked casual shirt. Ideal for layering over plain tees, featuring an incredibly soft brushed cotton feel.",
    price: 1699,
    discount: 12,
    stock: 28,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1550344071-13ecada2a91d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Red-Navy Check", "Grayscale Tartan"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "80% Cotton, 20% Polyester" },
      { name: "Fit", value: "Modern Fit" },
      { name: "Collar", value: "Classic Button-Down" },
      { name: "Hemline", value: "Curved Hem" }
    ]
  },
  {
    title: "Slim Fit Formal Shirt",
    brand: "Van Heusen",
    category: "Men's Clothing",
    description: "Command the boardroom with absolute confidence. Features sharp cuts, dynamic stretch properties, wrinkle-resistance, and an immaculate clean finish.",
    price: 2199,
    discount: 15,
    stock: 22,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Charcoal Grey", "Pure White", "Midnight Navy"],
    sizes: ["39", "40", "42", "44"],
    specifications: [
      { name: "Material", value: "Cotton Polyester Blend with Stretch" },
      { name: "Fit", value: "Ultra Slim Fit" },
      { name: "Treatment", value: "Easy-Iron Wrinkle Resistant" },
      { name: "Cuff Type", value: "Dual Option French Cuffs" }
    ]
  },
  {
    title: "Stretchable Denim Jeans",
    brand: "Levi's",
    category: "Men's Clothing",
    description: "The ultimate blue jeans engineered with innovative flex stretch denim technology. Built to look stylish, feel incredibly free, and endure heavy daily wear.",
    price: 2999,
    discount: 8,
    stock: 45,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Indigo Dark Wash", "Medium Wash Blue"],
    sizes: ["30", "32", "34", "36"],
    specifications: [
      { name: "Material", value: "98% Cotton, 2% Lycra Stretch" },
      { name: "Fit Type", value: "511 Slim Fit" },
      { name: "Pocket Style", value: "Classic 5-pocket layout" },
      { name: "Fly Type", value: "Secure Zip Fly with Button Closure" }
    ]
  },
  {
    title: "Slim Fit Blue Jeans",
    brand: "Wrangler",
    category: "Men's Clothing",
    description: "Tough, authentic, and modern styled slim-fit blue jeans. Features heavy-duty stitching, reinforced flat rivets, and top-tier stretch construction.",
    price: 2499,
    discount: 5,
    stock: 32,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Deep Indigo Blue", "Stone Washed Blue"],
    sizes: ["30", "32", "34", "36"],
    specifications: [
      { name: "Material", value: "Heavyweight Cotton Denim" },
      { name: "Fit Type", value: "Texas Slim Fit" },
      { name: "Rise", value: "Mid-Rise Waist" },
      { name: "Hardware", value: "Brushed Brass Accents" }
    ]
  },
  {
    title: "Regular Fit Chinos",
    brand: "Allen Solly",
    category: "Men's Clothing",
    description: "The perfect smart-casual alternative to denim. Meticulously tailored regular-fit chinos crafted with sateen-soft cotton stretch twill fabric for premium daylong comfort.",
    price: 1999,
    discount: 10,
    stock: 40,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1668585454790-3d68a3e1393e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Khaki Tan", "Jet Black", "Navy Blue"],
    sizes: ["30", "32", "34", "36"],
    specifications: [
      { name: "Material", value: "97% Cotton, 3% Spandex Twill" },
      { name: "Fit", value: "Regular Straight Fit" },
      { name: "Closure", value: "Zip fly with dual button locks" },
      { name: "Pockets", value: "Slanted side pockets, buttoned rear pockets" }
    ]
  },
  {
    title: "Cargo Utility Pants",
    brand: "Roadster",
    category: "Men's Clothing",
    description: "Engineered for adventure, styled for the city. Practical multi-pocket design, rugged twill weave, and specialized utility straps for an authentic military-inspired look.",
    price: 1899,
    discount: 15,
    stock: 25,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1638412326564-47ec4b061636?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Tactical Olive Green", "Desert Sand Khaki"],
    sizes: ["30", "32", "34", "36"],
    specifications: [
      { name: "Material", value: "Heavy combed Cotton Canvas" },
      { name: "pockets", value: "6 pockets (2 cargo flap, 2 side, 2 rear)" },
      { name: "Fit Type", value: "Relaxed Cargo Fit" },
      { name: "Hem", value: "Adjustable drawstring cuffs" }
    ]
  },
  {
    title: "Cotton Jogger Pants",
    brand: "Puma",
    category: "Men's Clothing",
    description: "Ultra-cozy brushed fleece cotton joggers designed for active routines and lazy weekends. Features contrast panels, elasticated drawcord waist, and ribbed cuffs.",
    price: 1799,
    discount: 5,
    stock: 38,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1638412326301-ed5d877d4c5c?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Melange Gray", "Obsidian Black"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "80% Cotton fleece, 20% Polyester" },
      { name: "Waistband", value: "Ribbed elastic with heavy tipped drawcords" },
      { name: "Ankle", value: "Extended secure elastic rib cuffs" },
      { name: "Logo", value: "Classic cat brand screen print" }
    ]
  },
  {
    title: "Sports Training Shorts",
    brand: "Adidas",
    category: "Men's Clothing",
    description: "Designed to keep you exceptionally dry and focused during high-intensity training. Features custom moisture-wicking technology and premium mesh ventilation linings.",
    price: 1299,
    discount: 10,
    stock: 45,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1640943136566-3edeb13e3d3b?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Active Black White Stripes", "Steel Blue"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Recycled Primegreen Polyester" },
      { name: "Technology", value: "AEROREADY dry comfort technology" },
      { name: "Inseam", value: "7 inches" },
      { name: "Pockets", value: "Zippered side pockets" }
    ]
  },
  {
    title: "Running Performance Shorts",
    brand: "Nike",
    category: "Men's Clothing",
    description: "Reach your personal targets with ultimate lightweight freedom of movement. Built-in moisture support liner and reflective elements for dark night runs.",
    price: 1499,
    discount: 8,
    stock: 30,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1559166631-ef208440c75a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Volt Neon", "Anthracite Dark Gray"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "Dri-FIT 100% micro-polyester" },
      { name: "Lining", value: "Integrated internal moisture liner" },
      { name: "Inseam", value: "5 inches active split" },
      { name: "Reflective", value: "Reflective Swoosh brand mark" }
    ]
  },
  {
    title: "Hooded Sweatshirt",
    brand: "Puma",
    category: "Men's Clothing",
    description: "Classic styling meets premium warmth. High density cotton-fleece pullover sweatshirt with cozy adjustable drawstring hoods and roomy front pouch pockets.",
    price: 2499,
    discount: 15,
    stock: 20,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Olive", "Stealth Grey Carbon"],
    sizes: ["M", "L", "XL"],
    specifications: [
      { name: "Material", value: "Heavyweight Cotton Polyester Blend" },
      { name: "Sleeve Type", value: "Long Sleeve with ribbed cuffs" },
      { name: "Hood", value: "Double layered fabric with drawstrings" },
      { name: "Style", value: "Classic Kangaroo Pocket front" }
    ]
  },
  {
    title: "Graphic Hoodie",
    brand: "H&M",
    category: "Men's Clothing",
    description: "Express your artistic flair with this vibrant printed graphic hoodie. High-density street fashion art design on ultra soft-texture loopback fleece cloth.",
    price: 2299,
    discount: 10,
    stock: 18,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1680292783974-a9a336c10366?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Sandstone Off-White", "Vintage Washed Violet"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "70% Organic Cotton, 30% Polyester" },
      { name: "Art Type", value: "High-density puff graphic print" },
      { name: "Fit", value: "Oversized Streetwear Fit" },
      { name: "Knit Type", value: "Loopback interior terry knit" }
    ]
  },
  {
    title: "Lightweight Bomber Jacket",
    brand: "Jack & Jones",
    category: "Men's Clothing",
    description: "The classic pilot silhouette updated with premium lightweight weather-resistant materials. Finished with ribbed trim collars, cuffs, and utility zip sleeve pockets.",
    price: 3499,
    discount: 20,
    stock: 15,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Army Green", "Triple Metallic Black"],
    sizes: ["M", "L", "XL", "XXL"],
    specifications: [
      { name: "Material Shell", value: "100% Water-repellent Nylon" },
      { name: "Lining", value: "Soft satin breathable orange lining" },
      { name: "Pocket", value: "Sleeve zippered utility pocket + inner pockets" },
      { name: "Closure", value: "YKK heavy-gauge designer zip" }
    ]
  },
  {
    title: "Casual Zip-Up Jacket",
    brand: "Tommy Hilfiger",
    category: "Men's Clothing",
    description: "Iconic flag colors and classic athletic zip-up profiles. Mesh lining provides ventilation, and the durable performance shell is moisture and wind resistant.",
    price: 4999,
    discount: 15,
    stock: 12,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1652211185275-182a11668cea?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Signature Navy White Red", "Pure Obsidian Black"],
    sizes: ["M", "L", "XL", "XXL"],
    specifications: [
      { name: "Material", value: "Windbreaker Polyester performance fabric" },
      { name: "Collar Type", value: "Stand-Up lined collar with packable hood" },
      { name: "Sleeve", value: "Elasticated windbreaker cuffs" },
      { name: "Pockets", value: "Secure dual-zipper waist pockets" }
    ]
  },
  {
    title: "Ethnic Cotton Kurta",
    brand: "Manyavar",
    category: "Men's Clothing",
    description: "Traditional cotton self-weave kurta ideal for family gatherings and cultural festivals. Tailored with a smart mandarin collar and side-slit utility pockets.",
    price: 1799,
    discount: 5,
    stock: 22,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1715859019107-90c16285b149?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Saffron", "Royal Cream Ivory", "Teal Blue"],
    sizes: ["38", "40", "42", "44"],
    specifications: [
      { name: "Material", value: "100% Hand-woven organic combed cotton" },
      { name: "Collar Style", value: "Traditional Mandarin collar" },
      { name: "Placket Type", value: "Half-button placket with designer buttons" },
      { name: "Fit", value: "Tailored comfortable straight fit" }
    ]
  },
  {
    title: "Premium Wedding Kurta Set",
    brand: "Manyavar",
    category: "Men's Clothing",
    description: "Exquisite celebration wear featuring premium silk-blend fabrics, detailed threadwork embroidery, and contrasting designer churidar pajamas.",
    price: 4499,
    discount: 10,
    stock: 14,
    rating: 4.8,
    images: ["https://plus.unsplash.com/premium_photo-1691030256088-91089c9e66e9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Imperial Gold Maroon", "Groom Ivory Silver"],
    sizes: ["38", "40", "42", "44"],
    specifications: [
      { name: "Material", value: "Tussar Silk and Cotton Jacquard blend" },
      { name: "Workmanship", value: "Intricate zari collar thread embroidery" },
      { name: "Set Inclusions", value: "1 Luxury Kurta and 1 Churidar pajama set" },
      { name: "Care Type", value: "Dry Clean Only recommended" }
    ]
  }
];

const WOMENS_CLOTHING_DATA = [
  {
    title: "Solid Cotton Round Neck T-Shirt",
    brand: "H&M",
    category: "Women's Clothing",
    description: "An absolute essential. This round-neck t-shirt is made of ultra-soft combed cotton for a polished everyday look.",
    price: 899,
    discount: 10,
    stock: 50,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=1072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic White", "Midnight Black", "Pastel Pink"],
    sizes: ["XS", "S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Combed Cotton" },
      { name: "Fit", value: "Regular Fit" },
      { name: "Neckline", value: "Round Neck" },
      { name: "Wash Care", value: "Machine Wash Cold" }
    ]
  },
  {
    title: "Oversized Graphic T-Shirt",
    brand: "Zara",
    category: "Women's Clothing",
    description: "Get that effortless streetwear vibe with this oversized t-shirt, featuring custom minimal graphics on soft organic cotton.",
    price: 1299,
    discount: 15,
    stock: 40,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1661110546797-d86cc72a2765?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Charcoal Grey", "Off-White", "Cream"],
    sizes: ["S", "M", "L"],
    specifications: [
      { name: "Material", value: "100% Organic Cotton" },
      { name: "Fit", value: "Oversized Fit" },
      { name: "Sleeve", value: "Drop Shoulder" }
    ]
  },
  {
    title: "Slim Fit Polo T-Shirt",
    brand: "US Polo Assn.",
    category: "Women's Clothing",
    description: "A sporty yet elegant choice, featuring fine piqued fabric, ribbed collar, and signature logo embroidery for a tailored fit.",
    price: 1499,
    discount: 12,
    stock: 35,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1714317437452-e36880e5f385?q=80&w=1085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Navy Blue", "Crimson Red", "Bright Yellow"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "95% Cotton, 5% Elastane" },
      { name: "Fit", value: "Slim Fit" },
      { name: "Knit Type", value: "Pique Knit" }
    ]
  },
  {
    title: "Floral Printed Casual Top",
    brand: "ONLY",
    category: "Women's Clothing",
    description: "Add a splash of botanic charm to your day. This vibrant floral causal top features soft flowing fabric and comfortable flared sleeves.",
    price: 1599,
    discount: 5,
    stock: 30,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1630544309199-2a267e22b7ac?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Botanical Blue", "Floral Peach"],
    sizes: ["XS", "S", "M", "L"],
    specifications: [
      { name: "Material", value: "100% Polyester Georgette" },
      { name: "Pattern", value: "Floral Print" },
      { name: "Sleeve Type", value: "3/4 Flared Sleeves" }
    ]
  },
  {
    title: "Puff Sleeve Crop Top",
    brand: "Forever 21",
    category: "Women's Clothing",
    description: "Make a statement with this stylish puff-sleeve crop top. Perfect for high-waisted denim and warm sunny afternoons.",
    price: 1299,
    discount: 8,
    stock: 28,
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Blush Pink", "Sage Green", "Ebony Black"],
    sizes: ["XS", "S", "M", "L"],
    specifications: [
      { name: "Material", value: "80% Cotton, 20% Polyester" },
      { name: "Fit", value: "Crop Fit" },
      { name: "Sleeve Details", value: "Elasticated Puff Sleeve" }
    ]
  },
  {
    title: "Satin V-Neck Blouse",
    brand: "Mango",
    category: "Women's Clothing",
    description: "Drape yourself in continuous luxury. This glossy satin V-neck blouse transitions seamlessly from work meetings to dinner plans.",
    price: 2199,
    discount: 15,
    stock: 25,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1704775983224-43dae05da876?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Emerald Green", "Champagne Gold", "Midnight Blue"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "Premium Smooth Satin" },
      { name: "Neckline", value: "V-Neck" },
      { name: "Fit", value: "Graceful relaxed drape" }
    ]
  },
  {
    title: "High-Rise Skinny Jeans",
    brand: "Levi's",
    category: "Women's Clothing",
    description: "Designed to flatter, hold, and lift. Crafted with premium stretch denim that keeps its shape all day long.",
    price: 2999,
    discount: 10,
    stock: 45,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1547410701-73b5a0ada51d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Indigo Duo", "Midnight Dark Wash"],
    sizes: ["26", "28", "30", "32", "34"],
    specifications: [
      { name: "Material", value: "98% Cotton, 2% Elastane" },
      { name: "Rise", value: "High-Rise Waist" },
      { name: "Fit Type", value: "Super Skinny Fit" }
    ]
  },
  {
    title: "Straight Fit Denim Jeans",
    brand: "Wrangler",
    category: "Women's Clothing",
    description: "Get the timeless retro silhouette with these comfortable, vintage straight-legged denim jeans built for everyday wear.",
    price: 2499,
    discount: 5,
    stock: 32,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1714143164510-7833c904d8c9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Light Stone Wash", "Classic Indigo"],
    sizes: ["26", "28", "30", "32", "34"],
    specifications: [
      { name: "Material", value: "100% Rugged Cotton Denim" },
      { name: "Rise", value: "Mid-Rise" },
      { name: "Leg Opening", value: "Straight Leg" }
    ]
  },
  {
    title: "Wide Leg Trousers",
    brand: "Allen Solly Woman",
    category: "Women's Clothing",
    description: "Stay ahead in styling with these sophisticated wide-leg trousers. Designed with a structured high-rise waist and fluid pleats.",
    price: 2299,
    discount: 10,
    stock: 22,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1651742532474-ea4401a34a10?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Beige Sand", "Jet Black", "Navy Blue"],
    sizes: ["28", "30", "32", "34"],
    specifications: [
      { name: "Material", value: "65% Polyester, 35% Viscose" },
      { name: "Fit", value: "High-Waist Wide Leg" },
      { name: "Pockets", value: "Functional side slant pockets" }
    ]
  },
  {
    title: "Cotton Palazzo Pants",
    brand: "Biba",
    category: "Women's Clothing",
    description: "Flared, exceptionally breathable, and styled with detailed thread hem lines. Perfect companion for traditional kurtis.",
    price: 1899,
    discount: 8,
    stock: 30,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1766556514059-303c3b790424?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Creamy Ivory", "Classic Jet Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    specifications: [
      { name: "Material", value: "100% Hand-woven Organic Cotton" },
      { name: "Elastic Type", value: "Fully Elasticated Waistband with Drawstring" },
      { name: "Hem Design", value: "Intricate lace trim detail" }
    ]
  },
  {
    title: "Floral A-Line Dress",
    brand: "AND",
    category: "Women's Clothing",
    description: "A breezy A-line dress featuring charming floral motifs. Includes a waist-cinching tie and fully lined premium georgette fabric.",
    price: 2999,
    discount: 15,
    stock: 18,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1549062573-edc78a53ffa6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Sunset Floral Peach", "Daisy Fresh Blue"],
    sizes: ["XS", "S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "Polyester Georgette with inner lining" },
      { name: "Fit Type", value: "A-Line fit" },
      { name: "Length", value: "Knee Length" }
    ]
  },
  {
    title: "Midi Summer Dress",
    brand: "Zara",
    category: "Women's Clothing",
    description: "Embrace the bright warmth. This airy midi dress offers comfortable strap adjustments, structured bodice, and ruffled tiers.",
    price: 3499,
    discount: 20,
    stock: 15,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1688480344367-835dcfd11f87?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["White Bloom", "Terracotta Red"],
    sizes: ["XS", "S", "M", "L"],
    specifications: [
      { name: "Material", value: "100% Soft Cotton" },
      { name: "Length", value: "Midi Length" },
      { name: "Strap", value: "Adjustable slender shoulder straps" }
    ]
  },
  {
    title: "Bodycon Party Dress",
    brand: "Forever New",
    category: "Women's Clothing",
    description: "Unravel elegance and glamour. This form-fitting knit bodycon dress features standard rib panels and a sophisticated boat neckline.",
    price: 4299,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1582509224001-cf25743834f4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Burgundy Wine", "Ebony Midnight Black"],
    sizes: ["S", "M", "L"],
    specifications: [
      { name: "Material", value: "Viscose Polyester Stretchy Blend" },
      { name: "FitType", value: "Bodycon snug fit" },
      { name: "Dress Neckline", value: "Boat neck" }
    ]
  },
  {
    title: "Ethnic Printed Kurti",
    brand: "Aurelia",
    category: "Women's Clothing",
    description: "Rich everyday ethnic wear. Traditional hand-printed motifs on fluid rayon material for all-season breathability and beauty.",
    price: 1499,
    discount: 5,
    stock: 25,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1760287364219-160c234ded00?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Mustard Yellow", "Rust Orange"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    specifications: [
      { name: "Material", value: "100% Breathable Rayon" },
      { name: "Sleeve Type", value: "3/4 Fold-up sleeves" },
      { name: "Style", value: "Straight fit with side slits" }
    ]
  },
  {
    title: "Cotton Kurta Set",
    brand: "W for Woman",
    category: "Women's Clothing",
    description: "A complete coordinated set, including a straight tailored long kurta, solid trousers, and a lightweight printed crinkled dupatta.",
    price: 2999,
    discount: 10,
    stock: 20,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1740992556553-fc3b65201cf3?q=80&w=666&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Sage Mint Green", "Soft Peach Terracotta"],
    sizes: ["32", "34", "36", "38", "40"],
    specifications: [
      { name: "Material", value: "100% Egyptian Cotton Knit" },
      { name: "Neck Design", value: "Round neck with button slit placket" },
      { name: "Set Contains", value: "1 Kurta, 1 Trousers trouser pant, 1 Dupatta scarf" }
    ]
  },
  {
    title: "Designer Anarkali Kurta",
    brand: "Libas",
    category: "Women's Clothing",
    description: "Graceful festive silhouette showing premium flare. Detailed thread embroidery around the yoke and metallic gold block printed trims.",
    price: 3999,
    discount: 12,
    stock: 14,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1767785829347-cc13bd969514?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Royal Teal Maroon", "Imperial Midnight Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    specifications: [
      { name: "Material", value: "Premium Art Silk Blend" },
      { name: "Embroidery Yoke", value: "Gota Patti and Zardozi threadwork" },
      { name: "Gera Flare", value: "3-meter full round umbrella circle flare" }
    ]
  },
  {
    title: "Hooded Sweatshirt",
    brand: "Puma",
    category: "Women's Clothing",
    description: "Cozy vibes only. Heavy fleece hooded sweatshirt featuring a metallic silver brand logo on a comfortable boxy relaxed template.",
    price: 2499,
    discount: 15,
    stock: 22,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Soft Lavender", "Stealth Charcoal Carbon"],
    sizes: ["XS", "S", "M", "L"],
    specifications: [
      { name: "Material", value: "75% Cotton, 25% Polyester Fleece" },
      { name: "Fit Profile", value: "Relaxed Boxy Fit" },
      { name: "Rib Finish", value: "Ribbed heavy-gauge hem and sleeve cuffs" }
    ]
  },
  {
    title: "Oversized Hoodie",
    brand: "H&M",
    category: "Women's Clothing",
    description: "An incredibly soft casual hoodie styled with extra room, loopback brushed cotton linings, and drop shoulder styling.",
    price: 2299,
    discount: 10,
    stock: 25,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1578172745579-92c2de4f383a?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Matcha Pale Green", "Off-White Cloud"],
    sizes: ["S", "M", "L"],
    specifications: [
      { name: "Material Blend", value: "80% Organic Cotton, 20% Recycled Fleece" },
      { name: "Style Detail", value: "Kangaroo pockets, double-layer drawstring hood" },
      { name: "Sleeve Cut", value: "Drop Shoulder Relaxed" }
    ]
  },
  {
    title: "Denim Jacket",
    brand: "Levi's",
    category: "Women's Clothing",
    description: "The classic trucker jacket shape. Authentic heavy washed denim styled with branded metal shanks and utility chest pockets.",
    price: 3999,
    discount: 8,
    stock: 18,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1485811661309-ab85183a729c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Vintage Light Wash", "Standard Medium Indigo"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material", value: "100% Durable Cotton Denim" },
      { name: "Metalwork", value: "Signature embossed metal button locks" },
      { name: "Pockets", value: "Dual flap button chest pockets, two hand pockets" }
    ]
  },
  {
    title: "Casual Bomber Jacket",
    brand: "ONLY",
    category: "Women's Clothing",
    description: "Add active styling to your winter walks. Lightweight performance satin bomber featuring ribbed collars and high-finish metal zip sliders.",
    price: 4499,
    discount: 15,
    stock: 15,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1637036862229-3408b544d48c?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Bronze Brown Gold", "Triple Black Satin"],
    sizes: ["S", "M", "L", "XL"],
    specifications: [
      { name: "Material Shell", value: "100% Water resistant structured polyester" },
      { name: "Neck Trim", value: "Stretch rib collar band" },
      { name: "Pockets Layout", value: "Secure slant welt pockets at front" }
    ]
  }
];

const SHOES_DATA = [
  {
    title: "Air Max 2025 Running Shoes",
    brand: "Nike",
    category: "Shoes",
    description: "Step into the future of running with supreme comfort and bouncy air max cushioning underfoot. Engineered mesh upper keeps your feet ventilated and stable during any pursuit.",
    price: 7999,
    discount: 10,
    stock: 35,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61Xg4CYYRML._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Red/Black", "Stealth Grey/Volt"],
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      { name: "Cushioning", value: "Max Air heel cushioning unit" },
      { name: "Upper Material", value: "Breathable engineered knit mesh" },
      { name: "Outsole", value: "Durable waffle traction rubber" }
    ]
  },
  {
    title: "Revolution 8 Running Shoes",
    brand: "Nike",
    category: "Shoes",
    description: "Versatile, supportive, and designed with responsive foam mid-soles for beginners and professional runners alike. Offers smooth rides and secure lace stabilization.",
    price: 4999,
    discount: 15,
    stock: 42,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61GU7tlgY1L._AC_SX569_.jpg"],
    colors: ["Black/White Accent", "Total Orange/Navy"],
    sizes: ["6", "7", "8", "9", "10"],
    specifications: [
      { name: "Weight", value: "280g (Lightweight)" },
      { name: "Midsole", value: "Response foam injection padding" },
      { name: "Lining", value: "Soft padded ankle collar" }
    ]
  },
  {
    title: "Court Vision Low Sneakers",
    brand: "Nike",
    category: "Shoes",
    description: "Retro 1980s basketball-inspired court sneakers updated with sleek modern leather layers. Combines everyday styling with standard traction rubber cups.",
    price: 5499,
    discount: 8,
    stock: 30,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/613l8ZN8TfL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Triple White", "White/Royal Blue Swoosh"],
    sizes: ["7", "8", "9", "10"],
    specifications: [
      { name: "Material", value: "Natural and Synthetic Leather" },
      { name: "Outsole Type", value: "Stitched cupsole rubber grip" },
      { name: "Toe Detail", value: "Perforated toe box for aeration" }
    ]
  },
  {
    title: "Ultraboost Light Running Shoes",
    brand: "Adidas",
    category: "Shoes",
    description: "Experience incredible energy returns with the lightest Ultraboost technology model ever created. Features full Primeknit sock-like collars and a torsion stabilization rod.",
    price: 12999,
    discount: 12,
    stock: 25,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/415IaPib1NL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Cloud White/Silver Met", "Core Black/Carbon"],
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      { name: "Cushioning Tech", value: "Light BOOST foam capsule matrix" },
      { name: "Eco Friendly", value: "Contains 50% Parley Ocean Plastic yarn" },
      { name: "Outsole", value: "Continental™ Better Rubber sole grip" }
    ]
  },
  {
    title: "Runfalcon 5 Running Shoes",
    brand: "Adidas",
    category: "Shoes",
    description: "Comfortable, versatile, and highly supportive daily trainer. Features Cloudfoam midsoles for soft-landing cushioning and non-marking high endurance rubber soles.",
    price: 4499,
    discount: 5,
    stock: 38,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/61BjunbiSVL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Navy Blue/White", "All Charcoal Black"],
    sizes: ["6", "7", "8", "9", "10"],
    specifications: [
      { name: "Midsole Type", value: "EVA Cloudfoam cushioning" },
      { name: "Lining Material", value: "Breathable textile structure" },
      { name: "Construction", value: "Suppressed heel counter support" }
    ]
  },
  {
    title: "Grand Court Lifestyle Sneakers",
    brand: "Adidas",
    category: "Shoes",
    description: "Elevate your street styling with these tennis-court inspired classic sneakers. Features the distinct bold 3-Stripes and Cloudfoam Comfort sockliners.",
    price: 5999,
    discount: 10,
    stock: 28,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61Kto09+X4L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Core Black/White Stripes", "White/Green Heel Flag"],
    sizes: ["7", "8", "9", "10"],
    specifications: [
      { name: "Upper Material", value: "High-grade Premium Synthetic Leather" },
      { name: "Insole", value: "Memory Foam Cloudfoam Comfort" },
      { name: "Lacing", value: "Classic full flat cotton lace setup" }
    ]
  },
  {
    title: "RS-X Heritage Sneakers",
    brand: "Puma",
    category: "Shoes",
    description: "The classic extreme-design retro running system is back with a bang. Bold panel layers, dynamic material blends, and an oversized sporty profile.",
    price: 6499,
    discount: 15,
    stock: 20,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71KpDgQQB0L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Multicolor Retro Pastel", "Triple Dark Carbon Grey"],
    sizes: ["7", "8", "9", "10"],
    specifications: [
      { name: "Cushioning", value: "Puma Polyurethane Running System" },
      { name: "Midsole", value: "Molded chunky PU construction" },
      { name: "Upper Layers", value: "Suede, nubuck, and mesh hybrid panels" }
    ]
  },
  {
    title: "Velocity Nitro 4 Running Shoes",
    brand: "Puma",
    category: "Shoes",
    description: "Advanced NITRO foam injection ensures incredible responsiveness and extremely lightweight properties. Perfect for long-distance marathon targets and everyday training.",
    price: 8999,
    discount: 20,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/51tbufF2ZlL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Fizzy Lime/Orange", "Total Jet Black/Reflective"],
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      { name: "Foam Tech", value: "NITRO premium gas-injected foam" },
      { name: "Sole Tech", value: "PUMAGRIP high endurance rubber traction" },
      { name: "Stability", value: "Heel spoiler stabilizer plastic clip" }
    ]
  },
  {
    title: "Smash V3 Casual Sneakers",
    brand: "Puma",
    category: "Shoes",
    description: "An absolute essential court sneaker designed with suede-comfy uppers and standard low-profile rubber cups. Durable and incredibly clean styling.",
    price: 3999,
    discount: 5,
    stock: 35,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/41NtbP4mYoL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Rich Olive Suede", "Royal Navy Suede/White Formstrip"],
    sizes: ["6", "7", "8", "9", "10"],
    specifications: [
      { name: "Upper", value: "100% Genuine Soft Suede" },
      { name: "Sockliner", value: "SoftFoam+ optimal comfort padded liner" },
      { name: "Arch Support", value: "Standard flat court layout" }
    ]
  },
  {
    title: "GEL-Kayano 32 Running Shoes",
    brand: "ASICS",
    category: "Shoes",
    description: "The final benchmark in running stability. Features 4D GUIDANCE system technology and premium PureGEL insertions beneath the heel for soft-impact cushioning.",
    price: 13999,
    discount: 8,
    stock: 15,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/61W1er02mFL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Hazard Yellow/Classic Black", "Glacier Blue/Navy"],
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      { name: "Stability Tech", value: "Intelligent 4D GUIDANCE system" },
      { name: "Cushioning", value: "FF BLAST™ PLUS ECO and PureGEL" },
      { name: "Orthotic Insole", value: "Premium OrthoLite™ X-55 socket" }
    ]
  },
  {
    title: "GEL-Excite 10 Running Shoes",
    brand: "ASICS",
    category: "Shoes",
    description: "A comfortable daily silhouette packed with energetic cushioning. Features structured mesh, AMPLIFOAM cushioning, and rearfoot GEL technology.",
    price: 5999,
    discount: 10,
    stock: 32,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61VIhnWLueL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Grey/Safety Yellow", "Deep Ocean Blue"],
    sizes: ["7", "8", "9", "10"],
    specifications: [
      { name: "Midsole Tech", value: "AMPLIFOAM active cushioning stack" },
      { name: "GEL Insert", value: "Heel system Rearfoot GEL padding" },
      { name: "Upper Detail", value: "Engineered jacquard weave mesh" }
    ]
  },
  {
    title: "Jolt 5 Training Shoes",
    brand: "ASICS",
    category: "Shoes",
    description: "A highly resilient training and running companion. Strengthened synthetic leather panelling is integrated with lightweight breathable mesh for durable wear.",
    price: 4499,
    discount: 5,
    stock: 40,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/61ohgEALZ3L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Matte Jet Black", "Classic White/Silver Met"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    specifications: [
      { name: "Outer Material", value: "Synthetic overlay and open ventilation mesh" },
      { name: "Outsole Material", value: "Molded hard-wearing solid rubber" },
      { name: "Toe Protector", value: "Stitched toe cap reinforcement" }
    ]
  },
  {
    title: "Fresh Foam X 1080 v14",
    brand: "New Balance",
    category: "Shoes",
    description: "The supreme execution of plush cushioning. Features full-length Fresh Foam X, providing transition support, soft drapes, and an ultra-comfortable knit upper.",
    price: 11999,
    discount: 15,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/51OLS5S9BPL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Steel Grey/Neon Orange", "Obsidian Dark Navy"],
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      { name: "Midsole Tech", value: "Laser-engraved Fresh Foam X cushioning" },
      { name: "Upper Material", value: "Premium hypoknit sock expansion weave" },
      { name: "Weight", value: "292g (Comfort Plush)" }
    ]
  },
  {
    title: "574 Classic Sneakers",
    brand: "New Balance",
    category: "Shoes",
    description: "The time-tested icon of street lifestyle. Styled with luxury genuine suede and mesh layers and built with ENCAP midsole support.",
    price: 7499,
    discount: 10,
    stock: 22,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61m7fnIF6mL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Vintage Khaki Tan", "Classic Burgundy Red"],
    sizes: ["7", "8", "9", "10"],
    specifications: [
      { name: "Upper Structure", value: "Plush Calf Suede and Mesh paneling" },
      { name: "Core Support", value: "ENCAP lightweight polyurethane rim core" },
      { name: "Heel Support", value: "Stiff external TPU heel stabilizer clip" }
    ]
  },
  {
    title: "Chuck Taylor All Star High Top",
    brand: "Converse",
    category: "Shoes",
    description: "The original undisputed high-top icon. Features tough canvas construction, standard medial eyelets, and the historic ankle seal logo mark.",
    price: 4999,
    discount: 5,
    stock: 35,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71BlHV3zfYL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Vintage Off-Black", "Optic White Canvas"],
    sizes: ["6", "7", "8", "9", "10", "11"],
    specifications: [
      { name: "Upper Material", value: "12oz Premium Durable Canvas" },
      { name: "Sole Core", value: "Vulcanized vulcan flat rubber cups" },
      { name: "Branding", value: "All Star leather ankle circle patch" }
    ]
  },
  {
    title: "Chuck 70 Vintage Canvas",
    brand: "Converse",
    category: "Shoes",
    description: "Constructed with premium heavyweight 14oz organic canvas, varnished vintage egret sidewalls, and orthotic cushioning for modern lifestyle ease.",
    price: 6999,
    discount: 12,
    stock: 15,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/717lS5IAi4L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Parchment Cream Egret", "Classic Black Canvas"],
    sizes: ["7", "8", "9", "10"],
    specifications: [
      { name: "Canvas Grade", value: "14oz organic canvas premium weight" },
      { name: "Padded Comfort", value: "OrthoLite® dense foam sock liners" },
      { name: "Detailed Stitching", value: "Symmetric reinforced wing tongue stitching" }
    ]
  },
  {
    title: "Classic Leather Sneakers",
    brand: "Reebok",
    category: "Shoes",
    description: "Simple, elegant, and timeless since 1983. Soft premium leather styling is integrated with iconic Union Jack flag branding windows.",
    price: 5499,
    discount: 10,
    stock: 25,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51y0N3+VndL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Bright Chalk White", "Classic Deep Black"],
    sizes: ["7", "8", "9", "10"],
    specifications: [
      { name: "Upper Type", value: "100% Ultra-Soft Garment Leather" },
      { name: "Midsole Tech", value: "Die-Cut lightweight EVA foam cushioning" },
      { name: "Outsole Type", value: "High abrasion non-marking rubber" }
    ]
  },
  {
    title: "Zig Dynamica 5 Running Shoes",
    brand: "Reebok",
    category: "Shoes",
    description: "The future is progressive. Features a standout zigzag midsole designed to disperse energy impact, combined with extremely clean mesh panel designs.",
    price: 6499,
    discount: 15,
    stock: 18,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/51dC5EJUeRL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Core Coral Pink/Grey", "Triple Carbon Black"],
    sizes: ["6", "7", "8", "9", "10"],
    specifications: [
      { name: "Sole Tech", value: "Zig Energy return shell outsole" },
      { name: "Upper Construction", value: "Highly breathable mesh panels" },
      { name: "Pull Tab", value: "Heel tab for easy pull-on" }
    ]
  },
  {
    title: "Leather Chelsea Boots",
    brand: "Woodland",
    category: "Shoes",
    description: "Rugged and tough. Handcrafted genuine nubuck leather Chelsea boots featuring strong pull elastic wedges and deep rugged outdoor tracks.",
    price: 4999,
    discount: 5,
    stock: 14,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/31MslQpWGoL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Brown Suede", "Black Nubuck Leather"],
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      { name: "Upper Grade", value: "Genuine Premium Full-Grain Leather" },
      { name: "Outsole", value: "Anti-slip oil-resistant heavy rubber logs" },
      { name: "Lining Type", value: "Comfort sweat-absorbent soft leather padding" }
    ]
  },
  {
    title: "Trekking Outdoor Shoes",
    brand: "Woodland",
    category: "Shoes",
    description: "Durable, protective, and fully weather-treated. Your trusty companion for mountain treks, loose gravel, and unpredictable weather environments.",
    price: 5999,
    discount: 10,
    stock: 22,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/81jTbBLCnJL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Tactical Forest Tan", "Military Khaki Green"],
    sizes: ["7", "8", "9", "10", "11"],
    specifications: [
      { name: "Material treatment", value: "Water-repellent active leather treatment" },
      { name: "Lacing locks", value: "Metallic rustproof speed lace eyelets" },
      { name: "Inner Comfort", value: "Double mesh shock dampening support" }
    ]
  }
];

const FURNITURE_DATA = [
  {
    title: "Modern Fabric 3-Seater Sofa",
    brand: "Urban Ladder",
    category: "Furniture",
    description: "Relax in style and premium comfort. Built with dense foam cushions, soft linen fabric upholstery, and a robust solid-wood robust inner frame.",
    price: 32999,
    discount: 10,
    stock: 15,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=1109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Slate Grey", "Midnight Blue"],
    sizes: ["Regular 3-Seater"],
    specifications: [
      { name: "Material", value: "Premium Linen Fabric" },
      { name: "Frame", value: "Sal Wood internal structure" },
      { name: "Seating Capacity", value: "3 Persons" }
    ]
  },
  {
    title: "Premium L-Shaped Corner Sofa",
    brand: "Pepperfry",
    category: "Furniture",
    description: "Maximize your living room potential. Modular L-shaped layout with extra plush cushions and contemporary styling elements.",
    price: 49999,
    discount: 15,
    stock: 10,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1664711942326-2c3351e215e6?q=80&w=1117&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Ash Grey", "Chocolate Brown"],
    sizes: ["L-Shape Left Aligned", "L-Shape Right Aligned"],
    specifications: [
      { name: "Configuration", value: "Modular Corner L-Shape" },
      { name: "Upholstery", value: "Breathable textured chenille fabric" },
      { name: "Suspension", value: "Sinuous pocket-spring coils" }
    ]
  },
  {
    title: "Velvet Recliner Sofa Set",
    brand: "Home Centre",
    category: "Furniture",
    description: "The pinnacle of domestic leisure. Ultra plush velvet seating with manual or electric recline configurations on both ends of the sofa set.",
    price: 59999,
    discount: 12,
    stock: 8,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1558211583-d26f610c1eb1?q=80&w=1106&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Grey", "Midnight Navy Velvet"],
    sizes: ["3-Seater Recliner Set"],
    specifications: [
      { name: "Material", value: "Premium Velvet Fabric" },
      { name: "Recline Option", value: "Multi-angle locking mechanism" },
      { name: "Foam Density", value: "32 Density High Resilience" }
    ]
  },
  {
    title: "Solid Wood Coffee Table",
    brand: "WoodenStreet",
    category: "Furniture",
    description: "A gorgeous handmade solid wood coffee table highlighting the natural grains of premium Sheesham wood. Built to last generations.",
    price: 8999,
    discount: 8,
    stock: 25,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1692262089751-7e26b69ad8d1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Honey Finish Sheesham", "Walnut Finish Sheesham"],
    sizes: ["Standard Rectangular"],
    specifications: [
      { name: "Wood Style", value: "100% Genuine Sheesham Wood" },
      { name: "Craftsmanship", value: "Handmade joinery design" },
      { name: "Storage", value: "Underneath slatted storage shelf" }
    ]
  },
  {
    title: "Contemporary Center Table",
    brand: "IKEA",
    category: "Furniture",
    description: "Minimalist Scandinavian design center table with nested compartments. Lightweight, sleek, and highly functional layout.",
    price: 6999,
    discount: 10,
    stock: 30,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Birch Veneer", "White Matte"],
    sizes: ["Square Nested"],
    specifications: [
      { name: "Primary Material", value: "Eco-friendly engineered particle board" },
      { name: "Legs", value: "Steel bars with epoxy powder coat" },
      { name: "Features", value: "Integrated lower newspaper compartment" }
    ]
  },
  {
    title: "Walnut Finish TV Unit",
    brand: "Urban Ladder",
    category: "Furniture",
    description: "A sleek and sturdy media console with a deep walnut finish. Offers ample storage and targeted cable management routing holes at the back panel.",
    price: 14999,
    discount: 15,
    stock: 18,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Deep Walnut", "Natural Teak"],
    sizes: ["Up to 55-inch Screen size", "Up to 65-inch Screen size"],
    specifications: [
      { name: "Material", value: "Premium Engineered Wood with Veneer" },
      { name: "Storage Structure", value: "2 Open media niches + 2 closed drawers" },
      { name: "Hardware Details", value: "Soft-close hydraulic door hinges" }
    ]
  },
  {
    title: "Modern Entertainment Unit",
    brand: "Pepperfry",
    category: "Furniture",
    description: "Wall-mounted modern entertainment console, featuring glossy push-to-open cabinets, LED strip integration rails, and geometric aesthetics.",
    price: 18999,
    discount: 12,
    stock: 14,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["High Gloss White/Oak", "Slate/Black Metallic"],
    sizes: ["Full Floating Format"],
    specifications: [
      { name: "Type", value: "Floating Wall-Mounted Console" },
      { name: "Cabinet Type", value: "Pressure rebound push-open system" },
      { name: "LED integration", value: "Pre-routed channels for LED strip lights" }
    ]
  },
  {
    title: "Queen Size Wooden Bed",
    brand: "WoodenStreet",
    category: "Furniture",
    description: "A luxury solid wood queen bed featuring a beautifully crafted high headboard. Offers stability and supports comfortable sleeping posture directly on mattress boards.",
    price: 29999,
    discount: 10,
    stock: 12,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1688384452844-8364c3e2fc28?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Warm Honey", "Rich Mahogany"],
    sizes: ["Queen Size"],
    specifications: [
      { name: "Wood Material", value: "Top Grade Premium Sheesham Wood" },
      { name: "Bed Structure", value: "Heavy solid-wood foundational slats" },
      { name: "Assembly", value: "Robust metal-to-metal dowel locks" }
    ]
  },
  {
    title: "King Size Storage Bed",
    brand: "Home Centre",
    category: "Furniture",
    description: "Expand your space with this magnificent king-size bed. Seamless integration of deep hydraulic storage lifters for simple bedding organization.",
    price: 39999,
    discount: 15,
    stock: 10,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1615651586679-c40132c57ba3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Teak Wood", "Wenge Dark Charcoal"],
    sizes: ["King Size"],
    specifications: [
      { name: "Storage Style", value: "Twin Gas-lift hydraulic cylinder storage doors" },
      { name: "Headboard Design", value: "Thick cushioned headrest wrap" },
      { name: "Frame Type", value: "Reinforced high gauge MS metal frame grid" }
    ]
  },
  {
    title: "Upholstered Queen Bed",
    brand: "IKEA",
    category: "Furniture",
    description: "Soft and cozy head-to-toe. Wrapped entirely in woven textured grey fabric, creating a warm and welcoming bedroom atmosphere.",
    price: 34999,
    discount: 10,
    stock: 15,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1505692952047-1a78307da8f2?q=80&w=1296&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Woven Light Grey", "Woven Charcoal Black"],
    sizes: ["Queen Size Standard"],
    specifications: [
      { name: "Slipcover Fabric", value: "Flame retardant breathable woven cotton blend" },
      { name: "Feet Structure", value: "Solid structural oak wooden leg stands" },
      { name: "Center support", value: "SKORVA steel midbeam stabilizer" }
    ]
  },
  {
    title: "4-Door Wardrobe",
    brand: "Godrej Interio",
    category: "Furniture",
    description: "Heavy-gauge steel security meet contemporary layout. Built with massive hanging space, internal premium drawer lockers, and a full length dressing mirror.",
    price: 27999,
    discount: 8,
    stock: 20,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1672137233327-37b0c1049e77?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Deep Royal Burgundy", "Gloss Charcoal Grey"],
    sizes: ["H: 78\" X W: 60\" X D: 22\""],
    specifications: [
      { name: "Material Grade", value: "High-Tensile Cold-Rolled Carbon Steel sheets" },
      { name: "Locking mechanism", value: "Ultra-secure lock key with high security standard" },
      { name: "Dressing Mirror", value: "Double density polished full-length mirror" }
    ]
  },
  {
    title: "Sliding Door Wardrobe",
    brand: "Urban Ladder",
    category: "Furniture",
    description: "Compact styling with high-volume sliding mechanisms. Perfect for smaller modern bedrooms requiring zero swing clearance to access clothes.",
    price: 35999,
    discount: 12,
    stock: 12,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1722349674028-a148f4364e43?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Teak Veneer & Matte White", "Classic Walnut Finish"],
    sizes: ["2-Sliding Door Standard"],
    specifications: [
      { name: "Track Runners", value: "Heavy-duty anodized aluminum top tracks" },
      { name: "Primary Board", value: "BWP Grade block boards with veneer" },
      { name: "Lockers", value: "2 internal sliding drawers with manual lock sets" }
    ]
  },
  {
    title: "Executive Office Desk",
    brand: "IKEA",
    category: "Furniture",
    description: "Spacious desk panel with solid metal frames. Provides clean cable routing spaces underneath and adjustable heights for personalized work ergonomics.",
    price: 12999,
    discount: 10,
    stock: 22,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1767786330387-5cef0327b6c1?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Oak Veneer Finish with White legs", "Jet Black Panel with Black legs"],
    sizes: ["140cm x 80cm Desktop panel"],
    specifications: [
      { name: "Frame style", value: "Triangulated powder-coated steel tubes" },
      { name: "Cable Router", value: "Elastic mesh cable pocket underneath desk" },
      { name: "Height adjustments", value: "Threaded manual adjustment screws (65-85cm)" }
    ]
  },
  {
    title: "Ergonomic Study Table",
    brand: "WoodenStreet",
    category: "Furniture",
    description: "Handcrafted study companion crafted with high-finish Sheesham wood. Features multiple storage drawers, a dedicated study ledge, and spacious monitor space.",
    price: 8499,
    discount: 5,
    stock: 25,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1762341115993-8b949d576a10?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Honey Saffron Sheesham", "Teak Sheesham Wood"],
    sizes: ["Medium Study Table Compact"],
    specifications: [
      { name: "Wood Material", value: "Premium Grade Sheesham Hardwood" },
      { name: "Drawers Layout", value: "3 Stacked drawer boxes + 1 open storage cabinet" },
      { name: "Hardware Specs", value: "Stainless steel flush handles and smooth tracks" }
    ]
  },
  {
    title: "Adjustable Computer Desk",
    brand: "Green Soul",
    category: "Furniture",
    description: "High-grade motor active height-adjustable desk. Seamless transit between sitting and standing posturing, featuring custom memory keys.",
    price: 15999,
    discount: 15,
    stock: 14,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Carbon Fiber Black Deck", "Pure Walnut Wood Deck"],
    sizes: ["120cm Width Active Panel"],
    specifications: [
      { name: "Motor Type", value: "Heavy-torque silent steel electric motor" },
      { name: "Controller panel", value: "Digital screen panel with 3 memory slots" },
      { name: "Weight capacity", value: "Supports up to 80 kg" }
    ]
  },
  {
    title: "Ergonomic Mesh Office Chair",
    brand: "Green Soul",
    category: "Furniture",
    description: "Engineered to keep you cool and pain-free through long work hours. High-tension mesh back layout with adjustable waist lumbar panels.",
    price: 9999,
    discount: 10,
    stock: 28,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Coal Black Mesh", "Bold Slate Coral Accent"],
    sizes: ["Fully Adjustable Frame"],
    specifications: [
      { name: "Back Styling", value: "Korean high-tension nylon mesh weave" },
      { name: "Armrest Style", value: "3D Multi-directional padded armrests" },
      { name: "Gas Lift Class", value: "Class 4 heavy-duty commercial hydraulic lifter" }
    ]
  },
  {
    title: "Executive Leather Office Chair",
    brand: "Godrej Interio",
    category: "Furniture",
    description: "Command complete comfort. High-density leatherette padding is integrated with a sync-tilt structural recliner and double padded wings.",
    price: 14999,
    discount: 12,
    stock: 15,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1579487785947-84da60b19c09?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Obsidian Premium Black", "Royal Tan Brown Leatherette"],
    sizes: ["Executive High Back size"],
    specifications: [
      { name: "Outer Material", value: "Tear-resistant premium eco-leatherette" },
      { name: "Tilt Control", value: "135-degree Sync-Tilt locking plate" },
      { name: "Wheel Base", value: "Heavy-duty polished aluminum star base + nylon casters" }
    ]
  },
  {
    title: "Dining Table Set (4 Seater)",
    brand: "Home Centre",
    category: "Furniture",
    description: "Perfect centerpiece for cozy family dining. Includes one solid wood table paired with four high-comfort padded companion chairs.",
    price: 21999,
    discount: 10,
    stock: 18,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1758977404683-d04c315a005b?q=80&w=818&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Natural Acacia Brown", "Mahogany Dark Brown"],
    sizes: ["4-Seater Table Setup"],
    specifications: [
      { name: "Wood Grade", value: "Solid Rubberwood and Medium Density Fiberboards" },
      { name: "Upholstery", value: "Spill-resistant easy-clean woven linen deck" },
      { name: "Table Dimensions", value: "L: 110cm x W: 70cm x H: 75cm" }
    ]
  },
  {
    title: "Dining Table Set (6 Seater)",
    brand: "Urban Ladder",
    category: "Furniture",
    description: "Premium large-format dining set, boasting Sheesham structural tables, four high-back comfort chairs, and a sleek modern bench seat.",
    price: 34999,
    discount: 15,
    stock: 12,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1776313756912-8456579ea487?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Royal Walnut Finish", "Honey Saffron Finish"],
    sizes: ["6-Seater complete set"],
    specifications: [
      { name: "Table Material", value: "100% Solid Indian Sheesham Hardwood" },
      { name: "Set Configuration", value: "1 Dining Table + 4 Chairs + 1 Long Bench" },
      { name: "Assembly Locks", value: "Precision heavy structural steel bolt locks" }
    ]
  },
  {
    title: "Bookshelf Storage Cabinet",
    brand: "IKEA",
    category: "Furniture",
    description: "Classic Scandinavian vertical display bookshelf. Offers versatile adjustable wood shelves and clean backing board inserts.",
    price: 7999,
    discount: 8,
    stock: 25,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1708161885729-63faff807840?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["White Wood grain", "Dark Oak Brown"],
    sizes: ["H: 180cm x W: 80cm x D: 30cm"],
    specifications: [
      { name: "Primary Board", value: "Composed density particle wood panels" },
      { name: "Acre load capacity", value: "Supports up to 30 kg per shelf board" },
      { name: "Security Spec", value: "Wall-mount anchoring straps included" }
    ]
  },
  {
    title: "Wooden Display Shelf",
    brand: "WoodenStreet",
    category: "Furniture",
    description: "An elegant asymmetrical geometric display shelf designed with high quality solid wood. Ideal for books, awards, and potted plants.",
    price: 11999,
    discount: 10,
    stock: 15,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1576069353653-21a2b29e3bc7?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Honey Saffron Teak Sheesham", "Classic Walnut Saffron Sheesham"],
    sizes: ["Asymmetrical Multi-Tier"],
    specifications: [
      { name: "Wood Grade", value: "Premium Sheesham Wood" },
      { name: "Shelves Count", value: "5 storage tiers" },
      { name: "Mount Type", value: "Freestanding floor unit" }
    ]
  },
  {
    title: "Accent Lounge Chair",
    brand: "Pepperfry",
    category: "Furniture",
    description: "Relax, read, or sip your morning coffee. Mid-century modern single lounge accent chair featuring curved wingback panels and retro tapered wooden legs.",
    price: 13999,
    discount: 10,
    stock: 12,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Mustard Yellow Fabric", "Teal Green Velvet"],
    sizes: ["Single Seater Lounge size"],
    specifications: [
      { name: "Legs type", value: "Tapered solid rubberwood legs" },
      { name: "Upholstery fabric", value: "High-grade textured weave linen" },
      { name: "Dampening", value: "High-density polyurethane webbing foam" }
    ]
  },
  {
    title: "Wooden Shoe Rack Cabinet",
    brand: "Home Centre",
    category: "Furniture",
    description: "Keep your entryway pristine. Multi-shelf wooden shoe cabinet featuring ventilated louvered double doors and a spacious top console drawer.",
    price: 6499,
    discount: 5,
    stock: 18,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1532600139577-c154d1c81afa?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Warm Teak finish", "Wenge Dark Mahogany"],
    sizes: ["Holds up to 18 pairs"],
    specifications: [
      { name: "Cabinet Structure", value: "4 internal shelves + 1 top storage drawer" },
      { name: "Ventilation Door", value: "Slatted / Louvered doors for airflow" },
      { name: "Weight support", value: "Sturdy top holds key trays and decorations" }
    ]
  },
  {
    title: "Bedside Table with Drawer",
    brand: "IKEA",
    category: "Furniture",
    description: "Compact and practical bedroom essential. Smooth pull-out drawer with a bottom wire shelf to keep your charging utilities and novels neatly organized.",
    price: 4999,
    discount: 10,
    stock: 25,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1704428382616-d8c65fdd76f4?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Off-White Satin", "Varnished Honey Birch"],
    sizes: ["Standard Compact Bedside"],
    specifications: [
      { name: "Drawers count", value: "1 drawer with built-in pull stopper" },
      { name: "Frame Material", value: "Sturdy MDF wood panels paired with steel columns" },
      { name: "Utility", value: "Perfect side table height for bed matching" }
    ]
  }
];

const BOOKS_DATA = [
  {
    title: "Atomic Habits",
    brand: "James Clear",
    category: "Books",
    description: "An incredibly practical guide on how to create good habits, break bad ones, and get 1% better every day. Learn the system that makes behavior change easy and automatic, backed by proven scientific principles.",
    price: 599,
    discount: 10,
    stock: 15,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1598301257942-e6bde1d2149b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: [],
    sizes: ["Paperback", "Kindle Edition", "Hardcover"],
    specifications: [
      { name: "Author", value: "James Clear" },
      { name: "Genre", value: "Self-Help / Personal Development" },
      { name: "Pages", value: "320" },
      { name: "Publisher", value: "Penguin Random House" }
    ]
  },
  {
    title: "The Psychology of Money",
    brand: "Morgan Housel",
    category: "Books",
    description: "Timeless lessons on wealth, greed, and happiness. Doing well with money isn’t necessarily about what you know. It’s about how you behave. And behavior is hard to teach, even to really smart people.",
    price: 499,
    discount: 12,
    stock: 24,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: [],
    sizes: ["Paperback", "Hardcover"],
    specifications: [
      { name: "Author", value: "Morgan Housel" },
      { name: "Genre", value: "Finance & Investing" },
      { name: "Pages", value: "256" },
      { name: "Publisher", value: "Harriman House" }
    ]
  },
  {
    title: "Rich Dad Poor Dad",
    brand: "Robert Kiyosaki",
    category: "Books",
    description: "The classic personal finance book that explodes the myth that you need to earn a high income to be rich and explains the difference between working for money and having your money work for you.",
    price: 399,
    discount: 8,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71HJj3XmheL._SY466_.jpg"],
    colors: [],
    sizes: ["Paperback", "Audiobook"],
    specifications: [
      { name: "Author", value: "Robert Kiyosaki" },
      { name: "Genre", value: "Finance / Wealth Management" },
      { name: "Pages", value: "336" },
      { name: "Publisher", value: "Plata Publishing" }
    ]
  },
  {
    title: "Think and Grow Rich",
    brand: "Napoleon Hill",
    category: "Books",
    description: "One of the most famous personal development books of all time, sharing the formula for wealth and success based on interviews with over 500 of the most successful individuals of his generation.",
    price: 349,
    discount: 5,
    stock: 20,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1632847933603-677959bb8ccb?q=80&w=1333&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: [],
    sizes: ["Paperback"],
    specifications: [
      { name: "Author", value: "Napoleon Hill" },
      { name: "Genre", value: "Self-Help / Success" },
      { name: "Pages", value: "384" },
      { name: "Publisher", value: "The Ralston Society" }
    ]
  },
  {
    title: "The 7 Habits of Highly Effective People",
    brand: "Stephen R. Covey",
    category: "Books",
    description: "A beloved classic that outlines a holistic, integrated, principle-centered approach for solving personal and professional problems based on timeless habits of effectiveness.",
    price: 699,
    discount: 15,
    stock: 12,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1605444610001-15c877be632a?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: [],
    sizes: ["Paperback", "Hardcover"],
    specifications: [
      { name: "Author", value: "Stephen R. Covey" },
      { name: "Genre", value: "Self-Help / Leadership" },
      { name: "Pages", value: "432" },
      { name: "Publisher", value: "Simon & Schuster" }
    ]
  },
  {
    title: "Deep Work",
    brand: "Cal Newport",
    category: "Books",
    description: "Rules for focused success in a distracted world. Learn to cultivate the rare and highly valuable cognitive ability to focus without distraction on cognitively demanding tasks.",
    price: 549,
    discount: 10,
    stock: 18,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/31O7mZRFFGL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback", "Kindle Edition"],
    specifications: [
      { name: "Author", value: "Cal Newport" },
      { name: "Genre", value: "Productivity / Work Ethic" },
      { name: "Pages", value: "304" },
      { name: "Publisher", value: "Grand Central Publishing" }
    ]
  },
  {
    title: "Ikigai",
    brand: "Héctor García & Francesc Miralles",
    category: "Books",
    description: "Discover the Japanese secret to a long and happy life. Learn how finding your purpose or 'reason for being' leads to longevity, health, and satisfying daily achievements.",
    price: 399,
    discount: 10,
    stock: 25,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/81l3rZK4lnL._SY425_.jpg"],
    colors: [],
    sizes: ["Hardcover", "Paperback"],
    specifications: [
      { name: "Author", value: "Héctor García & Francesc Miralles" },
      { name: "Genre", value: "Lifestyle / Mindfulness" },
      { name: "Pages", value: "208" },
      { name: "Publisher", value: "Penguin Books" }
    ]
  },
  {
    title: "The Power of Your Subconscious Mind",
    brand: "Joseph Murphy",
    category: "Books",
    description: "One of the most powerful self-development guidelines ever written. Understand how changing your mental habits and subconscious thoughts can bring wealth, healing, and success.",
    price: 299,
    discount: 5,
    stock: 35,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1735829895625-d3130453596a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: [],
    sizes: ["Paperback"],
    specifications: [
      { name: "Author", value: "Joseph Murphy" },
      { name: "Genre", value: "Self-Help / Spirituality" },
      { name: "Pages", value: "312" },
      { name: "Publisher", value: "Prentice Hall" }
    ]
  },
  {
    title: "Can't Hurt Me",
    brand: "David Goggins",
    category: "Books",
    description: "The extraordinary life story of David Goggins, the only man in history to complete elite training as a Navy SEAL, Army Ranger, and Air Force Tactical Air Controller, revealing how to master your mind.",
    price: 799,
    discount: 12,
    stock: 15,
    rating: 4.9,
    images: ["https://mankshop.in/wp-content/uploads/2025/10/1-5.png"],
    colors: [],
    sizes: ["Paperback", "Hardcover"],
    specifications: [
      { name: "Author", value: "David Goggins" },
      { name: "Genre", value: "Biography / Inspiration" },
      { name: "Pages", value: "364" },
      { name: "Publisher", value: "Lioncrest Publishing" }
    ]
  },
  {
    title: "Do Epic Shit",
    brand: "Ankur Warikoo",
    category: "Books",
    description: "An collection of thoughts and lessons on failure, relationship management, money control, and life habits, written in a beautiful accessible journal-like format.",
    price: 399,
    discount: 8,
    stock: 22,
    rating: 4.3,
    images: ["https://images.unsplash.com/photo-1656266724376-d8c5afed26d4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: [],
    sizes: ["Hardcover", "Paperback"],
    specifications: [
      { name: "Author", value: "Ankur Warikoo" },
      { name: "Genre", value: "Self-Help / Inspiration" },
      { name: "Pages", value: "296" },
      { name: "Publisher", value: "Juggernaut Books" }
    ]
  },
  {
    title: "The Alchemist",
    brand: "Paulo Coelho",
    category: "Books",
    description: "An enchanting fable about Santiago, an Andalusian shepherd boy who journeys in search of worldly treasure, teaching us about the essential wisdom of listening to our hearts and following our dreams.",
    price: 349,
    discount: 10,
    stock: 30,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/41ziEX0PJgL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback", "Hardcover"],
    specifications: [
      { name: "Author", value: "Paulo Coelho" },
      { name: "Genre", value: "Fiction / Philosophical" },
      { name: "Pages", value: "163" },
      { name: "Publisher", value: "HarperOne" }
    ]
  },
  {
    title: "To Kill a Mockingbird",
    brand: "Harper Lee",
    category: "Books",
    description: "The legendary classic of modern American literature, exploring themes of race, compassion, justice, and the loss of innocence in a beautifully constructed narrative.",
    price: 499,
    discount: 5,
    stock: 15,
    rating: 4.8,
    images: ["https://rukminim2.flixcart.com/image/300/300/xif0q/book/7/2/p/to-kill-a-mockingbird-original-imahy8w3zudfys7s.jpeg"],
    colors: [],
    sizes: ["Paperback"],
    specifications: [
      { name: "Author", value: "Harper Lee" },
      { name: "Genre", value: "Classic Literature" },
      { name: "Pages", value: "324" },
      { name: "Publisher", value: "Harper Perennial" }
    ]
  },
  {
    title: "The Great Gatsby",
    brand: "F. Scott Fitzgerald",
    category: "Books",
    description: "A beautifully written portrait of the Jazz Age, exploring the limits of the American Dream through the mysterious Jay Gatsby and his obsessive pursuit of Daisy Buchanan.",
    price: 299,
    discount: 10,
    stock: 20,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/51Udh66qBHL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback"],
    specifications: [
      { name: "Author", value: "F. Scott Fitzgerald" },
      { name: "Genre", value: "Classic Literature" },
      { name: "Pages", value: "180" },
      { name: "Publisher", value: "Charles Scribner's Sons" }
    ]
  },
  {
    title: "1984",
    brand: "George Orwell",
    category: "Books",
    description: "The definitive dystopian classic about surveillance, totalitarian government control, and the subversion of language, truth, and individual freedom under the watchful eye of Big Brother.",
    price: 349,
    discount: 10,
    stock: 25,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/517USUJAueL._SX342_SY445_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback"],
    specifications: [
      { name: "Author", value: "George Orwell" },
      { name: "Genre", value: "Dystopian Fiction" },
      { name: "Pages", value: "328" },
      { name: "Publisher", value: "Secker & Warburg" }
    ]
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    brand: "J.K. Rowling",
    category: "Books",
    description: "The magical first installment of the global wizarding phenomenon, where Harry Potter discovers his magical inheritance, enrolls at Hogwarts, and faces dark forces.",
    price: 599,
    discount: 10,
    stock: 40,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/51dOacmuzvL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Hardcover", "Paperback"],
    specifications: [
      { name: "Author", value: "J.K. Rowling" },
      { name: "Genre", value: "Fantasy" },
      { name: "Pages", value: "223" },
      { name: "Publisher", value: "Bloomsbury Publishing" }
    ]
  },
  {
    title: "Harry Potter and the Chamber of Secrets",
    brand: "J.K. Rowling",
    category: "Books",
    description: "Harry's second year at Hogwarts is filled with mysterious attacks, whispered warnings of the legendary Chamber of Secrets, and dangerous magical secrets.",
    price: 599,
    discount: 5,
    stock: 35,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/51NUYJDvkgL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Hardcover", "Paperback"],
    specifications: [
      { name: "Author", value: "J.K. Rowling" },
      { name: "Genre", value: "Fantasy" },
      { name: "Pages", value: "251" },
      { name: "Publisher", value: "Bloomsbury Publishing" }
    ]
  },
  {
    title: "The Hobbit",
    brand: "J.R.R. Tolkien",
    category: "Books",
    description: "The enchanting prequel to the Lord of the Rings. Follow Bilbo Baggins as he is swept away by a wizard and a band of dwarves on an epic quest to reclaim treasure from the dragon Smaug.",
    price: 499,
    discount: 10,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/512WlnAvYlL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback", "Deluxe Edition"],
    specifications: [
      { name: "Author", value: "J.R.R. Tolkien" },
      { name: "Genre", value: "Fantasy" },
      { name: "Pages", value: "310" },
      { name: "Publisher", value: "George Allen & Unwin" }
    ]
  },
  {
    title: "The Lord of the Rings",
    brand: "J.R.R. Tolkien",
    category: "Books",
    description: "The single volume definitive fantasy epic. Follow the legendary journey of Frodo Baggins and the Fellowship of the Ring to destroy the One Ring in the fires of Mount Doom.",
    price: 999,
    discount: 15,
    stock: 12,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/516EJ1FkBtL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Hardcover", "Paperback"],
    specifications: [
      { name: "Author", value: "J.R.R. Tolkien" },
      { name: "Genre", value: "Fantasy" },
      { name: "Pages", value: "1178" },
      { name: "Publisher", value: "George Allen & Unwin" }
    ]
  },
  {
    title: "The Silent Patient",
    brand: "Alex Michaelides",
    category: "Books",
    description: "A shocking psychological thriller about a woman's act of violence against her husband, and the modern psychotherapist obsessed with uncovering her motive.",
    price: 499,
    discount: 10,
    stock: 22,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/41rIOlXHRWL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback", "Kindle Edition"],
    specifications: [
      { name: "Author", value: "Alex Michaelides" },
      { name: "Genre", value: "Thriller / Suspense" },
      { name: "Pages", value: "336" },
      { name: "Publisher", value: "Celadon Books" }
    ]
  },
  {
    title: "Verity",
    brand: "Colleen Hoover",
    category: "Books",
    description: "A deeply disturbing and romantic gothic thriller. Lowen Ashleigh accepts a job finishing the novels of injured author Verity Crawford, only to find a chilling autobiography.",
    price: 399,
    discount: 8,
    stock: 28,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/51z0nUQlIlL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback", "Hardcover"],
    specifications: [
      { name: "Author", value: "Colleen Hoover" },
      { name: "Genre", value: "Thriller / Romance" },
      { name: "Pages", value: "336" },
      { name: "Publisher", value: "Grand Central Publishing" }
    ]
  },
  {
    title: "The Kite Runner",
    brand: "Khaled Hosseini",
    category: "Books",
    description: "The highly emotional and unforgettable sweep of history and friendship set in Kabul, telling the story of an unlikely friendship and the redemptive power of love and loyalty.",
    price: 449,
    discount: 10,
    stock: 15,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/41yR5X+bclL._SY445_SX342_FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback"],
    specifications: [
      { name: "Author", value: "Khaled Hosseini" },
      { name: "Genre", value: "Historical Fiction" },
      { name: "Pages", value: "371" },
      { name: "Publisher", value: "Riverhead Books" }
    ]
  },
  {
    title: "A Thousand Splendid Suns",
    brand: "Khaled Hosseini",
    category: "Books",
    description: "A breathtaking tale of two generations of Afghan women brought together by the tragedies of war and domestic violence, forming a deep sisterhood of survival.",
    price: 449,
    discount: 10,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/41P7QdG3ItL._FMwebp_.jpg"],
    colors: [],
    sizes: ["Paperback"],
    specifications: [
      { name: "Author", value: "Khaled Hosseini" },
      { name: "Genre", value: "Historical Fiction" },
      { name: "Pages", value: "384" },
      { name: "Publisher", value: "Riverhead Books" }
    ]
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    brand: "Yuval Noah Harari",
    category: "Books",
    description: "A sweeping narrative of human history, detailing how Homo sapiens evolved from a minor African ape to become the undisputed rulers of planet Earth.",
    price: 799,
    discount: 10,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/713jIoMO3UL._SY466_.jpg"],
    colors: [],
    sizes: ["Paperback", "Hardcover"],
    specifications: [
      { name: "Author", value: "Yuval Noah Harari" },
      { name: "Genre", value: "History / Anthropology" },
      { name: "Pages", value: "512" },
      { name: "Publisher", value: "Harper" }
    ]
  },
  {
    title: "Educated",
    brand: "Tara Westover",
    category: "Books",
    description: "An unforgettable memoir about a young girl who escapes her survivalist family in the mountains of Idaho to teach herself mathematics and history, eventually earning a PhD from Cambridge.",
    price: 599,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71N2HZwRo3L._SY466_.jpg"],
    colors: [],
    sizes: ["Hardcover", "Paperback"],
    specifications: [
      { name: "Author", value: "Tara Westover" },
      { name: "Genre", value: "Memoir / Biography" },
      { name: "Pages", value: "352" },
      { name: "Publisher", value: "Random House" }
    ]
  }
];

const CAMERAS_DATA = [
  {
    title: "EOS R5 Mark II",
    brand: "Canon",
    category: "Cameras",
    description: "The ultimate hybrid camera for professionals. Featuring a 45MP stacked CMOS sensor, up to 30 fps shooting, 8K 60p RAW video, and a revolutionary Eye Control Autofocus system for perfect subject tracking.",
    price: 349999,
    discount: 5,
    stock: 10,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["Body Only", "With 24-105mm f/4L IS USM Kit"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "45 Megapixels Full-Frame Stacked CMOS" },
      { name: "Video Capacity", value: "8K 60p RAW, 4K 120p" },
      { name: "Continuous Shoot", value: "Up to 30 fps electronic shutter" }
    ]
  },
  {
    title: "EOS R8",
    brand: "Canon",
    category: "Cameras",
    description: "The lightest, most compact full-frame mirrorless camera. Delivers stunning quality with its 24.2 MP sensor, dual pixel CMOS autofocus II, and exceptional low-light capabilities in a portable form factor.",
    price: 129999,
    discount: 10,
    stock: 15,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1605365269655-a1253a60d12b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["Body Only", "With 24-50mm f/4.5-6.3 IS STM"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "24.2 Megapixels Full-Frame" },
      { name: "ISO Range", value: "Auto, 100-102400 (expands to 204800)" },
      { name: "Video Capacity", value: "Uncropped 4K 60p (over-sampled from 6K)" }
    ]
  },
  {
    title: "EOS 200D II",
    brand: "Canon",
    category: "Cameras",
    description: "Canon's smartest and lightest DSLR companion, featuring a vari-angle touchscreen LCD. Built with a high-performance 24.1 Megapixel CMOS sensor and Dual Pixel CMOS AF for incredibly beautiful portraits.",
    price: 64999,
    discount: 8,
    stock: 20,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1490117874548-e35a2286fd89?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["With EF-S 18-55mm IS STM Lens Kit"],
    specifications: [
      { name: "Camera Type", value: "DSLR Camera" },
      { name: "Sensor Resolution", value: "24.1 Megapixels APS-C CMOS" },
      { name: "Processor Type", value: "DIGIC 8 image processor" },
      { name: "Connectivity", value: "Wi-Fi and Bluetooth" }
    ]
  },
  {
    title: "Alpha A7 IV",
    brand: "Sony",
    category: "Cameras",
    description: "Setting the new standard for modern full-frame hybrid cameras. Boasting an outstanding 33MP Exmor R sensor, real-time autofocus tracking, 4K 60p recording, and active optical stabilization.",
    price: 239999,
    discount: 7,
    stock: 12,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1606986628470-26a67fa4730c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["Body Only", "With 28-70mm Zoom Lens Kit"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "33 Megapixels Full-Frame" },
      { name: "Autofocus Points", value: "759 Phase-detection AF points" },
      { name: "Stabilization", value: "5-axis In-body Image Stabilization (IBIS)" }
    ]
  },
  {
    title: "Alpha A6700",
    brand: "Sony",
    category: "Cameras",
    description: "Premium APS-C mirrorless camera powered by AI-assisted autofocus and state-of-the-art cinematic video. Combines high mobility with a powerful 26.0 Megapixel back-illuminated Exmor R sensor.",
    price: 139999,
    discount: 5,
    stock: 14,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1547043904-a62fe1c81e8a?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["Body Only", "With 16-50mm Power Zoom Kit"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "26.0 Megapixels APS-C Exmor R CMOS" },
      { name: "AI Technology", value: "Dedicated AI processing unit for subject classification" },
      { name: "Video Resolution", value: "4K up to 120p, 10-bit 4:2:2" }
    ]
  },
  {
    title: "ZV-E10 II",
    brand: "Sony",
    category: "Cameras",
    description: "Elevate your vlogging content to professional standards. With a massive 26MP APS-C sensor, creative looks, background defocus, and product showcase shortcuts designed for creators.",
    price: 94999,
    discount: 10,
    stock: 18,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1606986601547-a4d886b671b2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black", "White"],
    sizes: ["With 16-50mm Power Zoom Lens"],
    specifications: [
      { name: "Camera Type", value: "Vlogging Camera" },
      { name: "Sensor Resolution", value: "26.0 Megapixels APS-C CMOS" },
      { name: "Mic Design", value: "Included intelligent 3-capsule directional microphone" },
      { name: "Screen type", value: "Vari-angle fully articulating touchscreen" }
    ]
  },
  {
    title: "Nikon Z8",
    brand: "Nikon",
    category: "Cameras",
    description: "A compact flagship mirrorless engineering feat. Built with a powerhouse stacked 45.7MP sensor, blackout-free real live viewfinder, and the ability to capture extraordinary 8K/60p internal video.",
    price: 329999,
    discount: 5,
    stock: 8,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["Body Only", "With NIKKOR Z 24-120mm f/4 S Lens Kit"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "45.7 Megapixels Stacked CMOS" },
      { name: "Video Quality", value: "8K 60p / 4K 120p, 12-bit RAW internal" },
      { name: "Shutter Type", value: "Electronic-only silent shutter up to 1/32000s" }
    ]
  },
  {
    title: "Nikon Z6 III",
    brand: "Nikon",
    category: "Cameras",
    description: "Equipped with a partially-stacked CMOS sensor for super-fast readout speed, high-resolution pixel shift options, and stunning color reproduction. Designed to thrive in tough low-light situations.",
    price: 219999,
    discount: 8,
    stock: 12,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1667138494963-f29c383bcead?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["Body Only", "With NIKKOR Z 24-70mm f/4 S"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "24.5 Megapixels Partially-Stacked" },
      { name: "Autofocus subject types", value: "9 structural target recognition classes" },
      { name: "Stabilization Rating", value: "8.0 stops of 5-axis VR protection" }
    ]
  },
  {
    title: "Nikon D7500",
    brand: "Nikon",
    category: "Cameras",
    description: "Designed for photographers wishing to expand their creative limits. Features the high-performance 20.9 MP DX-format sensor and advanced 51-point autofocus grid derived from the legendary D500.",
    price: 84999,
    discount: 10,
    stock: 15,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1742144107792-c72e2935218a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["With AF-S DX 18-140mm f/3.5-5.6G ED VR Lens"],
    specifications: [
      { name: "Camera Type", value: "DSLR Camera" },
      { name: "Sensor Resolution", value: "20.9 Megapixels APS-C DX" },
      { name: "Speed Rating", value: "Continuous shooting up to 8 fps" },
      { name: "Video Support", value: "4K UHD with specialized audio inputs" }
    ]
  },
  {
    title: "Fujifilm X-T5",
    brand: "Fujifilm",
    category: "Cameras",
    description: "A perfect retro photography champion. Features a high-resolution 40.2 MP X-Trans CMOS 5 HR sensor, classic exposure dial tactile control wheels, and legendary classic film simulation presets.",
    price: 169999,
    discount: 5,
    stock: 11,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1648161725585-40e82d796d39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Silver", "Black Onyx"],
    sizes: ["Body Only", "With XF 18-55mm f/2.8-4 R LM OIS"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "40.2 Megapixels APS-C X-Trans" },
      { name: "Film Simulation", value: "19 modes including Nostalgic Neg." },
      { name: "Screen format", value: "3-way tilting LCD touchscreen" }
    ]
  },
  {
    title: "Fujifilm X-S20",
    brand: "Fujifilm",
    category: "Cameras",
    description: "A versatile, feature-rich and incredibly lightweight mirrorless body designed with vlogging and travel in mind. Features a generous handgrip and superb high-capacity battery life.",
    price: 129999,
    discount: 7,
    stock: 14,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1573320286044-b43a4168fb40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black"],
    sizes: ["Body Only", "With XC 15-45mm Kit"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "26.1 Megapixels X-Trans CMOS 4" },
      { name: "Video Frame Format", value: "6.2K internal recording at 30p" },
      { name: "Battery Spec", value: "High-capacity NP-W235 battery cell code" }
    ]
  },
  {
    title: "Fujifilm Instax Mini Evo",
    brand: "Fujifilm",
    category: "Cameras",
    description: "Classic analog look meets modern hybrid digital capabilities. Experiment with 10 lens effects and 10 film effects, totalizing up to 100 unique creation styles.",
    price: 22999,
    discount: 5,
    stock: 25,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1610593315207-65388da3d154?q=80&w=1026&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Retro Silver/Black", "Classic Retro Brown Edition"],
    sizes: ["Standard Instant Set"],
    specifications: [
      { name: "Camera Type", value: "Instant Camera" },
      { name: "Format", value: "Uses high-quality Instax Mini Film packs" },
      { name: "Digital Feature", value: "Print photos directly from smartphone over Bluetooth" },
      { name: "Lens Focal Length", value: "28mm equivalent f/2.0 aperture lens" }
    ]
  },
  {
    title: "Lumix S5 II",
    brand: "Panasonic",
    category: "Cameras",
    description: "The first Panasonic Lumix camera featuring outstanding Phase Hybrid Autofocus. Offers full-frame 24.2MP high fidelity, 6K recording, unlimited recording limit, and superior active stabilization.",
    price: 159999,
    discount: 10,
    stock: 12,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1590292339438-5fc3be7fca9d?q=80&w=1060&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Matte Black"],
    sizes: ["Body Only", "With 20-60mm f/3.5-5.6 Zoom Lens"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "24.2 Megapixels Full-Frame CMOS" },
      { name: "Autofocus Core", value: "779-point phase detection hybrid autofocus system" },
      { name: "Thermal Tech", value: "Active cooling fan built-in for unlimited record times" }
    ]
  },
  {
    title: "Lumix GH7",
    brand: "Panasonic",
    category: "Cameras",
    description: "The peak of professional video production workflows. Featuring internal ProRes RAW HQ recording, robust 32-bit float audio support, and high speed 4K 120p slow-motion.",
    price: 209999,
    discount: 8,
    stock: 9,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1613728795345-35ef215b4dc0?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Deep Charcoal Black"],
    sizes: ["Body Only"],
    specifications: [
      { name: "Camera Type", value: "Professional Video Camera" },
      { name: "Sensor Resolution", value: "25.2 Megapixels Micro Four Thirds BSI CMOS" },
      { name: "Audio Engine", value: "World first 32-bit float recording via XLR Adapter" },
      { name: "Luminance Standard", value: "Dynamic Range Boost with ARRI LogC3 profile setup" }
    ]
  },
  {
    title: "OM-D E-M10 Mark IV",
    brand: "OM System",
    category: "Cameras",
    description: "Incredibly light, highly capable, and stylishly classic. Combines a portable body style with powerful in-body 5-axis image stabilization for sharp photos even when shooting hand-held.",
    price: 79999,
    discount: 5,
    stock: 15,
    rating: 4.4,
    images: ["https://images.unsplash.com/photo-1772289547521-b5cbce5426a8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Silver Retro Frame", "Midnight Black Matte"],
    sizes: ["With M.Zuiko 14-42mm f/3.5-5.6 EZ Lens Kit"],
    specifications: [
      { name: "Camera Type", value: "Mirrorless Camera" },
      { name: "Sensor Resolution", value: "20.3 Megapixels Live MOS" },
      { name: "Stabilization Specs", value: "In-body 5-axis sensor-shift (4.5 stops)" },
      { name: "Creative Filters", value: "16 Art Filter modes built-in" }
    ]
  },
  {
    title: "HERO 14 Black",
    brand: "GoPro",
    category: "Cameras",
    description: "The toughest action camera ever engineered. Captures breathtaking 5.3K video, includes the upgraded HyperSmooth 7.0 stabilization, and features massive battery life in frozen conditions.",
    price: 44999,
    discount: 10,
    stock: 30,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1616858718136-028ae56f0117?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic GoPro Grey"],
    sizes: ["Standard Standalone Pack", "Creator Edition Bundle"],
    specifications: [
      { name: "Camera Type", value: "Action Camera" },
      { name: "Video Capture", value: "5.3K at 60 fps, 4K at 120 fps" },
      { name: "Waterproof depth", value: "Fully waterproof to 33ft (10m) without housing" },
      { name: "Stabilization Engine", value: "Horizon Lock paired with HyperSmooth 7.0" }
    ]
  },
  {
    title: "Insta360 X5",
    brand: "Insta360",
    category: "Cameras",
    description: "Capture the complete, uninhibited picture. Built with dual premium sensors, producing insane 8K 360-degree video, invisible selfie stick processing, and smart AI reframing presets.",
    price: 54999,
    discount: 5,
    stock: 22,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1689435505430-b4fda78d10ff?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Satin Black"],
    sizes: ["Standard 360 Pack", "Motorcycle Kit", "Snow Ski Kit"],
    specifications: [
      { name: "Camera Type", value: "360° Action Camera" },
      { name: "Sensor Resolution", value: "8K 360-degree capture rating" },
      { name: "FlowState Stable", value: "6-axis electronic image stabilization" },
      { name: "Audio System", value: "4-mic spatial sound tracking grid" }
    ]
  },
  {
    title: "DJI Osmo Pocket 4",
    brand: "DJI",
    category: "Cameras",
    description: "Pocket-sized cinematic powerhouse. Integrating a 1-inch CMOS sensor, 3-axis mechanical gimbal stabilizer, rotatable OLED screen, and ActiveTrack 6.0 center tracking.",
    price: 69999,
    discount: 5,
    stock: 18,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1698995474486-3e3fc962ef39?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Black Matte"],
    sizes: ["Standard Pocket pack", "Creator Combo Bundle Set"],
    specifications: [
      { name: "Camera Type", value: "Pocket Camera" },
      { name: "Sensor Resolution", value: "1-Inch High-Sensitivity CMOS" },
      { name: "Gimbal Mechanism", value: "3-axis precision mechanical stabilizing joint" },
      { name: "Display Size", value: "2.0-inch rotating OLED touchscreen" }
    ]
  },
  {
    title: "Leica Q4",
    brand: "Leica",
    category: "Cameras",
    description: "The absolute pinnacle of premium compact cameras. Handcrafted in Germany with a breathtaking 60 Megapixel full-frame sensor and a legendary fixed Summilux 28mm f/1.7 ASPH precision lens.",
    price: 649999,
    discount: 0,
    stock: 4,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1696595836447-68f8d90d9f1a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Classic Black Leatherette Coating"],
    sizes: ["Premium Fixed Format"],
    specifications: [
      { name: "Camera Type", value: "Premium Compact Camera" },
      { name: "Sensor Resolution", value: "60.3 Megapixels Full-Frame CMOS" },
      { name: "Lens Optics", value: "Summilux 28mm f/1.7 ASPH (11 elements in 9 groups)" },
      { name: "Craftsmanship Detail", value: "IP52 dust and spray water-sealed alloy casing" }
    ]
  },
  {
    title: "Ricoh GR IV",
    brand: "Ricoh",
    category: "Cameras",
    description: "The ultimate weapon for street photography. Combining an ultra-compact body that slips into your pocket, a sharp fixed 28mm equivalent lens and blazing-fast hybrid autofocus.",
    price: 119999,
    discount: 5,
    stock: 15,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1737259380769-7f23915b13f1?q=80&w=818&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    colors: ["Midnight Black", "Special Diary Edition Grey"],
    sizes: ["Pocket Standard Edition"],
    specifications: [
      { name: "Camera Type", value: "Compact Camera" },
      { name: "Sensor Resolution", value: "24.2 Megapixels APS-C CMOS" },
      { name: "Lens Build", value: "18.3mm f/2.8 lens (28mm equivalent)" },
      { name: "Startup Time", value: "Under 0.8 seconds high speed activation" }
    ]
  }
];

const SMART_WATCHES_DATA = [
  {
    title: "Apple Watch Ultra 3",
    brand: "Apple",
    category: "Smart Watches",
    description: "The ultimate sports and adventure watch. Features a rugged titanium case, up to 36 hours of battery life, dual-frequency GPS, and professional-grade diving/outdoor tools.",
    price: 89999,
    discount: 5,
    stock: 12,
    rating: 4.9,
    images: ["https://www.imagineonline.store/cdn/shop/files/IMG-18067229_m_jpeg_1.jpg?v=1757448854&width=823"],
    colors: ["Natural Titanium", "Orange Ocean Band"],
    sizes: ["49mm"],
    specifications: [
      { name: "Display", value: "Always-On Retina LTPO OLED, up to 3000 nits" },
      { name: "Battery Life", value: "Up to 36 hours of normal use" },
      { name: "Water Resistance", value: "100m, swimproof, recreational dive to 40m" },
      { name: "Sensors", value: "Accurate GPS, ECG, Blood Oxygen, Temperature Sensing" }
    ]
  },
  {
    title: "Apple Watch Series 11",
    brand: "Apple",
    category: "Smart Watches",
    description: "Our most advanced smartwatch yet, featuring a thinner design, larger display with faster charging, and crucial insights about your health and fitness.",
    price: 49999,
    discount: 10,
    stock: 25,
    rating: 4.8,
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThaes95l1QXXeNrjOo1HJh7u1k0uTrfwaagg&s"],
    colors: ["Jet Black", "Silver Sport Band", "Rose Gold"],
    sizes: ["41mm", "45mm"],
    specifications: [
      { name: "Display", value: "Always-On Retina LTPO OLED, up to 2000 nits" },
      { name: "Charge Time", value: "0% to 80% in about 45 minutes" },
      { name: "Health Alerts", value: "High and low heart rate, irregular rhythm, sleep apnea notifications" }
    ]
  },
  {
    title: "Apple Watch SE (3rd Gen)",
    brand: "Apple",
    category: "Smart Watches",
    description: "All the essential features you love at a more accessible price point. Track your workouts, stay connected, and monitor your heartbeat with ease.",
    price: 29999,
    discount: 0,
    stock: 30,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/41R-4p6TZ1L._SX342_SY445_QL70_FMwebp_.jpg"],
    colors: ["Midnight", "Starlight", "Silver"],
    sizes: ["40mm", "44mm"],
    specifications: [
      { name: "Display", value: "Retina LTPO OLED, up to 1000 nits" },
      { name: "Notifications", value: "Irregular heart rhythm alerts, High and low heart rate" },
      { name: "Durability", value: "50m swimproof design" }
    ]
  },
  {
    title: "Samsung Galaxy Watch Ultra",
    brand: "Samsung",
    category: "Smart Watches",
    description: "Built for extreme adventure. Designed with a sturdy cushion titanium bezel, multi-sport activity optimization, and exceptional battery backup.",
    price: 59999,
    discount: 12,
    stock: 15,
    rating: 4.9,
    images: ["https://dukaan.b-cdn.net/700x700/webp/media/f20a29dd-b2ed-4d01-9533-ffd7bcc62530.jpg"],
    colors: ["Titanium Grey", "Titanium White", "Titanium Silver"],
    sizes: ["47mm"],
    specifications: [
      { name: "Material", value: "Grade 4 Titanium with Sapphire Crystal" },
      { name: "Battery Life", value: "Up to 100 hours in power saving mode" },
      { name: "Durability", value: "10ATM water resistance, MIL-STD-810H" }
    ]
  },
  {
    title: "Samsung Galaxy Watch 8 Classic",
    brand: "Samsung",
    category: "Smart Watches",
    description: "Merging legacy design with state-of-the-art diagnostic algorithms. Showcases a premium rotatable mechanical bezel for seamless navigation.",
    price: 44999,
    discount: 5,
    stock: 20,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/41lQNa26QrL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Classic Silver", "Graphite Black"],
    sizes: ["43mm", "47mm"],
    specifications: [
      { name: "Bezel Type", value: "Physical Rotatable Bezel" },
      { name: "Body Composition", value: "Bioelectrical Impedance Analysis (BIA) sensor" },
      { name: "Operating System", value: "Wear OS powered by Samsung" }
    ]
  },
  {
    title: "Samsung Galaxy Watch 8",
    brand: "Samsung",
    category: "Smart Watches",
    description: "Sleek, lightweight daily partner featuring advanced body composition analytics, personalized cardiovascular trackers, and standard sleep scoring.",
    price: 34999,
    discount: 10,
    stock: 35,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61Ksr0LpFBL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Armor Aluminium Silver", "Green Forest", "Graphite"],
    sizes: ["40mm", "44mm"],
    specifications: [
      { name: "Processor", value: "Next-gen high efficiency Exynos W1000 3nm" },
      { name: "Screen", value: "Super AMOLED with Always-On display" },
      { name: "Diagnostics", value: "Sleep Apnea detection (FDA cleared)" }
    ]
  },
  {
    title: "Garmin Fenix 8",
    brand: "Garmin",
    category: "Smart Watches",
    description: "The gold standard for outdoor athletes. A rugged GPS multisport watch engineered with premium navigation, vibrant display, and offline mapping.",
    price: 99999,
    discount: 5,
    stock: 8,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/51oaovkEgKL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Slate Gray Titanium", "Orange Accented bezel"],
    sizes: ["47mm", "51mm"],
    specifications: [
      { name: "GPS", value: "Multi-band GPS with SatIQ technology" },
      { name: "Flashlight", value: "Built-in bright multi-intensity LED flashlight" },
      { name: "Compass", value: "3-axis compass with altimeter and barometer" }
    ]
  },
  {
    title: "Garmin Forerunner 965",
    brand: "Garmin",
    category: "Smart Watches",
    description: "Tailored specifically for elite runners and triathletes. Features a bright AMOLED touch display and comprehensive physiological indicators.",
    price: 54999,
    discount: 10,
    stock: 14,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71y2F46secL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Black Ceramic Grey", "Amp Yellow Accent"],
    sizes: ["46mm"],
    specifications: [
      { name: "Battery Life", value: "Up to 23 days in smartwatch mode" },
      { name: "Mapping", value: "Full-color integrated mapping on-screen" },
      { name: "Metrics", value: "Training Readiness, Heart Rate Variability (HRV)" }
    ]
  },
  {
    title: "Garmin Venu 3",
    brand: "Garmin",
    category: "Smart Watches",
    description: "Designed with advanced wellness and sleep tutoring tools, built-in speaker/mic, and a gorgeous, vibrant, colorful AMOLED screen.",
    price: 39999,
    discount: 5,
    stock: 18,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61m+fKy7wzL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Slate Frame with Black Case", "French Grey"],
    sizes: ["45mm"],
    specifications: [
      { name: "Sleep Coach", value: "Personalized sleep score and naps tracking" },
      { name: "Connected Calls", value: "Make and receive phone calls from wrist" },
      { name: "Fitness Tracking", value: "30+ preloaded dynamic outdoor sports apps" }
    ]
  },
  {
    title: "Amazfit Balance",
    brand: "Amazfit",
    category: "Smart Watches",
    description: "Your ultimate partner to balance mind and body. Incorporates body composition measurements and intelligent personalized sleep readiness insights.",
    price: 24999,
    discount: 15,
    stock: 22,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71h4wjuFGDL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Sunset Grey", "Midnight Black"],
    sizes: ["46mm Circular"],
    specifications: [
      { name: "AI Coach", value: "Zepp Aura AI Sleep & Wellness assistant" },
      { name: "Sensors", value: "BioTracker 5.0 PPG biomonitor sensor" },
      { name: "GPS", value: "Dual-band circular-polarized GPS antenna" }
    ]
  },
  {
    title: "Amazfit GTR 5",
    brand: "Amazfit",
    category: "Smart Watches",
    description: "A gorgeous luxury circular watch constructed using aircraft-grade aluminum alloy, robust dual-frequency GPS direction tracking, and up to 14 days of charge.",
    price: 19999,
    discount: 10,
    stock: 28,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61LeyQw4qbL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Vintage Brown Leather", "Grey Liquid Silicone"],
    sizes: ["45mm Classic"],
    specifications: [
      { name: "Material", value: "Micro-curved high glass dial bezel structure" },
      { name: "Fitness Modes", value: "150+ smart athletic sports tracking" },
      { name: "Siri/Alexa", value: "Built-in voice assistant compatibility offline" }
    ]
  },
  {
    title: "Amazfit Active 2",
    brand: "Amazfit",
    category: "Smart Watches",
    description: "Elegant, lightweight active watch offering high precision GPS, beautiful square-bezel AMOLED screen, and robust long battery backup.",
    price: 14999,
    discount: 5,
    stock: 40,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/71iNNUyae9L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Petal Pink", "Midnight Black Matte"],
    sizes: ["42mm Square"],
    specifications: [
      { name: "Battery Life", value: "Up to 14 days of typical usage" },
      { name: "Waterproof Grade", value: "5 ATM water splash resistance" },
      { name: "Calling", value: "Direct Bluetooth phone calls on dashboard" }
    ]
  },
  {
    title: "OnePlus Watch 3",
    brand: "OnePlus",
    category: "Smart Watches",
    description: "The elite smartwatch featuring Dual-Engine architecture, up to 100 hours of continuous battery life, and high-precision athletic metrics.",
    price: 27999,
    discount: 8,
    stock: 15,
    rating: 4.7,
    images: ["https://image01.oneplus.net/media/202502/12/b3c115c086af4684e803827886a183bb.png?x-amz-process=image/format,webp/quality,Q_80"],
    colors: ["Forest Green Leather", "Nordic Blue Matte"],
    sizes: ["46mm Core"],
    specifications: [
      { name: "Battery Life", value: "Up to 100 hours in smart mode" },
      { name: "Processor", value: "Snapdragon W5 Gen 1 Wear OS processor" },
      { name: "Sensors", value: "Dual-channel heart rate, SpO2, and fitness trackers" }
    ]
  },
  {
    title: "OnePlus Watch 2R",
    brand: "OnePlus",
    category: "Smart Watches",
    description: "Designed for everyday explorers. Offers dual-engine power, premium Wear OS performance, and beautiful lightweight aluminum design.",
    price: 17999,
    discount: 10,
    stock: 25,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/41hsRvicN0L._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Forest Green", "Gunmetal Gray"],
    sizes: ["46mm Classic"],
    specifications: [
      { name: "OS Platform", value: "Google Wear OS 4.0 integrated" },
      { name: "Weight", value: "37g lightweight athletic build" },
      { name: "Battery Pack", value: "500 mAh with VOOC fast charging" }
    ]
  },
  {
    title: "OnePlus Nord Watch 2",
    brand: "OnePlus",
    category: "Smart Watches",
    description: "Symmetric elegant smart wristband companion centering premium AMOLED displays, multiple wellness trackers, and continuous heart monitoring.",
    price: 7999,
    discount: 12,
    stock: 45,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71e8OcUFflL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Deep Charcoal Wood", "Snow White Ceramic"],
    sizes: ["Square Standard"],
    specifications: [
      { name: "Refresh Rate", value: "60Hz refresh rate AMOLED shield" },
      { name: "Sports Trackers", value: "105+ indoor/outdoor sports presets" },
      { name: "Casing Material", value: "Premium zinc-alloy watch frame" }
    ]
  },
  {
    title: "Noise ColorFit Pro 6 Max",
    brand: "Noise",
    category: "Smart Watches",
    description: "A gorgeous, expansive large screen smartwatch featuring a fully functional rotary dial, customized fitness tools, and stress-level gauges.",
    price: 5999,
    discount: 15,
    stock: 50,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71aIIBxjmcL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Classic Brown Leather", "Elite Black Metallic"],
    sizes: ["1.96 inches screen"],
    specifications: [
      { name: "Display", value: "1.96-inch HD AMOLED with 410*502 px" },
      { name: "Calling", value: "Single-chip Tru Sync Bluetooth calling" },
      { name: "Wellness Suite", value: "SpO2 tracking, heart tracker, female health companion" }
    ]
  },
  {
    title: "Noise ColorFit Ultra 4",
    brand: "Noise",
    category: "Smart Watches",
    description: "Ultra-sleek modern functional smartwatch presenting high-intensity metallic alloys, integrated Bluetooth Calling setups, and custom watch face support.",
    price: 4999,
    discount: 5,
    stock: 65,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/6128cMSoHyL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Matte Gold Mesh", "Steel Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Design", value: "Premium zinc metallic frame design" },
      { name: "Display Options", value: "150+ custom cloud-based watch faces" },
      { name: "Fitness Suite", value: "Noise Health Suite + Sports Diagnostic logging" }
    ]
  },
  {
    title: "NoiseFit Halo Plus",
    brand: "Noise",
    category: "Smart Watches",
    description: "Elegantly finished classic circular timepiece built with shiny protective metal casings, vibrant screen setups, and intelligent sleep coaching.",
    price: 3499,
    discount: 10,
    stock: 70,
    rating: 4.1,
    images: ["https://m.media-amazon.com/images/I/615vWFK3vyL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Metallic Black Mesh", "Classic Gold-Linked Strap"],
    sizes: ["Circular Classic"],
    specifications: [
      { name: "Bezel", value: "Chiseled luxury stainless metallic circular case" },
      { name: "Power Reserve", value: "Up to 7 days continuous charge backup" },
      { name: "Diagnostics", value: "Intelligent SPO2, Sleep monitors, and Heart diagnostics" }
    ]
  },
  {
    title: "boAt Lunar Connect Pro",
    brand: "boAt",
    category: "Smart Watches",
    description: "Immersive Always-on display coupled with specialized health dashboards, smart AI voice assistant support, and robust dust-shield configurations.",
    price: 3999,
    discount: 15,
    stock: 55,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/61frMaBqWgL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Deep Indigo Blue", "Charcoal Black"],
    sizes: ["Standard Round"],
    specifications: [
      { name: "Display Technology", value: "1.39-inch High Brightness AMOLED round panel" },
      { name: "Voice Support", value: "One-click accessibility to Google or Siri assistants" },
      { name: "Athletic Tracking", value: "Caters to 700+ custom active athletic regimes" }
    ]
  },
  {
    title: "boAt Storm Call 4",
    brand: "boAt",
    category: "Smart Watches",
    description: "Spacious curved display presenting intuitive sports metrics, interactive health diagnostics, and smart notification alerts.",
    price: 2999,
    discount: 0,
    stock: 50,
    rating: 4.0,
    images: ["https://m.media-amazon.com/images/I/71UdDIKDlEL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Pitch Black", "Steel Grey", "Mint Green"],
    sizes: ["Standard"],
    specifications: [
      { name: "Display", value: "1.91-inch Curved Smart Screen, 550 nits" },
      { name: "Workout Records", value: "Multi-sport diagnostic activity tracker" },
      { name: "BT Calling", value: "Built in microphone, dial keys, and speakers" },
      { name: "Durability", value: "IP68 dust, sweat, and water splash resistance" }
    ]
  },
  {
    title: "boAt Wave Sigma 4",
    brand: "boAt",
    category: "Smart Watches",
    description: "Premium large dial display showing high contrast sports parameters, advanced voice logs, and dynamic heart diagnostics.",
    price: 2499,
    discount: 10,
    stock: 60,
    rating: 4.1,
    images: ["https://m.media-amazon.com/images/I/71JLQrCFF+L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Navy Blue", "Olive Drab", "Cherry Red"],
    sizes: ["Standard Rectangular"],
    specifications: [
      { name: "Display Area", value: "2.01-inch HD bright display" },
      { name: "Bluetooth System", value: "Advanced BLE 5.3 instant syncing" },
      { name: "Health Alerts", value: "Heart Rate, SpO2, sleep trackers, and movement warnings" }
    ]
  },
  {
    title: "Fire-Boltt Visionary Ultra",
    brand: "Fire-Boltt",
    category: "Smart Watches",
    description: "Elevate your accessory styling with Fire-Boltt Visionary Ultra. Sports an exquisite AMOLED touchscreen with built-in storage to house music tracks.",
    price: 4499,
    discount: 10,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61IGSSfF-JL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Classic Brown Leather", "Stealth Black Carbon"],
    sizes: ["1.78 inches Display"],
    specifications: [
      { name: "Audio Playback", value: "Connect earbuds directly for offline music tracks" },
      { name: "Calling Setup", value: "Inbuilt keypad logs, micro microphone, and speakers" },
      { name: "Athletics", value: "Comprehensive multi-sport diagnostic dashboard" }
    ]
  },
  {
    title: "Fire-Boltt Ninja Call Pro Max",
    brand: "Fire-Boltt",
    category: "Smart Watches",
    description: "A highly affordable, powerful companion displaying extensive metrics, direct dial mechanisms, and multi-day battery cycles.",
    price: 2999,
    discount: 5,
    stock: 45,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/71aQGqkkh5L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Deep Teal Black", "Classic Silver Sand"],
    sizes: ["Standard"],
    specifications: [
      { name: "Viewing screen", value: "1.83-inch HD fully touch responsive glass" },
      { name: "Health Diagnostics", value: "SpO2 trackers, heart logs, and dynamic sleep logging" },
      { name: "Operating", value: "Multi-day standard active battery cycle" }
    ]
  },
  {
    title: "Fire-Boltt Phoenix AMOLED",
    brand: "Fire-Boltt",
    category: "Smart Watches",
    description: "Stately circular smartwatch displaying dynamic colorful visual dashboards, integrated call logs, and multi-sport diagnostics.",
    price: 2499,
    discount: 8,
    stock: 55,
    rating: 4.1,
    images: ["https://m.media-amazon.com/images/I/71WWGHv-p3L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Glistening Gold Metal", "Graphite Grey Silicone"],
    sizes: ["Standard Round"],
    specifications: [
      { name: "Dial Glass", value: "Circular high contrast AMOLED shield" },
      { name: "Sports Logs", value: "120+ indoor/outdoor gaming activity logs" },
      { name: "Voice Suite", value: "Direct AI vocal instructions interface support" }
    ]
  },
  {
    title: "Titan Smart Pro X",
    brand: "Titan",
    category: "Smart Watches",
    description: "Sleek luxury timepiece fusing high-precision health monitoring with fine lifestyle craftsmanship. Includes specialized stress meters, altitude metrics, and compass.",
    price: 12999,
    discount: 5,
    stock: 12,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71IwQKb1J-L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Classic Metallic Black", "Brown Premium Leather Strap"],
    sizes: ["Classic 46mm Round"],
    specifications: [
      { name: "GPS Tracks", value: "Built-in dedicated high speed GPS" },
      { name: "Sensor Matrix", value: "Barometric Altituder, Compass, and SPO2 sensors" },
      { name: "Screen Bezel", value: "Fully detailed round alloy dial housing" }
    ]
  },
  {
    title: "Titan Celestor Smartwatch",
    brand: "Titan",
    category: "Smart Watches",
    description: "Rugged yet premium smartwatch built for adventure. Provides multiple multi-sports tracing routines, weather alerts, and outstanding AMOLED visuals.",
    price: 8999,
    discount: 10,
    stock: 16,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/716xIruI4SL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Amber Orange Silicon", "Premium Slate Grey"],
    sizes: ["Standard Outdoor 47mm"],
    specifications: [
      { name: "Viewing Area", value: "1.43-inch crystal AMOLED screen" },
      { name: "Navigation", value: "Advanced integrated dual-band GPS trackers" },
      { name: "Resistance", value: "3 ATM water dive resistance ratings" }
    ]
  },
  {
    title: "Fastrack Revoltt X Pro",
    brand: "Fastrack",
    category: "Smart Watches",
    description: "A trendy square display smartwatch sporting beautiful geometric details, premium metal finish bezel, and single sync Bluetooth Calling system.",
    price: 4999,
    discount: 15,
    stock: 40,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71zA67SmrWL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Military Green", "Space Charcoal Black"],
    sizes: ["Standard Square 1.83\""],
    specifications: [
      { name: "Casing", value: "High grade durable polycarbonate with aluminum buttons" },
      { name: "Sensors", value: "Heart Rate Monitor, Accelerometer, SpO2 sensor" },
      { name: "Call Hub", value: "Single-sync Bluetooth calling with dial pad access" }
    ]
  },
  {
    title: "Fastrack Reflex Play+",
    brand: "Fastrack",
    category: "Smart Watches",
    description: "Circular trendy active smartwatch providing an unmatched level of fun, colored widgets, and automatic cardiovascular monitors.",
    price: 3499,
    discount: 5,
    stock: 48,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/71Fu2gCtINL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Indigo Mesh", "Starlight Ivory"],
    sizes: ["Circular Dial"],
    specifications: [
      { name: "Sensors", value: "Photoplethysmography heart monitor, Sleep analyzer" },
      { name: "Games", value: "Inbuilt interactive quick logic games" },
      { name: "Acoustics", value: "Quick music control adjustments on the wrist" }
    ]
  },
  {
    title: "Huawei Watch GT 5 Pro",
    brand: "Huawei",
    category: "Smart Watches",
    description: "Masterpiece in titanium and ceramic design. Tracks golf performance, diving, and incorporates an ultra-precise TruSense health tracker.",
    price: 29999,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61nliZrLUHL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Titanium Silver Brushed", "White Ceramic Classic"],
    sizes: ["46mm Pro"],
    specifications: [
      { name: "Golf Assistant", value: "Detailed 3D golf course map overlays of thousands of courses" },
      { name: "Dive depth", value: "Up to 40 meters professional freedive depth resistance" },
      { name: "Health tech", value: "Huawei TruSense system tracking Heart, SpO2, and respiratory" }
    ]
  },
  {
    title: "Xiaomi Watch S4",
    brand: "Xiaomi",
    category: "Smart Watches",
    description: "Modular luxury watch with interchangeable bezels. Sports a premium circular AMOLED display, versatile HyperOS integrations, and durable design.",
    price: 14999,
    discount: 12,
    stock: 22,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51wxHEqyaNL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Forged Carbon Black", "Silver Mesh Duo"],
    sizes: ["47mm Round"],
    specifications: [
      { name: "Bezel Type", value: "Innovative interchangeable quick-swap bezel mechanism" },
      { name: "OS Integration", value: "Fluid seamless operations using Xiaomi HyperOS app ecosystem" },
      { name: "Battery Spec", value: "Power backup of up to 15 standard active days" }
    ]
  }
];

// The designated 36 smartphones from user request
const SMARTPHONES_DATA = [
  {
    title: "iPhone 17 Pro Max 512GB",
    brand: "Apple",
    category: "Smartphones",
    description: "The absolute peak of mobile innovation. Featuring the custom-designed A19 Bionic graphics engine, high-density 120Hz ProMotion display, and a triple-camera sapphire array for cinematic masterpiece captures.",
    price: 149999,
    discount: 0,
    stock: 25,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/71MXmswILHL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Space Black", "Titanium Gray"],
    sizes: ["128GB", "256GB", "512GB"],
    specifications: [
      { name: "Screen Size", value: "6.9 inches Super Retina XDR" },
      { name: "RAM", value: "16 GB" },
      { name: "Storage", value: "512 GB NVMe" },
      { name: "Battery", value: "4850 mAh fast wireless charge" }
    ]
  },
  {
    title: "iPhone 17 Pro 256GB",
    brand: "Apple",
    category: "Smartphones",
    description: "Engineered with premium brushed titanium and advanced ray tracing cores. Designed for high efficiency and stellar photographic output with next-gen photonic engines.",
    price: 129999,
    discount: 5,
    stock: 35,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/616-Eh2FbPL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Natural Titanium", "Dark Blue"],
    sizes: ["128GB", "256GB", "512GB"],
    specifications: [
      { name: "Screen Size", value: "6.3 inches Dynamic Island" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4200 mAh ultra battery" }
    ]
  },
  {
    title: "iPhone 17 128GB",
    brand: "Apple",
    category: "Smartphones",
    description: "The classic flagship layout made lighter, sleeker, and faster. Features active notification capsules and robust durable ceramic glass screens.",
    price: 82999,
    discount: 0,
    stock: 50,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61evtSm4vDL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Teal Green", "Stellar Black"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.1 inches Ceramic Shield" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "3900 mAh day-long use" }
    ]
  },
  {
    title: "iPhone 16 Plus 256GB",
    brand: "Apple",
    category: "Smartphones",
    description: "Big screen capabilities meet stellar thermal efficiency. Optimized for mobile gaming with active cooling designs and beautiful vibrant panel overlays.",
    price: 75999,
    discount: 5,
    stock: 18,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/711VzeHZAPL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Sky Blue", "Pastel White"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches OLED" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4380 mAh large power pack" }
    ]
  },
  {
    title: "Samsung Galaxy S25 Ultra",
    brand: "Samsung",
    category: "Smartphones",
    description: "The AI-driven power horse of the decade. S-Pen integrated, armored titanium chassis, and an industry-leading 200MP detail sensor for crisp low-light captures.",
    price: 124999,
    discount: 10,
    stock: 15,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/61x2YvxqdGL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Titanium Gray", "Phantom Black"],
    sizes: ["256GB", "512GB"],
    specifications: [
      { name: "Screen Size", value: "6.8 inches Dynamic AMOLED 2X" },
      { name: "RAM", value: "16 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh super charge" }
    ]
  },
  {
    title: "Samsung Galaxy S25",
    brand: "Samsung",
    category: "Smartphones",
    description: "Powerful performance packed under ultra-slim lightweight armor. Superb ergonomics, flat side rail borders, and highly optimized camera layout structures.",
    price: 74999,
    discount: 8,
    stock: 22,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61Q1AgNSO3L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Jade Green", "Rose Pink"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.2 inches LTPO AMOLED" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4000 mAh high efficiency" }
    ]
  },
  {
    title: "Samsung Galaxy S24 FE",
    brand: "Samsung",
    category: "Smartphones",
    description: "Curated with all fan favorite features. Stellar price-to-performance ratio, multi-lens configurations, and premium look glass panels.",
    price: 42999,
    discount: 15,
    stock: 30,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71eUNTW+nJL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Mint Silver", "Graphite Blue"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.4 inches Dynamic Display" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "4500 mAh stable capacity" }
    ]
  },
  {
    title: "Samsung Galaxy A56 5G",
    brand: "Samsung",
    category: "Smartphones",
    description: "The absolute champion of mid-range durabilities. Dust resistance, elegant pastel colors, and long-lasting 4-year OS system upgrades.",
    price: 39999,
    discount: 10,
    stock: 12,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/71asXBK4i7L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Violet Lavender", "Coal Slate"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.6 inches AMOLED 120Hz" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "5000 mAh mega battery" }
    ]
  },
  {
    title: "Samsung Galaxy A36 5G",
    brand: "Samsung",
    category: "Smartphones",
    description: "Enjoy brilliant viewing experiences and lag-free multitasking on a budget. Equipped with beautiful curved screen ratios and multiple camera blocks.",
    price: 28999,
    discount: 5,
    stock: 45,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/71eUNTW+nJL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Ocean Mint", "Satin Black"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.5 inches AMOLED" },
      { name: "RAM", value: "6 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "5000 mAh quick charge" }
    ]
  },
  {
    title: "OnePlus 13R",
    brand: "OnePlus",
    category: "Smartphones",
    description: "Never settle performance meets unmatched speed. Built with cutting-edge cooling systems, customized alert sliders, and hyper-fast flash charging rates.",
    price: 42999,
    discount: 12,
    stock: 40,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/614obdQ0iYL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Shadow Gray", "Teal Breeze"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.78 inches AMOLED LTPO" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB UFS 4.0" },
      { name: "Battery", value: "5500 mAh with 100W charging" }
    ]
  },
  {
    title: "OnePlus Nord CE5",
    brand: "OnePlus",
    category: "Smartphones",
    description: "Core Edition brings all essential flagship characteristics under budget. Impossibly thin form-factor, smooth OxygenOS software, and bright clear panels.",
    price: 24999,
    discount: 8,
    stock: 0,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/61T18EfkX0L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Aqua Wave", "Matte Charcoal"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.43 inches Fluid AMOLED" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "5000 mAh with 80W flash charge" }
    ]
  },
  {
    title: "OnePlus Nord 5",
    brand: "OnePlus",
    category: "Smartphones",
    description: "Striking metallic build and elite speed. A true performance workhorse that handles gaming, workflow tasks, and video editing beautifully.",
    price: 32999,
    discount: 10,
    stock: 60,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61h53LtSVVL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Brushed Silver", "Deep Jade"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches OLED 120Hz" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5200 mAh fast fluid charging" }
    ]
  },
  {
    title: "Google Pixel 9 Pro",
    brand: "Google",
    category: "Smartphones",
    description: "The definitive Gemini AI smartphone. Features the G4 Tensor chip, professional-grade triple cameras, and revolutionary magic edits for image enhancements.",
    price: 109999,
    discount: 5,
    stock: 12,
    rating: 4.8,
    images: ["https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcStuee7AlvOCwiMdxP7zXku7Sg9ozQvAaiYQfP5tiGX6axZWDj4FT4Z3469U1Sh6Y3j3pMR0CHNRn_-R98BFrx8Dgeh2abNeb7VBaqqHEVguKuqrVkw9tED"],
    colors: ["Porcelain Beige", "Obsidian Gray"],
    sizes: ["256GB", "512GB"],
    specifications: [
      { name: "Screen Size", value: "6.3 inches Super Actua display" },
      { name: "RAM", value: "16 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4700 mAh intelligent battery" }
    ]
  },
  {
    title: "Google Pixel 9",
    brand: "Google",
    category: "Smartphones",
    description: "Pure software combined with next-gen camera processing. Premium flat layout, rounded camera visor bars, and ultra vibrant display designs.",
    price: 79999,
    discount: 0,
    stock: 25,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51Ibtg1KESL._AC_UF1000,1000_QL80_.jpg"],
    colors: ["Winterrose Pink", "Peppermint White"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.3 inches Actua Screen" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "4550 mAh with adaptive power" }
    ]
  },
  {
    title: "Google Pixel 9a",
    brand: "Google",
    category: "Smartphones",
    description: "Get pure Google experiences at a very comfortable price point. Amazing dusk and dawn photography modes, plus full secure chip protection.",
    price: 49999,
    discount: 10,
    stock: 18,
    rating: 4.4,
    images: ["https://rukminim2.flixcart.com/image/480/640/xif0q/mobile/x/b/u/-original-imahadxg2fazkzub.jpeg?q=90"],
    colors: ["Aloe Green", "Boreal Blue"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.1 inches OLED display" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "4500 mAh stable battery" }
    ]
  },
  {
    title: "Google Pixel 8a",
    brand: "Google",
    category: "Smartphones",
    description: "The AI star that fits in your hand flawlessly. Matte textures, rounded corner layouts, and exceptional real tones technology integrations.",
    price: 39999,
    discount: 15,
    stock: 20,
    rating: 4.3,
    images: ["https://www.sathya.store/img/product/Iud3jCqLql8nWt2q.jpg"],
    colors: ["Sky Aqua", "Sunset Gold"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.1 inches OLED 120Hz" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "4490 mAh dynamic charging" }
    ]
  },
  {
    title: "Nothing Phone 3",
    brand: "Nothing",
    category: "Smartphones",
    description: "The icon of transparent technical aesthetics. Re-imagined Glyph interfaces with customizable glowing strips, beautiful symmetrical bezel borders, and Nothing OS.",
    price: 49999,
    discount: 5,
    stock: 14,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71r2DTersRL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Transparent Slate", "Satin Pearl"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches OLED with LED Glyph back" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4800 mAh glyph charging sync" }
    ]
  },
  {
    title: "Nothing Phone 3a Pro",
    brand: "Nothing",
    category: "Smartphones",
    description: "Industrial chic design coupled with robust everyday efficiency. Back glass structures showcase beautiful motherboard tracing prints.",
    price: 34999,
    discount: 10,
    stock: 8,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61z7L-CrjYL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Industrial Gray", "Raw White"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches Symmetrical AMOLED" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh battery capacity" }
    ]
  },
  {
    title: "Nothing Phone 3a",
    brand: "Nothing",
    category: "Smartphones",
    description: "Uncompromised mechanical aesthetic made compact. Built for those who value unique styling, solid hardware stability, and responsive navigation feels.",
    price: 27999,
    discount: 0,
    stock: 25,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/51fqCY02DlL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Obsidian Slate", "Pure Ice"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches flexible OLED" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "5000 mAh long endurance" }
    ]
  },
  {
    title: "iQOO Neo 10",
    brand: "iQOO",
    category: "Smartphones",
    description: "The gamer chosen flagship companion. Liquid chamber cooling nodes, super computation capabilities, and blazing fast touch sampling systems.",
    price: 37999,
    discount: 8,
    stock: 23,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61IVSO-TPEL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Turbo Cyan", "Phantom Quartz"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.78 inches 144Hz LTPO AMOLED" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5100 mAh with 120W Flash" }
    ]
  },
  {
    title: "iQOO Z10 Turbo",
    brand: "iQOO",
    category: "Smartphones",
    description: "Incredible battery stamina in a highly competitive bracket. Super lightweight, massive juice reserves, and brilliant responsive visuals.",
    price: 24999,
    discount: 5,
    stock: 0,
    rating: 4.3,
    images: [
      "https://m.media-amazon.com/images/I/61WM6IDaBPL._AC_UY327_FMwebp_QL65_.jpg",
      "https://m.media-amazon.com/images/I/61cwB-UmBQL._AC_UY327_FMwebp_QL65_.jpg"
    ],
    colors: ["Aero Blue", "Stardust White"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.72 inches 144Hz display" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "6000 mAh battery monster" }
    ]
  },
  {
    title: "iQOO 13",
    brand: "iQOO",
    category: "Smartphones",
    description: "Unparalleled computation speeds. Loaded with premium audio systems, custom vibration motors, and stunning immersive displays.",
    price: 54999,
    discount: 10,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61aNM4NFSLL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Viper Orange", "Metallic Iron"],
    sizes: ["256GB", "512GB"],
    specifications: [
      { name: "Screen Size", value: "6.78 inches 2K AMOLED" },
      { name: "RAM", value: "16 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh 120W flash charge" }
    ]
  },
  {
    title: "Realme GT 7",
    brand: "Realme",
    category: "Smartphones",
    description: "Unleash super speeds in a sportscar design theme. Elegant racetrack-like stripes, micro-curved panel designs, and advanced cooling layouts.",
    price: 36999,
    discount: 10,
    stock: 15,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61QluKITDiL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Racetrack Gold", "Satin Emerald"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.74 inches AMOLED 144Hz" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5200 mAh quick charge" }
    ]
  },
  {
    title: "Realme P4 Pro",
    brand: "Realme",
    category: "Smartphones",
    description: "Enjoy flawless portrait captures and stellar visual screen experiences. Beautiful curved glass borders and ultra thin chassis profiles.",
    price: 26999,
    discount: 5,
    stock: 22,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/51Ct5PVR2XL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Feather Blue", "Velvet Black"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches OLED curved display" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh dual-cell build" }
    ]
  },
  {
    title: "Realme Narzo 80 Pro",
    brand: "Realme",
    category: "Smartphones",
    description: "Gaming performance meets extreme battery lifespans. Loaded with high touch-sensitivity screens and brilliant starry gradient cases.",
    price: 19999,
    discount: 10,
    stock: 35,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/71J+dpjrzhL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Cyber Crimson", "Neo Green"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.67 inches OLED display" },
      { name: "RAM", value: "6 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "5000 mAh speedy charge" }
    ]
  },
  {
    title: "Redmi Note 15 Pro+",
    brand: "Redmi",
    category: "Smartphones",
    description: "Redefining high megapixel portrait photographic norms. Includes customized 200MP detail captures, IP68 element protections, and high speed recharging blocks.",
    price: 32999,
    discount: 12,
    stock: 14,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/81pHku2Z4KL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Glow Violet", "Graphite Dark"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.67 inches curved AMOLED" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh with 120W turbo" }
    ]
  },
  {
    title: "Redmi Note 15 Pro",
    brand: "Redmi",
    category: "Smartphones",
    description: "Enjoy brilliant balances of raw hardware compute speeds and massive battery cycles. Complete flat rail bounds and premium matte finish shields.",
    price: 27999,
    discount: 8,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/81uGa3uCO1L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Satin Silver", "Midnight Sky"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.67 inches Full HD AMOLED" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5100 mAh reliable build" }
    ]
  },
  {
    title: "Redmi 14C 5G",
    brand: "Redmi",
    category: "Smartphones",
    description: "Fast 5G capabilities made for absolute value. Built with generous displays, responsive touch configurations, and dependable power components.",
    price: 11999,
    discount: 5,
    stock: 50,
    rating: 4.1,
    images: ["https://m.media-amazon.com/images/I/71hOqmhz9RL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Aero Mint", "Carbon Obsidian"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.74 inches IPS LCD 90Hz" },
      { name: "RAM", value: "6 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "5000 mAh stable capacity" }
    ]
  },
  {
    title: "POCO F7 Pro",
    brand: "POCO",
    category: "Smartphones",
    description: "Raw computer speed tailored for hard-core gamers. Yellow themed accent outlines, highly optimized processor setups, and rapid liquid vapour integrations.",
    price: 34999,
    discount: 10,
    stock: 16,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/41ct9AkF+xL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Hyper Yellow", "Graphite Armor"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.67 inches flow WQHD AMOLED" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh with 90W fast charging" }
    ]
  },
  {
    title: "POCO X7 Pro",
    brand: "POCO",
    category: "Smartphones",
    description: "Incredible price-to-performance ratio. Immersive bezel borders, beautiful high dynamic contrast ratios, and stellar cooling channels.",
    price: 28999,
    discount: 12,
    stock: 22,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/51ptsuXotVL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Steel Gray", "Turbo Black"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.67 inches fluid AMOLED 120Hz" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh with 67W charging" }
    ]
  },
  {
    title: "POCO C75 5G",
    brand: "POCO",
    category: "Smartphones",
    description: "Enter the world of blazing fast connection rates on a pocket comfortable layout. Features highly durable polycarbonate designs and massive panels.",
    price: 9999,
    discount: 0,
    stock: 40,
    rating: 4.0,
    images: ["https://m.media-amazon.com/images/I/61+i423decL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Forest Green", "Shadow Gray"],
    sizes: ["128GB"],
    specifications: [
      { name: "Screen Size", value: "6.88 inches large screen display" },
      { name: "RAM", value: "4 GB" },
      { name: "Storage", value: "128 GB" },
      { name: "Battery", value: "5160 mAh large cell battery" }
    ]
  },
  {
    title: "Oppo Reno 15 Pro",
    brand: "Oppo",
    category: "Smartphones",
    description: "The portrait master of the era. Built with shimmering glass cases, specialized optical zoom layers, and glowing notifications circles.",
    price: 47999,
    discount: 10,
    stock: 12,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71VWcXhbWAL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Starry Blue", "Satin Pearl"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches curved OLED screen" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4800 mAh with ultra charging" }
    ]
  },
  {
    title: "Oppo Reno 15",
    brand: "Oppo",
    category: "Smartphones",
    description: "Striking lightweight body combined with ultra vibrant camera performance metrics. Comfortable feel, elegant metallic sides, and long-lasting runtime capabilities.",
    price: 39999,
    discount: 8,
    stock: 25,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71u29EnA+dL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Glow Pink", "Oceanic Green"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.7 inches standard OLED" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4800 mAh reliable cell" }
    ]
  },
  {
    title: "Vivo V60 Pro",
    brand: "Vivo",
    category: "Smartphones",
    description: "Aura smart light portrait captures meet Zeiss optical details. Perfect color calibrations, incredibly thin curved bodies, and dazzling premium displays.",
    price: 44999,
    discount: 5,
    stock: 15,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/616NNYd1PfL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Majestic Black", "Jade Glow"],
    sizes: ["256GB"],
    specifications: [
      { name: "Screen Size", value: "6.78 inches 3D curved display" },
      { name: "RAM", value: "12 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "4700 mAh slim design battery" }
    ]
  },
  {
    title: "Vivo T5 Ultra",
    brand: "Vivo",
    category: "Smartphones",
    description: "Uncompromised gaming and computing speeds. Beautiful futuristic camera housing block and ultra-dense bright high-frequency responsive display.",
    price: 31999,
    discount: 10,
    stock: 20,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/719V0QoFnlL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Quantum Gray", "Breeze Cyan"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.67 inches flat high-res display" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh quick flash charge" }
    ]
  },
  {
    title: "Motorola Edge 60 Stylus",
    brand: "Motorola",
    category: "Smartphones",
    description: "Unleash extreme creative freedom on the go. Stylus integrated, premium clean software experience, and highly responsive audio systems.",
    price: 22999,
    discount: 8,
    stock: 18,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/61UTyZA5rdL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Cosmic Emerald", "Satin Bronze"],
    sizes: ["128GB", "256GB"],
    specifications: [
      { name: "Screen Size", value: "6.8 inches Max Vision display with Active Stylus" },
      { name: "RAM", value: "8 GB" },
      { name: "Storage", value: "256 GB" },
      { name: "Battery", value: "5000 mAh persistent battery life" }
    ]
  }
];

const KITCHEN_APPLIANCES_DATA = [
  {
    title: "Air Fryer XL 6.5L",
    brand: "Philips",
    category: "Kitchen Appliances",
    description: "Savor healthier, delicious meals with the Philips Air Fryer XL 6.5L. Utilizing rapid air technology, it fries with up to 90% less fat while maintaining a crispy exterior and tender interior.",
    price: 9999,
    discount: 10,
    stock: 24,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/41Vtl0Hk40L._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Glossy Black", "Midnight Silver"],
    sizes: ["6.5L"],
    specifications: [
      { name: "Capacity", value: "6.5 Liters" },
      { name: "Power", value: "1800 Watts" },
      { name: "Technology", value: "Rapid Air Circulation" }
    ]
  },
  {
    title: "Digital Air Fryer 5L",
    brand: "Instant Pot",
    category: "Kitchen Appliances",
    description: "Your perfect cooking companion. The Instant Pot Digital Air Fryer 5L offers a touch-screen panel with 6 customizable pre-set programs, making guilt-free roasting, baking, and reheating effortless.",
    price: 7999,
    discount: 15,
    stock: 18,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/41gIeiw-M3L._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Classic Black", "Stainless Steel"],
    sizes: ["5L"],
    specifications: [
      { name: "Capacity", value: "5.0 Liters" },
      { name: "Pre-sets", value: "6 One-touch programs" },
      { name: "Power", value: "1500 Watts" }
    ]
  },
  {
    title: "Smart Microwave Oven 28L",
    brand: "Samsung",
    category: "Kitchen Appliances",
    description: "Modern kitchen utility at its best. Samsung Smart Microwave Oven 28L provides intelligent sensor cooking, ceramic enamel interior for easy cleaning, and eco mode for power-efficient operations.",
    price: 14999,
    discount: 12,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/41CnufuNePL._SX342_SY445_QL70_FMwebp_.jpg"],
    colors: ["Charcoal Black", "Metallic Gray"],
    sizes: ["28L"],
    specifications: [
      { name: "Capacity", value: "28 Liters" },
      { name: "Type", value: "Convection & Grill Slim" },
      { name: "Power Usage", value: "2900 Watts" }
    ]
  },
  {
    title: "Convection Microwave 25L",
    brand: "LG",
    category: "Kitchen Appliances",
    description: "Achieve gourmet cooking results at home with LG Convection Microwave 25L. Features autocook menus, stainless steel cavity, smart diagnostics, and elegant touch dials.",
    price: 12999,
    discount: 8,
    stock: 12,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71X4oAhYufL._SX679_.jpg"],
    colors: ["Noble Black", "Silver Satin"],
    sizes: ["25L"],
    specifications: [
      { name: "Capacity", value: "25 Liters" },
      { name: "Material", value: "Stainless Steel Cavity" },
      { name: "Features", value: "Auto-Cook Menus" }
    ]
  },
  {
    title: "Mixer Grinder Elite 750W",
    brand: "Prestige",
    category: "Kitchen Appliances",
    description: "Tackle tough grinding chores flawlessly with Prestige Mixer Grinder Elite. Equipped with a heavy-duty 750W motor, three robust stainless steel jars, and speed overload protectors.",
    price: 4999,
    discount: 5,
    stock: 22,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/41FpXnefBcL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Classic White-Blue", "Vibrant Red"],
    sizes: ["Standard"],
    specifications: [
      { name: "Power", value: "750 Watts" },
      { name: "Jars Included", value: "3 Stainless Steel Jars" },
      { name: "Motor Speed", value: "20,000 RPM" }
    ]
  },
  {
    title: "Nutri Blender Pro",
    brand: "NutriBullet",
    category: "Kitchen Appliances",
    description: "Supercharge your wellness routine. The NutriBullet Nutri Blender Pro extracts vital nutrients with high-torque motor power, stainless steel extractor blades, and travel-friendly cups.",
    price: 6999,
    discount: 10,
    stock: 30,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/413oHCG+YKL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Matte Gray", "Champagne Gold"],
    sizes: ["900ml"],
    specifications: [
      { name: "Motor Power", value: "900 Watts" },
      { name: "Cup Sizes", value: "900ml & 700ml" },
      { name: "Blade Material", value: "Stainless Steel" }
    ]
  },
  {
    title: "PowerMix Blender 1200W",
    brand: "Philips",
    category: "Kitchen Appliances",
    description: "Blend everything from soft berries to hardest nuts. The Philips PowerMix Blender 1200W features ProBlend 6 technology, variable speed control, and a robust shockproof body.",
    price: 5999,
    discount: 15,
    stock: 25,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/41gm24K4nhL._SX300_SY300_QL70_FMwebp_.jpg"],
    colors: ["Obsidian Black", "Arctic White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Power", value: "1200 Watts" },
      { name: "Blade Tech", value: "ProBlend 6 Star" },
      { name: "Speed Control", value: "Multi-speed with Pulse" }
    ]
  },
  {
    title: "Electric Rice Cooker 2L",
    brand: "Panasonic",
    category: "Kitchen Appliances",
    description: "Cook fluffy white rice, delicious quinoa, or steamed veggies with Panasonic Electric Rice Cooker 2L. Includes convenient auto warm-keep mode and an anodized aluminum pan.",
    price: 3999,
    discount: 8,
    stock: 14,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61eQ0InY0PL._SX679_.jpg"],
    colors: ["Sleek Silver", "Apple White"],
    sizes: ["2L"],
    specifications: [
      { name: "Capacity", value: "2.0 Liters" },
      { name: "Features", value: "Automatic Keep Warm" },
      { name: "Pan Type", value: "Anodized Aluminum" }
    ]
  },
  {
    title: "Smart Rice Cooker 3L",
    brand: "Xiaomi",
    category: "Kitchen Appliances",
    description: "Take control of your meals via Mi Home App. Xiaomi Smart Rice Cooker 3L utilizes electromagnetic IH heating, precise heat regulation algorithms, and a non-stick cast iron inner pot.",
    price: 5499,
    discount: 10,
    stock: 19,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/31ngy4x6FQL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Minimalist White"],
    sizes: ["3L"],
    specifications: [
      { name: "Capacity", value: "3.0 Liters" },
      { name: "Heating", value: "Induction Heating (IH)" },
      { name: "Smart Controls", value: "Mi Home App Wi-Fi Enabled" }
    ]
  },
  {
    title: "Electric Kettle 1.8L",
    brand: "Havells",
    category: "Kitchen Appliances",
    description: "Boil water in minutes with Havells Electric Kettle 1.8L. Boasts double-wall heat insulation, stainless steel inner body, auto dry-boil cutoff, and an elegant 360-degree swivel base.",
    price: 1999,
    discount: 20,
    stock: 45,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/31+x+lBVMvL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Mint Green", "Steel Gray"],
    sizes: ["1.8L"],
    specifications: [
      { name: "Capacity", value: "1.8 Liters" },
      { name: "Insulation", value: "Double Wall Cool Touch" },
      { name: "Body Material", value: "Food Grade 304 Stainless Steel" }
    ]
  },
  {
    title: "Stainless Steel Toaster 2 Slice",
    brand: "Morphy Richards",
    category: "Kitchen Appliances",
    description: "Perfect browning every single morning. Morphy Richards Stainless Steel Toaster features 2 extra-wide slots, defrost and reheat controls, and a slide-out crumb tray.",
    price: 2499,
    discount: 12,
    stock: 35,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/41uldtJO3DL._SY300_SX300_QL70_FMwebp_.jpg"],
    colors: ["Brushed Red", "Polished Chrome"],
    sizes: ["2-Slice"],
    specifications: [
      { name: "Slots", value: "2 Extra-Wide Slots" },
      { name: "Settings", value: "7 Browning Levels" },
      { name: "Controls", value: "Defrost, Reheat, Cancel" }
    ]
  },
  {
    title: "Sandwich Maker Pro",
    brand: "Prestige",
    category: "Kitchen Appliances",
    description: "Enjoy perfectly sealed hot sandwiches with Prestige Sandwich Maker Pro. Coated with oil-free non-stick grill plates, featuring cool touch handle grips, and neon indicators.",
    price: 2299,
    discount: 15,
    stock: 40,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/81zn96gBHYL._SX679_.jpg"],
    colors: ["Carbon Matte Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Plates", value: "Fixed Non-stick Grilling Plates" },
      { name: "Handles", value: "Heat-Resistant Cool Touch" },
      { name: "Indicators", value: "Red/Green LED Status" }
    ]
  },
  {
    title: "Induction Cooktop 2200W",
    brand: "Philips",
    category: "Kitchen Appliances",
    description: "High power fast heating induction cooker. Philips 2200W Induction Cooktop offers digital sensor touch keys, customized Indian cooking pre-sets, and automated child-lock safety.",
    price: 3999,
    discount: 10,
    stock: 28,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71rTVe9WlDL._SX679_.jpg"],
    colors: ["Futuristic Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Power", value: "2200 Watts" },
      { name: "Operation", value: "Feather Touch Sensor Controls" },
      { name: "Safety", value: "Auto-Off / Child Lock" }
    ]
  },
  {
    title: "Infrared Induction Cooker",
    brand: "Pigeon",
    category: "Kitchen Appliances",
    description: "Versatile alternative to electromagnetic induction cookers. Works with all types of flat-bottom cookware. Features a microcrystalline plate, dual ring thermal power control, and elegant LED readout.",
    price: 2999,
    discount: 5,
    stock: 20,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/410EEbEgjFL._SX342_SY445_QL70_FMwebp_.jpg"],
    colors: ["Sleek Crimson Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Type", value: "Infrared Radiant Heating" },
      { name: "Compatibility", value: "Works with all flat bottom utensils (Cast Iron, Aluminium, Stainless Steel)" },
      { name: "Power", value: "2000 Watts" }
    ]
  },
  {
    title: "Espresso Coffee Machine",
    brand: "De'Longhi",
    category: "Kitchen Appliances",
    description: "Unleash your inner barista. De'Longhi Espresso Coffee Machine delivers highly-pressurized 15-bar pump extraction, a manual cappuccino system frother, and a durable heavy-duty copper boiler.",
    price: 29999,
    discount: 18,
    stock: 8,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/71k67IjhkbL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Polished Metallic Jet"],
    sizes: ["Premium Barista"],
    specifications: [
      { name: "Pump Pressure", value: "15 Bar Professional" },
      { name: "Frothing System", value: "Adjustable Cappuccino Steam Jet" },
      { name: "Boiler", value: "Heavy duty copper single thermoblock" }
    ]
  },
  {
    title: "Drip Coffee Maker",
    brand: "Philips",
    category: "Kitchen Appliances",
    description: "Wake up to freshly-brewed, aromatic filter coffee. The Philips Drip Coffee Maker features an aroma twister smart nozzle, 1.2L glass jug brewing, and simple drip-stop mechanism.",
    price: 4999,
    discount: 15,
    stock: 15,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61K3TCii4jL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Obsidian"],
    sizes: ["1.2L"],
    specifications: [
      { name: "Capacity", value: "1.2 Liters (approx 10-15 cups)" },
      { name: "Features", value: "Aroma Twister / Automated Anti-Drip" },
      { name: "Filter Type", value: "Washable mesh filter" }
    ]
  },
  {
    title: "Dishwasher 14 Place Settings",
    brand: "Bosch",
    category: "Kitchen Appliances",
    description: "Take the stress out of after-meal cleaning. Bosch Dishwasher with 14 Place Settings offers a dedicated intensive Kadhai zone, water softener filter, and extremely quiet EcoSilence drive.",
    price: 54999,
    discount: 10,
    stock: 11,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71PY9hGPiZL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Steel Grey"],
    sizes: ["14 Place"],
    specifications: [
      { name: "Place Settings", value: "14 Place Settings capacity" },
      { name: "Noise Level", value: "44 dB ultra-quiet" },
      { name: "Programs", value: "6 wash cycles with 3 options" }
    ]
  },
  {
    title: "Automatic Food Processor",
    brand: "KitchenAid",
    category: "Kitchen Appliances",
    description: "The premier multi-tasking prep system. KitchenAid Automatic Food Processor simplifies chopping, shredding, slicing, and dough-kneading operations with automated touch controls.",
    price: 18999,
    discount: 15,
    stock: 7,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/61GpyHHQXML._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Empire Red", "Contour Silver"],
    sizes: ["2.1L"],
    specifications: [
      { name: "Bowl Capacity", value: "2.1 Liters" },
      { name: "Blade attachments", value: "Slicing, Shredding, Kneading blades included" },
      { name: "Speed options", value: "Low, High, and Pulse" }
    ]
  },
  {
    title: "Electric Chimney 90cm",
    brand: "Faber",
    category: "Kitchen Appliances",
    description: "Maintain a clean, oil-free cooking atmosphere with Faber Electric Chimney 90cm. Boasts powerful 6-way suction capacity, modern filterless auto-clean systems, and elegant tactile touch controls.",
    price: 15999,
    discount: 25,
    stock: 10,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/31latMNTPCL._SX342_SY445_QL70_FMwebp_.jpg"],
    colors: ["Satin Silver & Tempered Glass"],
    sizes: ["90cm"],
    specifications: [
      { name: "Suction Power", value: "1200 m3/h" },
      { name: "Size", value: "90 cm" },
      { name: "Technology", value: "Auto-Clean Filterless Design" }
    ]
  },
  {
    title: "RO Water Purifier",
    brand: "Kent",
    category: "Kitchen Appliances",
    description: "Ensure crystal pure mineral-rich water for your family. Kent RO Water Purifier incorporates a 7-stage RO+UV+UF+TDS purification system paired with a healthy mineral booster cartridge.",
    price: 13999,
    discount: 10,
    stock: 14,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/51QKssxgAyL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Lucid White Blue"],
    sizes: ["8L"],
    specifications: [
      { name: "Purification Stage", value: "7 Stage Hybrid Filtration" },
      { name: "Storage Volume", value: "8 Liters with Level Indicator" },
      { name: "TDS Control", value: "Active TDS Controller mineral manager" }
    ]
  }
];

const HOME_DECOR_DATA = [
  {
    title: "Modern Wall Clock",
    brand: "Seiko",
    category: "Home Decor",
    price: 1999,
    discount: 0,
    stock: 45,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71uxvwfcuiL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Warm Oak Wood", "Modern Charcoal"],
    sizes: ["12 inches"],
    description: "Add a touch of contemporary elegance to your wall with the Seiko Modern Wall Clock. Featuring a sleek, minimalist analog face with silent hand movement and premium wood accents, perfect for the living room, office, or bedroom.",
    specifications: [
      { name: "Sub-category", value: "Wall Decor" },
      { name: "Design Style", value: "Modern Minimalist" },
      { name: "Power Source", value: "1 AA Battery (not included)" }
    ]
  },
  {
    title: "Decorative Metal Wall Art",
    brand: "Art Street",
    category: "Home Decor",
    price: 3499,
    discount: 10,
    stock: 25,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/81wS8rdmh0L._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Metallic Gold & Amber", "Bronze Finish"],
    sizes: ["Standard 24x36 inches"],
    description: "Elevate your empty walls with this stunning geometric metal wall sculpture. Handcrafted with heavy duty rust-proof metal alloy and completed with luxury golden and rust glaze elements, it makes a premium art statement.",
    specifications: [
      { name: "Sub-category", value: "Wall Decor" },
      { name: "Material", value: "Premium Rust-Proof Alloy" },
      { name: "Craftsmanship", value: "Handmade Geometric Metal Accent" }
    ]
  },
  {
    title: "LED Moon Lamp",
    brand: "Generic",
    category: "Home Decor",
    price: 1299,
    discount: 15,
    stock: 50,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71Hpi3edUZL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Glow White & Lunar Yellow"],
    sizes: ["15 cm Sphere"],
    description: "Experience the calming serenity of the moon in your bedroom. This 3D-realistic texture LED Moon Lamp features adjustable brightness levels, multiple white-to-warm light hue settings, and is supported by an elegant solid wood base stand.",
    specifications: [
      { name: "Sub-category", value: "Lighting Decor" },
      { name: "Illumination Source", value: "LED with touch dimming" },
      { name: "Charging Port", value: "USB rechargeable lithium-ion battery" }
    ]
  },
  {
    title: "Ceramic Flower Vase Set",
    brand: "Homesake",
    category: "Home Decor",
    price: 1799,
    discount: 5,
    stock: 35,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/813Kzy7rfqL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Earthy Terracotta", "Off-White Glaze"],
    sizes: ["Assorted Multi-Size Trio"],
    description: "A beautifully curated trio of abstract hand-carved ceramic vases. Showcases highly textured ribbing patterns and organic clay details. Ideal to pair with dried pampas grass, fresh-cut garden flowers, or as stand-alone accents.",
    specifications: [
      { name: "Sub-category", value: "Vase & Planters" },
      { name: "Material", value: "Eco-friendly Teracotta Clay" },
      { name: "Set Contents", value: "3 uniquely shaped ceramic vases" }
    ]
  },
  {
    title: "Artificial Plant with Pot",
    brand: "Ugaoo",
    category: "Home Decor",
    price: 899,
    discount: 8,
    stock: 60,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/81Qpg860CwL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Vivid Emerald Green", "Spring Olive"],
    sizes: ["Medium 18 inches"],
    description: "Introduce lively refreshing nature without the upkeep. This highly realistic artificial faux indoor leafy plant is pre-potted in a premium white melamine flower pot with gravel mulch on the soil base.",
    specifications: [
      { name: "Sub-category", value: "Indoor Decor" },
      { name: "Plant Species", value: "Ficus lyrata / Fiddle leaf Fig Faux" },
      { name: "Planter Material", value: "Durable Melamine Pot" }
    ]
  },
  {
    title: "Nordic Table Lamp",
    brand: "Philips",
    category: "Home Decor",
    price: 2999,
    discount: 12,
    stock: 40,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71xomxwBxNL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Warm Ivory Fabric & Beech Wood"],
    sizes: ["Bedside Compact"],
    description: "Add cozy Scandinavian ambiance to your bedside table or reading armchair. The Philips Nordic table lamp features an elegant textured canvas drum shade and a pristine handcrafted solid ash-wood tripod structure.",
    specifications: [
      { name: "Sub-category", value: "Lighting Decor" },
      { name: "Lamp Base", value: "Heavy-duty Solid Beachwood" },
      { name: "Socket Type", value: "E27 Standard Holder" }
    ]
  },
  {
    title: "Decorative Throw Pillow Set (2)",
    brand: "Solimo",
    category: "Home Decor",
    price: 1199,
    discount: 0,
    stock: 75,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71RQbWpMpkL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Navy Blue Geo", "Mustard Yellow Herringbone"],
    sizes: ["Square 16x16 inches"],
    description: "Spruce up your couch or master bed. This pair of plush accent throw pillows is crafted with geometric self-weave patterns in ultra-durable premium cotton covers. Includes premium hypoallergenic inserts.",
    specifications: [
      { name: "Sub-category", value: "Cushions" },
      { name: "Cover Material", value: "100% Breathable Weave Cotton" },
      { name: "Fill", value: "Premium high-resilience microfiber" }
    ]
  },
  {
    title: "Macrame Wall Hanging",
    brand: "CraftVatika",
    category: "Home Decor",
    price: 1499,
    discount: 10,
    stock: 30,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61T8r3dNf9L._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Off-White", "Sage Green Accent"],
    sizes: ["18 x 32 inches"],
    description: "Add cozy boho-chic warmth to your bedroom or infant nursery space. Intricately hand-knotted by professional local artisans using sustainable unbleached organic cotton threads mounted on a clean solid birch dowel rod.",
    specifications: [
      { name: "Sub-category", value: "Boho Decor" },
      { name: "Knotting Material", value: "100% Organic Cotton Thread" },
      { name: "Mounting type", value: "Durable Beechwood Dowel with Hanging Cord" }
    ]
  },
  {
    title: "Wooden Floating Shelves Set",
    brand: "FurniCraft",
    category: "Home Decor",
    price: 2499,
    discount: 15,
    stock: 28,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/51IRSXmVEVL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Rustic Walnut", "Natural Pale Pine"],
    sizes: ["3-Tier Assorted Lengths"],
    description: "Showcase books, photographs, or crystals elegantly while saving precious floor space. This set of 3 heavy-duty wooden floating shelves is dry-kiln seasoned and polished in elegant stain finishes. Comes with strong hidden brackets.",
    specifications: [
      { name: "Sub-category", value: "Wall Storage" },
      { name: "Wood Grade", value: "Premium Hard Pine Wood" },
      { name: "Maximum Support", value: "Up to 8 kg load capacity per shelf" }
    ]
  },
  {
    title: "Aroma Diffuser with LED Light",
    brand: "AGARO",
    category: "Home Decor",
    price: 1999,
    discount: 5,
    stock: 42,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/613nFpV+u-L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Light Wood Grain", "Dark Mocha Wood"],
    sizes: ["300ml Reservoir"],
    description: "Immerse your living space in therapeutic essential oil misting. The AGARO mist oil diffuser operates silently utilizing advanced ultrasonic cold-mist technology and is accented with beautiful glowing 7-color ambient LEDs.",
    specifications: [
      { name: "Sub-category", value: "Fragrance Decor" },
      { name: "Mechanism", value: "Ultrasonic vibration (no heat)" },
      { name: "Safety Feature", value: "Auto-shutoff on empty water reservoir" }
    ]
  },
  {
    title: "Decorative Buddha Statue",
    brand: "eCraftIndia",
    category: "Home Decor",
    price: 2299,
    discount: 10,
    stock: 34,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/819U0uCE2EL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Oxidized Copper Gold", "Silver Teal Metallic"],
    sizes: ["9 x 6 inches"],
    description: "Cultivate serenity and calm, positive energy within your foyer, study, or desktop. High-detail meditating Gautama Buddha statue handcrafted from robust cast polyresin and completed with detailed warm antique copper highlights.",
    specifications: [
      { name: "Sub-category", value: "Spiritual Decor" },
      { name: "Material", value: "Durable Polyresin Compound" },
      { name: "Finish Type", value: "Weatherproof Electroplate Painting" }
    ]
  },
  {
    title: "Luxury Area Rug 5x7 ft",
    brand: "Status",
    category: "Home Decor",
    price: 4999,
    discount: 20,
    stock: 18,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/81qnKhGayqL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Medallion Emerald Blue", "Vintage Rust Beige"],
    sizes: ["Large 5 x 7 Feet"],
    description: "Indulge in ultra-soft walk-on comfort. Our Persian-heritage luxury rug contains a high-density weave of premium polypropylene threads with complex traditional motifs. Complete with robust reinforced non-slip latex base coating.",
    specifications: [
      { name: "Sub-category", value: "Rugs & Carpets" },
      { name: "Weave Density", value: "Standard 800 GSM plush fiber pile" },
      { name: "Backing", value: "Anti-slip eco rubber grip" }
    ]
  },
  {
    title: "Gold Finish Photo Frame Set",
    brand: "Giftana",
    category: "Home Decor",
    price: 1599,
    discount: 5,
    stock: 55,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/41Q339dGbiL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Champagne Gold Metallic"],
    sizes: ["5-Piece Gallery Pack"],
    description: "Create a curated statement wall of your beloved memories. This set of 5 luxurious champagne-gold finished photo frames includes multi-size mats and hooks for both hanging directions. Backed by crystal-clear acrylic sheets.",
    specifications: [
      { name: "Sub-category", value: "Photo Frames" },
      { name: "Set Count", value: "5 Premium photo frames (Various sizes)" },
      { name: "Glazing Material", value: "High-transparency Plexiglass panels" }
    ]
  },
  {
    title: "Crystal Candle Holder Set",
    brand: "ExclusiveLane",
    category: "Home Decor",
    price: 1799,
    discount: 0,
    stock: 22,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71zLNNMZsqL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Clear Diamond Crystal"],
    sizes: ["Heavy pillars tall"],
    description: "Set the perfect high-class dramatic mood for special dinners. This pair of heavyweight crystal candlesticks refracts bright warm candle flames beautifully into thousands of lovely glistening reflections.",
    specifications: [
      { name: "Sub-category", value: "Candle Holders" },
      { name: "Structure", value: "Faceted premium lead-free leaden glass" },
      { name: "Pair Set", value: "2 individual tall candlestick pillars" }
    ]
  },
  {
    title: "Artificial Bonsai Tree",
    brand: "Fourwalls",
    category: "Home Decor",
    price: 1299,
    discount: 10,
    stock: 38,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61v6F+9SCQL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Fiddle Leaf Olive Moss"],
    sizes: ["Mini Table Bonsai"],
    description: "Bring the majestic ancient beauty of a miniature Japanese juniper bonsai to your shelf. Never needs pruning, watering, or sunlight. Housed elegantly in a black ceramic planter container layered with actual washed river stones.",
    specifications: [
      { name: "Sub-category", value: "Indoor Decor" },
      { name: "Plant Species", value: "Faux Japanese Juniper Bonsai" },
      { name: "Base Stand", value: "Melamine gloss-finish black bowl" }
    ]
  },
  {
    title: "Wooden Console Table Decor Set",
    brand: "Home Centre",
    category: "Home Decor",
    price: 3999,
    discount: 15,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71jhnKHEN+L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Natural Burnt Honey Mango Wood"],
    sizes: ["Trio Sculptures"],
    description: "Infuse modern artisanal craftsmanship into your entryway console table or TV console cabinet. Exhibits three rustic solid mango-wood geometric interlocking hoops on sturdy black powder metal frames.",
    specifications: [
      { name: "Sub-category", value: "Table Decor" },
      { name: "Material Base", value: "100% Solid Mango Wood" },
      { name: "Unit Count", value: "3 nested geometric wood sculptures" }
    ]
  },
  {
    title: "Abstract Canvas Wall Painting",
    brand: "Art Lounge",
    category: "Home Decor",
    price: 2999,
    discount: 10,
    stock: 20,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/71sUn2qgItL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Neutral Khaki Beige & Gold"],
    sizes: ["Medium 30x40 cm"],
    description: "Enrich your lounge walls under a high-class, gallery-wrapped Giclée art prints layout. Showcases deep textures of beige oils, charcoal shapes, and manually integrated hand-placed metallic golden accent foil flakes.",
    specifications: [
      { name: "Sub-category", value: "Wall Art" },
      { name: "Print Type", value: "Water-proof UV pigment ink" },
      { name: "Strecher material", value: "Seasoned heavy pinewood spacer bar" }
    ]
  },
  {
    title: "Decorative Mirror with Metal Frame",
    brand: "HomeTown",
    category: "Home Decor",
    price: 5999,
    discount: 18,
    stock: 12,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/71-c3RZRfmL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Antique Matte Gold"],
    sizes: ["Round 24 inches"],
    description: "Add light and depth spaciousness inside your foyer. Centered with an ultra-clear, silver-backed reflection glass enclosed inside a magnificent sunburst forged iron metal frame with rust powder coatings.",
    specifications: [
      { name: "Sub-category", value: "Mirrors" },
      { name: "Glass Type", value: "4mm Premium HD float silver glass" },
      { name: "Framing", value: "Rust-resistance powder finished geometric iron rods" }
    ]
  },
  {
    title: "Luxury Curtain Set",
    brand: "Story@Home",
    category: "Home Decor",
    price: 2499,
    discount: 5,
    stock: 48,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71fbk-b5ObL._AC_SX416_CB1169409_QL70_.jpg"],
    colors: ["Steel Gray", "Dusty Rose Pink"],
    sizes: ["Long Door 9 Feet"],
    description: "Sip coffee or rest in beautiful ambient shade. Intricately fabricated using high-density thick tri-layer weave technology to shut out cold air drafts, sound waves, and blocking out 90% solar light rays.",
    specifications: [
      { name: "Sub-category", value: "Curtains" },
      { name: "Material", value: "Premium Solid Satin fabric blends (280 GSM)" },
      { name: "Grommet Set", value: "8 Rust-proof stainless steel eyelets per curtain" }
    ]
  },
  {
    title: "Indoor Water Fountain",
    brand: "Chitra Handicraft",
    category: "Home Decor",
    price: 6999,
    discount: 12,
    stock: 10,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/81r7BThx+iL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Natural Sandstone Brown"],
    sizes: ["Standard Tabletop"],
    description: "Enjoy the peaceful, stress-relieving sound of gently cascading water. Designed with cascading multi-level stone bowls, an energy-efficient subterranean water pump, and luminous warm white water LEDs.",
    specifications: [
      { name: "Sub-category", value: "Decorative Fountain" },
      { name: "Pump Motor", value: "Fully submersible energy silent water pump" },
      { name: "Safety standard", value: "Shockproof low-voltage waterproof LED and cords" }
    ]
  }
];

const HEADPHONES_DATA = [
  {
    title: "AirPods Max 2",
    brand: "Apple",
    category: "Headphones",
    description: "The ultimate over-ear listening experience. AirPods Max 2 features a custom acoustic design, high-fidelity audio powered by the H2 chip, and industry-leading Active Noise Cancellation with Transparency mode.",
    price: 59999,
    discount: 5,
    stock: 12,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71ncxKR-6OL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Space Gray", "Silver", "Midnight", "Starlight"],
    sizes: ["Standard"],
    specifications: [
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Noise Cancellation", value: "Active Noise Cancellation & Transparency Mode" },
      { name: "Battery Life", value: "Up to 20 hours with ANC enabled" },
      { name: "Audio Engine", value: "Apple H2 Headphone Chip" }
    ]
  },
  {
    title: "WH-1000XM6",
    brand: "Sony",
    category: "Headphones",
    description: "The new benchmark in premium noise cancellation. Sony WH-1000XM6 features next-level proprietary ANC processors, personalized audio optimization, and exceptional high-res audio performance.",
    price: 34999,
    discount: 8,
    stock: 20,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/71Q-uiqUGSL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Black", "Silver", "Navy Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Noise Cancellation", value: "Industry-leading Dual Noise Sensor technology" },
      { name: "Driver Unit", value: "40mm, dome type (CCAW Voice Coil)" },
      { name: "Battery Life", value: "Up to 40 hours with ANC" },
      { name: "Bluetooth Codecs", value: "LDAC, AAC, SBC" }
    ]
  },
  {
    title: "WH-CH720N",
    brand: "Sony",
    category: "Headphones",
    description: "Lightweight wireless noise-canceling headphones designed for long-lasting comfort. Enjoy exceptional audio performance and advanced voice pickup.",
    price: 9999,
    discount: 10,
    stock: 25,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/61O3iMlnJIL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "White", "Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Noise Cancellation", value: "Integrated V1 Processor Active Noise Cancellation" },
      { name: "Weight", value: "192g Ultra-lightweight Design" },
      { name: "Battery Life", value: "Up to 35 hours (ANC ON), 50 hours (ANC OFF)" },
      { name: "Quick Charge", value: "3-minute charge gives up to 1 hour of playback" }
    ]
  },
  {
    title: "QuietComfort Ultra",
    brand: "Bose",
    category: "Headphones",
    description: "Bose's most premium noise-canceling headphones yet. Immersive Audio pushes the boundaries of what it means to listen, bringing acoustic performance to new heights.",
    price: 39999,
    discount: 10,
    stock: 15,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/51revx-zToL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Triple Black", "White Smoke", "Sandstone"],
    sizes: ["Standard"],
    specifications: [
      { name: "Spatial Audio", value: "Bose Immersive Audio" },
      { name: "Noise Cancellation", value: "CustomTune technology personalization" },
      { name: "Battery Life", value: "Up to 24 hours (18 hours with Immersive Audio)" },
      { name: "Microphones", value: "Advanced mic array for clear voice pickup" }
    ]
  },
  {
    title: "QuietComfort SC",
    brand: "Bose",
    category: "Headphones",
    description: "Legendary quiet, comfort, and sound. QuietComfort SC offers high-fidelity audio, customizable ANC modes, and a soft, comfortable fit for all-day listening sessions.",
    price: 24999,
    discount: 12,
    stock: 18,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61ipIa0WTKL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "ANC Modes", value: "Quiet and Aware Modes" },
      { name: "Acoustic Tuning", value: "Adjustable EQ through Bose Music app" },
      { name: "Battery Life", value: "Up to 24 hours on a single charge" },
      { name: "Material", value: "Plush synthetic leather earcups" }
    ]
  },
  {
    title: "Momentum 5 Wireless",
    brand: "Sennheiser",
    category: "Headphones",
    description: "Unparalleled sound quality and comfort. Sennheiser Momentum 5 Wireless features custom-tuned 42mm audiophile-grade drivers alongside customizable Smart Active Noise Cancellation.",
    price: 32999,
    discount: 15,
    stock: 10,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71sLOtsK2UL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "White-Cream"],
    sizes: ["Standard"],
    specifications: [
      { name: "Driver Type", value: "42mm Dynamic Transducer" },
      { name: "Battery Life", value: "Up to an astonishing 60 hours" },
      { name: "Connectivity", value: "Bluetooth 5.3 aptX Adaptive" },
      { name: "Sound Customization", value: "Built-in 5-band Equalizer and Sound Personalization" }
    ]
  },
  {
    title: "HD 560S",
    brand: "Sennheiser",
    category: "Headphones",
    description: "Linear acoustics tuned for analytical listening. The open-back HD 560S provides the detail-retrieval needed for critical monitoring alongside a rich, immersive natural soundstage.",
    price: 18999,
    discount: 5,
    stock: 14,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/81cWWVMM8+L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Matte Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Acoustic Design", value: "Open-back, over-ear" },
      { name: "Impedance", value: "120 Ohms" },
      { name: "Frequency Response", value: "6 Hz to 38,000 Hz" },
      { name: "Cable Interchangeability", value: "Detachable 3m cable with 6.3mm plug (3.5mm adapter included)" }
    ]
  },
  {
    title: "Tour One M3",
    brand: "JBL",
    category: "Headphones",
    description: "Control your environment with Legendry JBL Pro Sound. Play your favorite playlist with immersive spatial audio and adaptive noise canceling for uninterrupted auditory focus.",
    price: 22999,
    discount: 10,
    stock: 16,
    rating: 4.6,
    images: ["https://m.media-amazon.com/images/I/61OjdW+nDRL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "Champagne Gold"],
    sizes: ["Standard"],
    specifications: [
      { name: "Drivers", value: "40mm dynamic drivers with JBL Pro Sound" },
      { name: "ANC", value: "True Adaptive Noise Cancelling with Smart Ambient" },
      { name: "Battery Life", value: "Up to 50 hours of playback (30 hours with ANC)" },
      { name: "Microphones", value: "4-mic technology for perfect crystal-clear voice calls" }
    ]
  },
  {
    title: "Tune 770NC",
    brand: "JBL",
    category: "Headphones",
    description: "Wireless Over-Ear Adaptive Noise Cancelling Headphones with JBL Pure Bass Sound. Lightweight, foldable design offers ultimate portable convenience.",
    price: 7999,
    discount: 15,
    stock: 30,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61JU2HicMQL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "Blue", "White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Bass Technology", value: "JBL Pure Bass Sound" },
      { name: "Battery Life", value: "Up to 70 hours (44 hours with ANC ON)" },
      { name: "Bluetooth Version", value: "Bluetooth 5.3 with LE Audio" },
      { name: "Form Factor", value: "Lightweight foldable design for compact storage" }
    ]
  },
  {
    title: "Live 770NC",
    brand: "JBL",
    category: "Headphones",
    description: "Comfortable, stylish over-ear headphones presenting True Adaptive Noise Cancelling and Personi-Fi 2.0 sound personalization. Experience spatial sound without boundaries.",
    price: 12999,
    discount: 10,
    stock: 22,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71wJqHHazrL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "Blue", "Sand", "White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Sound Engine", value: "JBL Signature Sound and Spatial Audio" },
      { name: "ANC", value: "True Adaptive Noise Cancelling with Smart Ambient" },
      { name: "Battery Life", value: "Up to 65 hours (50 hours with ANC ON)" },
      { name: "Personalization", value: "Personi-Fi 2.0 customized audio profile" }
    ]
  },
  {
    title: "Crusher ANC 3",
    brand: "Skullcandy",
    category: "Headphones",
    description: "The ultimate sensory bass head experience enters its next generation. Skullcandy Crusher ANC 3 delivers adjustable sensory bass combined with premium active noise cancellation.",
    price: 19999,
    discount: 10,
    stock: 12,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/612fE19oP5L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["True Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Bass Driver", value: "Patented Crusher Adjustable Sensory Bass" },
      { name: "ANC", value: "Adjustable 4-Mic Active Noise Cancellation" },
      { name: "Battery Life", value: "Up to 50 hours of runtime" },
      { name: "Smart Controls", value: "Skull-iQ Smart Feature Technology" }
    ]
  },
  {
    title: "Hesh ANC",
    brand: "Skullcandy",
    category: "Headphones",
    description: "Simple, everyday active noise cancellation. The Skullcandy Hesh ANC packs 4-mic digital active noise cancellation into a lightweight, highly durable frame.",
    price: 8999,
    discount: 12,
    stock: 25,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71XV1uzAw8L._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black", "Mod White", "True Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Acoustic Tuning", value: "Custom-tuned 40mm drivers" },
      { name: "Noise Cancellation", value: "4-mic Digital Active Noise Cancelling" },
      { name: "Battery Life", value: "Up to 22 hours with rapid charge" },
      { name: "Tracking", value: "Built-in Tile finding technology" }
    ]
  },
  {
    title: "Rockerz 551 ANC",
    brand: "boAt",
    category: "Headphones",
    description: "Affordable noise-cancelling headphones featuring massive playback capabilities, custom EQ modes, and high-quality ergonomics.",
    price: 4999,
    discount: 15,
    stock: 45,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/61BrerJ+yML._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Stellar Black", "Sage Green", "Ivory White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Noise Cancellation", value: "Hybrid Active Noise Cancellation up to 35dB" },
      { name: "Playback Hours", value: "Up to 100 hours (Without ANC)" },
      { name: "Drivers", value: "40mm Dynamic Drivers" },
      { name: "Charge Tech", value: "ASAP Charge (10 mins charge = 10 hours playback)" }
    ]
  },
  {
    title: "Nirvana Eutopia",
    brand: "boAt",
    category: "Headphones",
    description: "Immerse yourself in virtual audio fields. BoAt Nirvana Eutopia features spatial audio with dynamic head tracking to revolutionize your personal theater entertainment.",
    price: 8499,
    discount: 10,
    stock: 18,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/71q-M4w+fSL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Dark Tech Matte", "White Cyber"],
    sizes: ["Standard"],
    specifications: [
      { name: "Spatial Tech", value: "Dynamic Head Tracking Spatial Audio" },
      { name: "Drivers", value: "40mm premium copper-coil drivers" },
      { name: "Battery Life", value: "Up to 20 hours" },
      { name: "Dual Pairing", value: "Equipped with Bluetooth 5.3 multipoint" }
    ]
  },
  {
    title: "Noise Two Wireless",
    brand: "Noise",
    category: "Headphones",
    description: "Sleek and highly portable. The Noise Two Wireless headphones present excellent standard bass tracking and lightweight, comfortable earcups for daily commuting.",
    price: 3499,
    discount: 5,
    stock: 50,
    rating: 4.2,
    images: ["https://m.media-amazon.com/images/I/517lSvEVVsL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Bold Black", "Serene Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Driver Size", value: "40mm High Fidelity speaker drivers" },
      { name: "Battery Life", value: "Up to 50 hours of wireless music backup" },
      { name: "Latency Mode", value: "Tru Bass 40ms Low Latency gaming mode" },
      { name: "Radio", value: "Built-in FM radio receiver option" }
    ]
  },
  {
    title: "Noise Defy ANC",
    brand: "Noise",
    category: "Headphones",
    description: "Premium acoustic experience at an accessible price. Noise Defy ANC offers robust active noise cancellation and memory foam ear cushions for complete ambient isolation.",
    price: 5999,
    discount: 12,
    stock: 35,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/61ttOStDEqL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Space Black", "Steel Grey"],
    sizes: ["Standard"],
    specifications: [
      { name: "Acoustics", value: "40mm drivers with rich deep bass audio" },
      { name: "ANC Level", value: "Up to 25dB active ambient noise suppression" },
      { name: "Battery Life", value: "Up to 30 hours of continuous play time" },
      { name: "Comfort", value: "Premium plush memory foam earcups" }
    ]
  },
  {
    title: "Zone Vibe 125",
    brand: "Logitech",
    category: "Headphones",
    description: "Wireless over-ear headphones built for work and play. Zone Vibe 125 is lightweight, features a flip-to-mute microphone, and connects seamlessly to your computer or smartphone.",
    price: 6999,
    discount: 5,
    stock: 22,
    rating: 4.4,
    images: ["https://m.media-amazon.com/images/I/61qj6tFbPiL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Graphite", "Off-White", "Rose"],
    sizes: ["Standard"],
    specifications: [
      { name: "Connectivity", value: "USB-A Receiver & Bluetooth multi-network" },
      { name: "Microphone", value: "Flip-to-mute noise-cancelling beamforming mic" },
      { name: "Weight", value: "185g extremely light-weight design" },
      { name: "Eco Rating", value: "Certified carbon neutral fabric materials" }
    ]
  },
  {
    title: "G435 Lightspeed",
    brand: "Logitech",
    category: "Headphones",
    description: "Sustainably designed wireless gaming headset. Extremely lightweight, G435 features Lightspeed wireless and low-latency Bluetooth connectivity for PC and consoles.",
    price: 7999,
    discount: 10,
    stock: 28,
    rating: 4.5,
    images: ["https://m.media-amazon.com/images/I/71pz2njkNRL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black and Neon Yellow", "Blue and Raspberry", "Off-White and Lilac"],
    sizes: ["Standard"],
    specifications: [
      { name: "Wireless Tech", value: "LIGHTSPEED Wireless USB and Bluetooth" },
      { name: "Weight", value: "165g Featherlight Frame" },
      { name: "Microphones", value: "Dual built-in beamforming microphones" },
      { name: "Battery Life", value: "Up to 18 hours per charge" }
    ]
  },
  {
    title: "Cloud III Wireless",
    brand: "HyperX",
    category: "Headphones",
    description: "Legendary comfort meets wireless freedom. The HyperX Cloud III Wireless gaming headset delivers exceptional 120-hour battery life and immersive spatial audio features.",
    price: 13999,
    discount: 8,
    stock: 15,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/51CQq94oyjL._AC_UL480_FMwebp_QL65_.jpg"],
    colors: ["Black-Red", "Black"],
    sizes: ["Standard"],
    specifications: [
      { name: "Battery Life", value: "Up to 120 hours of continuous gameplay" },
      { name: "Audio Precision", value: "Angled 53mm dynamic audio drivers" },
      { name: "Spatial Audio", value: "DTS Headphone:X Spatial Audio authorization" },
      { name: "Microphone", value: "Ultra-clear 10mm microphone with LED mute indicator" }
    ]
  },
  {
    title: "Arctis Nova 7",
    brand: "SteelSeries",
    category: "Headphones",
    description: "Venturing into Almighty Audio fields. Double-connection wireless system mixes 2.4GHz high-speed gaming audio with mobile Bluetooth channels concurrently.",
    price: 16999,
    discount: 10,
    stock: 14,
    rating: 4.7,
    images: ["https://m.media-amazon.com/images/I/61q-YZLK5cL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Matte Charcoal Black", "White Nova Edition"],
    sizes: ["Standard"],
    specifications: [
      { name: "Sound System", value: "Nova Acoustic System with High Fidelity Drivers" },
      { name: "Dual Channel", value: "Simultaneous 2.4GHz Wireless and Bluetooth" },
      { name: "Battery Life", value: "Up to 38 hours with USB-C fast charging" },
      { name: "Microphone", value: "ClearCast Gen 2 bidirectional noise cancelling mic" }
    ]
  },
  {
    title: "Razer BlackShark V2 Pro",
    brand: "Razer",
    category: "Headphones",
    description: "The premier esports wireless headset. Features professional super-wideband microphone performance, customized audio profiles, and high-intensity soundstage clarity.",
    price: 18999,
    discount: 5,
    stock: 18,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71zu1br+iKL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Black", "Mercury White"],
    sizes: ["Standard"],
    specifications: [
      { name: "Microphone Type", value: "Razer HyperClear Super Wideband Mic" },
      { name: "Audio Drivers", value: "Razer TriForce Titanium 50mm Drivers" },
      { name: "Wireless Connection", value: "Razer HyperSpeed Wireless 2.4GHz + Bluetooth" },
      { name: "Battery Life", value: "Up to 70 hours of gaming backup" }
    ]
  },
  {
    title: "ATH-M50xBT2",
    brand: "Audio-Technica",
    category: "Headphones",
    description: "Acclaimed studio headphone response now wireless. Experience the famous ATH-M50x sonic signature with exceptional clarity and deep, accurate bass response.",
    price: 17999,
    discount: 5,
    stock: 20,
    rating: 4.8,
    images: ["https://m.media-amazon.com/images/I/71r+8LBiCQL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Studio Black", "Metallic Ice Blue"],
    sizes: ["Standard"],
    specifications: [
      { name: "Driver Diameter", value: "Proprietary 45mm large-aperture studio drivers" },
      { name: "D/A Converter", value: "Advanced AK4331 audio DAC" },
      { name: "Battery Life", value: "Up to 50 hours of continuous use" },
      { name: "Vocal Pickup", value: "Dual mics and beamforming technology" }
    ]
  },
  {
    title: "DT 770 Pro",
    brand: "Beyerdynamic",
    category: "Headphones",
    description: "The absolute standard for studio monitoring. Closed back reference headphones valued by sound engineers and producers for precise, analytical sound.",
    price: 14999,
    discount: 8,
    stock: 12,
    rating: 4.9,
    images: ["https://m.media-amazon.com/images/I/713UaQFqYDL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Classic Grey Velour", "Limited Black Edition"],
    sizes: ["Standard"],
    specifications: [
      { name: "Transducer Type", value: "Dynamic closed-back acoustics" },
      { name: "Impedance Options", value: "80 Ohms / 250 Ohms available in-house" },
      { name: "Material", value: "Extremely comfortable replaceable soft velour earpads" },
      { name: "Manufacturing", value: "Meticulously handcrafted in Germany" }
    ]
  },
  {
    title: "Mi Super Bass Wireless",
    brand: "Xiaomi",
    category: "Headphones",
    description: "Incredible super bass performance at a fraction of the cost. Designed with large 40mm dynamic drivers to power your playlist with deep, clear sound.",
    price: 2999,
    discount: 10,
    stock: 40,
    rating: 4.3,
    images: ["https://m.media-amazon.com/images/I/71s2CDRicJL._AC_UY327_FMwebp_QL65_.jpg"],
    colors: ["Black and Gold", "Black and Red"],
    sizes: ["Standard"],
    specifications: [
      { name: "Audio Engine", value: "Large 40mm Dynamic Bass Drivers" },
      { name: "Battery Life", value: "Up to 20 hours per charge cycle" },
      { name: "Bluetooth Version", value: "Bluetooth 5.0 with fast pairing" },
      { name: "Headband", value: "Comfortable pressure-free skin-friendly design" }
    ]
  }
];

// Generates 25 high quality products per category to reach exactly 511 products!
function generate500Products(): any[] {
  const products: any[] = [];
  
  for (const cat of CATEGORIES) {
    if (cat.slug === 'home-decor') {
      products.push(...HOME_DECOR_DATA);
      continue;
    }

    if (cat.slug === 'kitchen-appliances') {
      products.push(...KITCHEN_APPLIANCES_DATA);
      continue;
    }

    if (cat.slug === 'smartphones') {
      products.push(...SMARTPHONES_DATA);
      continue;
    }

    if (cat.slug === 'laptops') {
      products.push(...LAPTOPS_DATA);
      continue;
    }

    if (cat.slug === 'smart-watches') {
      products.push(...SMART_WATCHES_DATA);
      continue;
    }

    if (cat.slug === 'mens-clothing') {
      products.push(...MENS_CLOTHING_DATA);
      continue;
    }

    if (cat.slug === 'womens-clothing') {
      products.push(...WOMENS_CLOTHING_DATA);
      continue;
    }

    if (cat.slug === 'shoes') {
      products.push(...SHOES_DATA);
      continue;
    }

    if (cat.slug === 'furniture') {
      products.push(...FURNITURE_DATA);
      continue;
    }

    if (cat.slug === 'books') {
      products.push(...BOOKS_DATA);
      continue;
    }

    if (cat.slug === 'cameras') {
      products.push(...CAMERAS_DATA);
      continue;
    }

    if (cat.slug === 'bluetooth-earbuds') {
      products.push(...BLUETOOTH_EARBUDS_DATA);
      continue;
    }

    if (cat.slug === 'speakers') {
      products.push(...SPEAKERS_DATA);
      continue;
    }

    if (cat.slug === 'headphones') {
      products.push(...HEADPHONES_DATA);
      continue;
    }

    if (cat.slug === 'sports-wear') {
      products.push(...SPORTS_WEAR_DATA);
      continue;
    }
    
    if (cat.slug === 'bags-and-travel') {
      products.push(...BAGS_AND_TRAVEL_DATA);
      continue;
    }
    
    if (cat.slug === 'fitness-equipment') {
      products.push(...FITNESS_EQUIPMENT_DATA);
      continue;
    }

    if (cat.slug === 'sports-equipment') {
      products.push(...SPORTS_EQUIPMENT_DATA);
      continue;
    }

    if (cat.slug === 'gaming-accessories') {
      products.push(...GAMING_ACCESSORIES_DATA);
      continue;
    }

    if (cat.slug === 'monitors') {
      products.push(...MONITORS_DATA);
      continue;
    }

    if (cat.slug === 'tablets') {
      products.push(...TABLETS_DATA);
      continue;
    }

    const images = IMAGE_POOL[cat.slug] || IMAGE_POOL['smartphones'];
    
    // Determine category brand candidates
    let categoryBrands = BRANDS;
    if (['smartphones', 'tablets', 'laptops', 'smart-watches'].includes(cat.slug)) {
      categoryBrands = BRANDS.filter(b => ['apple', 'samsung', 'oneplus', 'dell', 'hp', 'asus'].includes(b.slug));
    } else if (['mens-clothing', 'womens-clothing', 'sports-wear', 'shoes', 'bags-and-travel'].includes(cat.slug)) {
      categoryBrands = BRANDS.filter(b => ['nike', 'adidas', 'puma', 'raymond', 'zara'].includes(b.slug));
    } else if (['speakers', 'headphones', 'bluetooth-earbuds'].includes(cat.slug)) {
      categoryBrands = BRANDS.filter(b => ['sony', 'bose', 'jbl', 'philips', 'apple'].includes(b.slug));
    }

    const itemColors = ['Carbon Black', 'Stellar White', 'Emerald Green', 'Royal Blue', 'Classic Gray', 'Scarlet Red'];

    for (let i = 1; i <= 25; i++) {
      const brandObj = categoryBrands[i % categoryBrands.length] || BRANDS[0];
      const modelNum = 100 + i * 4;
      const title = `${brandObj.name} Pro ${cat.name.replace("'", "")} Series ${modelNum}`;
      
      const basePrice = 500 + (i * 240);
      const discount = i % 2 === 0 ? 15 : (i % 3 === 0 ? 25 : 5);
      const stock = i % 5 === 0 ? 0 : 12 + (i % 8); // Include some out of stock for availability testing
      const rating = parseFloat((4.0 + (i % 11) * 0.1).toFixed(1));

      // Cycle specs
      const specifications = SPEC_VALUES[cat.slug] || [
        { name: 'Material', value: 'Premium Eco-Friendly Build' },
        { name: 'Warranty', value: '1 Year Manufacturer Warranty' },
        { name: 'Certification', value: 'CE, FCC Certified' }
      ];

      // Shuffle images to represent primary thumbnail and gallery images
      const shuffledImages = [...images];
      const primaryIndex = i % shuffledImages.length;
      const itemImages = [
        shuffledImages[primaryIndex],
        shuffledImages[(primaryIndex + 1) % shuffledImages.length],
        shuffledImages[(primaryIndex + 2) % shuffledImages.length],
        shuffledImages[(primaryIndex + 3) % shuffledImages.length],
        shuffledImages[(primaryIndex + 4) % shuffledImages.length]
      ];

      products.push({
        title,
        brand: brandObj.name,
        category: cat.name,
        description: `Experience cutting-edge design and unparalleled performance with the ${title}. Engineered for durability, optimal performance, and extreme comfort. Fully loaded with modern specifications to uplift your style and power your productivity. Includes premium packaging and detailed user manuals.`,
        price: basePrice,
        discount,
        stock,
        rating,
        images: itemImages,
        colors: [itemColors[i % itemColors.length], itemColors[(i + 1) % itemColors.length]].slice(0, 2),
        sizes: ['mens-clothing', 'womens-clothing', 'sports-wear', 'shoes'].includes(cat.slug) 
          ? ['S', 'M', 'L', 'XL'] 
          : (['smartphones', 'tablets', 'laptops'].includes(cat.slug) ? ['128GB', '256GB', '512GB'] : ['Standard']),
        specifications
      });
    }
  }

  return products;
}

export async function runSeeder() {
  try {
    // Check if we need to seed or migrate to the specified 36 smartphones structure
    const userCount = await User.countDocuments();
    const loadedMatch = await Product.findOne({ title: "MacBook Air M5 13\"" });

    if (userCount === 0 || !loadedMatch || true) {
      console.log('🌱 Database needs matching smartphone & laptop listing seeds. Reseeding tables...');

      // Clear existing records safely
      await User.deleteMany({});
      await Product.deleteMany({});
      await Category.deleteMany({});
      await Brand.deleteMany({});
      await OrderCoupon.deleteMany({});
      await MarketingBanner.deleteMany({});

            // 1. Seed Admin
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      await User.create({
        name: 'Shopzy System Admin',
        email: 'admin@shopzy.com',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        phone: '+919999999999'
      });
      console.log('✅ Default Admin created: admin@shopzy.com / adminpassword');

      // 2. Seed Customer Account
      const customerHashedPassword = await bcrypt.hash('customerpassword', 10);
      await User.create({
        name: 'Regular Customer',
        email: 'customer@shopzy.com',
        username: 'customer',
        password: customerHashedPassword,
        role: 'customer',
        isVerified: true,
        phone: '+918888888888'
      });
      console.log('✅ Default Customer created: customer@shopzy.com / customerpassword');

      // 3. Seed Categories
      await Category.create(CATEGORIES);
      console.log(`✅ Seeded ${CATEGORIES.length} Categories.`);

      // 4. Seed Brands
      await Brand.create(BRANDS);
      console.log(`✅ Seeded ${BRANDS.length} Brands.`);

      // 5. Seed Coupons
      await OrderCoupon.create([
        { code: 'SHOPZY10', discountType: 'percentage', discountValue: 10, expiryDate: new Date('2028-12-31'), minPurchaseAmount: 1000 },
        { code: 'FESTIVE500', discountType: 'fixed', discountValue: 500, expiryDate: new Date('2028-12-31'), minPurchaseAmount: 4999 },
        { code: 'SUPERDEAL20', discountType: 'percentage', discountValue: 20, expiryDate: new Date('2028-12-31'), minPurchaseAmount: 2000 }
      ]);
      console.log('✅ Seeded checkout promotional coupons.');

      // 6. Seed Banners
      await MarketingBanner.create([
        { title: 'The Ultimate Tech Upgrade Sale', imageURL: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&q=80', link: '/products?category=Laptops', position: 'hero', isActive: true },
        { title: 'Step Up Your Fit Routine', imageURL: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1600&q=80', link: '/products?category=Fitness%20Equipment', position: 'hero', isActive: true },
        { title: 'Summery Wardrobe Refresh', imageURL: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=1600&q=80', link: '/products?category=Mens%20Clothing', position: 'hero', isActive: true }
      ]);
      console.log('✅ Seeded Homepage Slider Banners.');

      // 7. Seed Products
      console.log('📦 Generating high-quality products...');
      const fullProducts = generate500Products();
      const createdProducts = await Product.create(fullProducts);
      console.log(`✅ Successfully seeded ${fullProducts.length} unique products.`);

      // Sync local JSON backup file
      try {
        const fs = await import('fs');
        const path = await import('path');
        const dataDir = path.join(process.cwd(), 'data');
        await fs.promises.mkdir(dataDir, { recursive: true });

        const productsToSave = (createdProducts || []).map((p: any) => {
          const item = p.toObject ? p.toObject() : p;
          if (!item.id && item._id) item.id = String(item._id);
          if (!item._id && item.id) item._id = String(item.id);
          return item;
        });

        await fs.promises.writeFile(
          path.join(dataDir, 'product.json'),
          JSON.stringify(productsToSave, null, 2),
          'utf-8'
        );
        console.log('💾 Successfully synchronized product.json local backup file.');
      } catch (backupErr: any) {
        console.warn('⚠️ Could not sync product.json backup:', backupErr.message);
      }
    } else {
      console.log('👍 Databases already seeded with final smartphone models.');
    }
  } catch (err: any) {
    console.error('❌ Seeder system failed:', err.message);
  }
}
