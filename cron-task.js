module.exports = {
  "*/30 * * * *": async ({ strapi }) => {
    const posts = await strapi.db
      .query("plugin::scheduler.scheduler")
      .findMany({ where: { scheduledDatetime: { $lte: new Date() } } });
          
    posts.map(async (post) => {
    if (post.scheduleType === "schedule") {

      await strapi.db.query(post.uid).update({
        where: {
          id: post.contentId,
        },
        data: {
          publishedAt: new Date(),
        },
      });
      await strapi.db
        .query("plugin::scheduler.scheduler")
        .delete({ where: { id: post.id } });
    } else if (post.scheduleType === "depublish") {
      await strapi.db.query(post.uid).update({
        where: {
          id: post.contentId,
        },
        data: {
          publishedAt: null,
        },
      });
      await strapi.db
        .query("plugin::scheduler.scheduler")
        .delete({ where: { id: post.id } });
    }
  });
},
};
