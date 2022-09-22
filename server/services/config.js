module.exports = () => ({
  async getPluginConfig() {
    return strapi.config.get("scheduler");
  },
  async getContentTypeConfig(contentType) {
    const config = strapi.config.get("plugin.scheduler")?.contentTypes?.[contentType];

    if (!config) {
      return null;
    }

    return config;
  },
});
