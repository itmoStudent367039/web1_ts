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
    if (keys && keys.length > 0) {
      for (const request of keys) {
        await openCache.delete(request.url);
      }
    }
  }

  async getAllCachedPoints() {
    const openCache = await this.cache;
    const keys = await openCache.keys();

    if (keys && keys.length > 0) {
      const data = [];
      for (let i = 0; i < keys.length; i++) {
        const response = await openCache.match(keys[i]);
        const cachedData = await response?.json();
        if (cachedData) {
          data.push(cachedData);
        }
      }
      return data;
    } else {
      return null;
    }
  }
}
