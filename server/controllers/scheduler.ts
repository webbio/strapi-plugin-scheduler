import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async getByUidAndEntryId(ctx) {
    const { uid, entryId } = ctx.params;

    if (!uid) {
      throw new Error();
    }

    if (!entryId) {
      throw new Error();
    }

    const result = await strapi
      .plugin("scheduler")
      .service("scheduler")
      .getByUidAndEntryId(uid, entryId);

    const existingPublish = result.find((entry) => entry.type === "publish");
    const existingArchive = result.find((entry) => entry.type === "archive");

    const data = {
      uid,
      entryId,
      publishAt: existingPublish?.datetime,
      archiveAt: existingArchive?.datetime,
    };

    return {
      data,
    };
  },
});
