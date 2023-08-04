export default ({ env }) => ({
  scheduler: {
    enabled: true,
    resolve: "./src/plugins/scheduler",
    config: {
      contentTypes: {
        "api::page.page": {},
      },
    },
  },
});
