module.exports = {
  findOne: async (ctx, next) => {
    const result = await strapi
      .service("plugin::scheduler.config")
      .getContentTypeConfig(ctx.params.uid);

    return result;
  },
};
