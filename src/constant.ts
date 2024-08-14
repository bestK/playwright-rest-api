export default {
  RedisCacheKey: {
    Root: 'playwiright',
    get StorageState() {
      return `${this.Root}::storageState`;
    },
  },
};
