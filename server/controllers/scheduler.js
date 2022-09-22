"use strict";

module.exports = {
  async create(ctx) {
    const data = ctx.request.body;
    return await strapi.plugin("scheduler").service("scheduler").create(data);
  },
  async getByUidAndId(ctx) {
    const { uid, id } = ctx.params;

    const result = await strapi
      .plugin("scheduler")
      .service("scheduler")
      .getByUidAndId(uid, id);

    return {
      schedule:
        result.find((schedule) => schedule.scheduleType === "schedule") || null,
      depublish:
        result.find((schedule) => schedule.scheduleType === "depublish") ||
        null,
    };
  },
  async updateTime(ctx) {
    const { uid, id } = ctx.params;
    const data = ctx.request.body;
    return await strapi
      .plugin("scheduler")
      .service("scheduler")
      .updateTime(uid, id, data);
  },
};
