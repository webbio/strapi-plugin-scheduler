module.exports = [
  {
    method: 'GET',
    path: '/:uid/:id',
    handler: 'scheduler.getByUidAndId',
    config: {
      policies: [], auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/:uid/:id',
    handler: 'scheduler.updateTime',
    config: {
      policies: [], auth: false,
    },
  },
  {
    method: 'POST',
    path: '/create',
    handler: 'scheduler.create',
    config: {
      policies: [], auth: false,
    },
  },
  {
    method: 'POST',
    path: '/scheduler/:uid/:id',
    handler: 'scheduler.create',
    config: {
      policies: [], auth: false,
    },
  },
];
