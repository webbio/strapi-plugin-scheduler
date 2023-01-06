"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const submitSchedulerData = async (event) => {
    const { model, state, result } = event;
    const uid = model.uid;
    const entryId = result.id;
    const schedulerData = {
        uid,
        entryId,
        publishAt: state.publishAt,
        archiveAt: state.archiveAt,
    };
    try {
        const schedulerService = strapi.service("plugin::scheduler.scheduler");
        await schedulerService.schedule(schedulerData);
    }
    catch (error) {
        console.error(error);
    }
};
exports.default = ({ strapi }) => {
    const userCreatedContentTypesWithDraftAndPublish = Object.values(strapi.contentTypes)
        .filter((model) => { var _a; return model.uid.startsWith("api::") && ((_a = model.options) === null || _a === void 0 ? void 0 : _a.draftAndPublish) === true; })
        .map((model) => model.uid);
    strapi.db.lifecycles.subscribe({
        models: userCreatedContentTypesWithDraftAndPublish,
        async beforeCreate(event) {
            var _a, _b;
            event.state.publishAt = (_a = event.params.data) === null || _a === void 0 ? void 0 : _a.publishAt;
            event.state.archiveAt = (_b = event.params.data) === null || _b === void 0 ? void 0 : _b.archiveAt;
        },
        async beforeUpdate(event) {
            var _a, _b;
            event.state.publishAt = (_a = event.params.data) === null || _a === void 0 ? void 0 : _a.publishAt;
            event.state.archiveAt = (_b = event.params.data) === null || _b === void 0 ? void 0 : _b.archiveAt;
        },
        async afterCreate(event) {
            if (event.state.publishAt !== undefined ||
                event.state.archiveAt !== undefined) {
                await submitSchedulerData(event);
            }
        },
        async afterUpdate(event) {
            if (event.state.publishAt !== undefined ||
                event.state.archiveAt !== undefined) {
                await submitSchedulerData(event);
            }
        },
    });
};
