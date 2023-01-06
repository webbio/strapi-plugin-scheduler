"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    admin: {
        type: "admin",
        routes: [
            {
                method: "GET",
                path: "/config",
                handler: "config.getGlobalConfig",
            },
            {
                method: "GET",
                path: "/config/:uid",
                handler: "config.getContentTypeConfig",
            },
            {
                method: "GET",
                path: "/scheduler/:uid/:entryId",
                handler: "scheduler.getByUidAndEntryId",
            },
        ],
    },
};
