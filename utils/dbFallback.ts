import { promises as fs } from 'fs';
import path from 'path';

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if directory exists
  }
}

// Simple unique ID generator
function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

class MockQuery<T> {
  private data: T[];

  constructor(data: T[]) {
    this.data = data;
  }

  skip(count: number): MockQuery<T> {
    this.data = this.data.slice(count);
    return this;
  }

  limit(count: number): MockQuery<T> {
    this.data = this.data.slice(0, count);
    return this;
  }

  sort(sortObj: any): MockQuery<T> {
    const key = Object.keys(sortObj)[0];
    if (!key) return this;
    const order = sortObj[key] === -1 ? -1 : 1;
    this.data.sort((a: any, b: any) => {
      if (a[key] < b[key]) return -1 * order;
      if (a[key] > b[key]) return 1 * order;
      return 0;
    });
    return this;
  }

  // To support then() or simple await
  then(onfulfilled?: (value: T[]) => any, onrejected?: (reason: any) => any): Promise<any> {
    return Promise.resolve(this.data).then(onfulfilled, onrejected);
  }
}

export class MockModel<T extends { id?: string; _id?: string }> {
  private name: string;
  private filePath: string;

  constructor(name: string) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name.toLowerCase()}.json`);
  }

  private async readAll(): Promise<T[]> {
    await ensureDataDir();
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private async writeAll(data: any[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async find(query: any = {}): Promise<any> {
    const data = await this.readAll();
    const filtered = data.filter((item: any) => {
      for (const key in query) {
        const queryVal = query[key];
        if (queryVal && typeof queryVal === 'object' && !(queryVal instanceof Date) && !(queryVal instanceof Array)) {
          if ('$regex' in queryVal || '$options' in queryVal) {
            const regexStr = queryVal.$regex;
            const options = queryVal.$options || 'i';
            const val = item[key];
            if (val === undefined || val === null) return false;
            const re = new RegExp(regexStr.toString(), options);
            if (!re.test(val.toString())) return false;
            continue;
          }
          if ('$in' in queryVal) {
            const allowedValues = queryVal.$in;
            if (Array.isArray(allowedValues)) {
              if (!allowedValues.includes(item[key])) return false;
              continue;
            }
          }
          if ('$ne' in queryVal) {
            if (item[key] === queryVal.$ne) return false;
            continue;
          }
        }
        if (queryVal instanceof Array) {
          if (!queryVal.includes(item[key])) return false;
          continue;
        }
        if (queryVal !== undefined && item[key] !== queryVal) {
          return false;
        }
      }
      return true;
    });
    return new MockQuery(filtered) as any;
  }

  async findOne(query: any = {}): Promise<T | null> {
    const results = await this.find(query);
    return results[0] || null;
  }

  async findById(id: string): Promise<T | null> {
    const results = await this.readAll();
    return results.find((item: any) => (item.id === id || item._id === id)) || null;
  }

  async create(data: Partial<T> | Partial<T>[]): Promise<any> {
    const all = await this.readAll();
    if (Array.isArray(data)) {
      const createdItems = data.map((item) => {
        const id = generateId();
        return {
          id,
          _id: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...item
        } as any;
      });
      all.push(...createdItems);
      await this.writeAll(all);
      return createdItems;
    } else {
      const id = generateId();
      const created = {
        id,
        _id: id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      } as any;
      all.push(created);
      await this.writeAll(all);
      return created;
    }
  }

  async findByIdAndUpdate(id: string, update: any, options: { new?: boolean } = {}): Promise<T | null> {
    const all = await this.readAll();
    const index = all.findIndex((item: any) => (item.id === id || item._id === id));
    if (index === -1) return null;
    const original = all[index];
    const updated = {
      ...original,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    await this.writeAll(all);
    return options.new === false ? original : updated;
  }

  async findOneAndUpdate(query: any, update: any, options: { new?: boolean } = {}): Promise<T | null> {
    const all = await this.readAll();
    const index = all.findIndex((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index === -1) return null;
    const original = all[index];
    const updated = {
      ...original,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    all[index] = updated;
    await this.writeAll(all);
    return options.new === false ? original : updated;
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    const all = await this.readAll();
    const index = all.findIndex((item: any) => (item.id === id || item._id === id));
    if (index === -1) return null;
    const removed = all[index];
    all.splice(index, 1);
    await this.writeAll(all);
    return removed;
  }

  async deleteOne(query: any = {}): Promise<{ deletedCount: number }> {
    const all = await this.readAll();
    const index = all.findIndex((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index === -1) return { deletedCount: 0 };
    all.splice(index, 1);
    await this.writeAll(all);
    return { deletedCount: 1 };
  }

  async deleteMany(query: any = {}): Promise<{ deletedCount: number }> {
    const all = await this.readAll();
    const remaining = all.filter((item: any) => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    const deletedCount = all.length - remaining.length;
    await this.writeAll(all.filter((item: any) => !remaining.includes(item)));
    return { deletedCount };
  }

  async countDocuments(query: any = {}): Promise<number> {
    const list = await this.find(query);
    return list.length;
  }
}
