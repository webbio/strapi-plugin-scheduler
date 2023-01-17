// @ts-nocheck
import { Strapi } from '@strapi/strapi';

const submitSchedulerData = async (event) => {
	const { model, state, result } = event;

	const uid = model.uid;
	const entryId = result.id;

	const schedulerData = {
		uid,
		entryId,
		publishAt: state.publishAt,
		archiveAt: state.archiveAt
	};

	try {
		const schedulerService = strapi.service('plugin::scheduler.scheduler');
		await schedulerService.schedule(schedulerData);
	} catch (error) {
		console.error(error);
	}
};

export default ({ strapi }: { strapi: Strapi }) => {
	const userCreatedContentTypesWithDraftAndPublish = Object.values(strapi.contentTypes)
		.filter((model) => model.uid.startsWith('api::') && model.options?.draftAndPublish === true)
		.map((model) => model.uid);

	strapi.db.lifecycles.subscribe({
		models: userCreatedContentTypesWithDraftAndPublish,
		async beforeCreate(event) {
			event.state.publishAt = event.params.data?.publishAt;
			event.state.archiveAt = event.params.data?.archiveAt;
		},
		async beforeUpdate(event) {
			event.state.publishAt = event.params.data?.publishAt;
			event.state.archiveAt = event.params.data?.archiveAt;
		},
		async afterCreate(event) {
			if (event.state.publishAt !== undefined || event.state.archiveAt !== undefined) {
				await submitSchedulerData(event);
			}
		},
		async afterUpdate(event) {
			if (event.state.publishAt !== undefined || event.state.archiveAt !== undefined) {
				await submitSchedulerData(event);
			}
		}
	});
};
