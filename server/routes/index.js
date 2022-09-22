module.exports = [
  {
    method: "GET",
    path: "/schedule/:uid/:id",
    handler: "scheduler.getByUidAndId",
    config: {
      policies: [],
      auth: false,
    },
  },

  {
    method: "PUT",
    path: "/schedule/:uid/:id",
    handler: "scheduler.updateTime",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/schedule/create",
    handler: "scheduler.create",
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/config/:uid",
    handler: "config.findOne",
    config: {
      policies: [],
      auth: false,
    },
  },
];
