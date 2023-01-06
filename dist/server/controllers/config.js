"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    getGlobalConfig(ctx) {
        const config = strapi.config.get("plugin.scheduler");
        return {
            data: config !== null && config !== void 0 ? config : null,
        };
    },
    getContentTypeConfig(ctx) {
        var _a;
        const uid = (_a = ctx.params) === null || _a === void 0 ? void 0 : _a.uid;
        if (!uid) {
            throw new Error();
        }
        const contentTypeConfigs = strapi
            .plugin("scheduler")
            .config("contentTypes");
        const contentTypeConfig = contentTypeConfigs === null || contentTypeConfigs === void 0 ? void 0 : contentTypeConfigs[uid];
        return {
            data: contentTypeConfig !== null && contentTypeConfig !== void 0 ? contentTypeConfig : null,
        };
    },
});
