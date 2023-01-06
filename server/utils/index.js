"use strict";

const getCoreStore = () => {
  return strapi.store({ type: "plugin", name: "scheduler" });
};

// retrieve a local service
const getService = (name) => {
  return strapi.plugin("scheduler").service(name);
};

module.exports = {
  getService,
  getCoreStore,
};
