import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getGlobalConfig(ctx) {
    const config = strapi.config.get("plugin.scheduler");

    return {
      data: config ?? null,
    };
  },
  getContentTypeConfig(ctx) {
    const uid = ctx.params?.uid;

    if (!uid) {
      throw new Error();
    }

    const contentTypeConfigs = strapi
      .plugin("scheduler")
      .config("contentTypes");

    const contentTypeConfig = contentTypeConfigs?.[uid];

    return {
      data: contentTypeConfig ?? null,
    };
  },
});
