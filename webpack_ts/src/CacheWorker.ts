export class CacheWorker {
  private cache: Promise<Cache> = caches.open("PointStorage");

  async putPoint(data: any, url: string) {
    await (
      await this.cache
    )?.put(url + this.randomId(), new Response(JSON.stringify(data)));
  }

  randomId(): string {
    const randomNumber = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    return `${timestamp}-${randomNumber}`;
  }

  async clearCache() {
    const openCache = await this.cache;
    const keys = await openCache.keys();
    if (keys) {
      for (const request of keys) {
        await openCache.delete(request.url);
      }
    }
  }

  async getAllCachedPoints(): Promise<any[]> | null {
    const openCache = await this.cache;
    const keys = await openCache.keys();

    if (keys) {
      const data = [];
      for (const key of keys) {
        const response = await openCache.match(key);
        const cachedData = await response?.json();
        if (cachedData) {
          data.push(cachedData);
        }
      }
      return data;
    }
    return null;
  }
}
