import { Strapi } from '@strapi/strapi';

export interface IScheduler {
	uid: string;
	entryId: number;
	publishAt: string;
	archiveAt: string;
}

export interface ISchedulerControllerReturn {
	data: IScheduler | null;
}

export default ({ strapi }: { strapi: Strapi }) => ({
	async getByUidAndEntryId(ctx: any): Promise<ISchedulerControllerReturn> {
		const { uid, entryId } = ctx.params;

		if (!uid) {
			throw new Error();
		}

		if (!entryId) {
			throw new Error();
		}

		const result = await strapi.plugin('scheduler').service('scheduler').getByUidAndEntryId(uid, entryId);

		const existingPublish = result.find((entry: any) => entry.type === 'publish');
		const existingArchive = result.find((entry: any) => entry.type === 'archive');

		const data = {
			uid,
			entryId,
			publishAt: existingPublish?.datetime,
			archiveAt: existingArchive?.datetime
		};

		return {
			data
		};
	}
});
