"use strict";

module.exports = ({ strapi }) => ({
  async create(data) {
    return await strapi.query("plugin::scheduler.scheduler").create({ data });
  },
  async getByUidAndId(uid, id) {
    return await strapi
      .query("plugin::scheduler.scheduler")
      .findMany({ where: { uid: uid, contentId: id } });
  },
  async updateTime(uid, id, data) {
    return await strapi
      .query("plugin::scheduler.scheduler")
      .update({
        where: { uid: uid, contentId: id, scheduleType: data.scheduleType },
        data,
      });
  },
});
