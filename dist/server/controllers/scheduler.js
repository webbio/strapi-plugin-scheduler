"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
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
            publishAt: existingPublish === null || existingPublish === void 0 ? void 0 : existingPublish.datetime,
            archiveAt: existingArchive === null || existingArchive === void 0 ? void 0 : existingArchive.datetime,
        };
        return {
            data,
        };
    },
});
