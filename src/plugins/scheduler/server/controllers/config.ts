import { Strapi } from '@strapi/strapi';

export interface IConfig {
	initialPublishAtDate?: string;
	initialArchiveAtDate?: string;
}

export interface IConfigControllerReturn {
	data: IConfig | null;
}

export default ({ strapi }: { strapi: Strapi }) => ({
	getGlobalConfig(): IConfigControllerReturn {
		const config = strapi.config.get('plugin.scheduler');

		return {
			data: config ?? null
		};
	},
	getContentTypeConfig(ctx: any): IConfigControllerReturn {
		const uid = ctx.params?.uid;

		if (!uid) {
			throw new Error();
		}

		const contentTypeConfigs = strapi.plugin('scheduler').config('contentTypes');

		const contentTypeConfig = contentTypeConfigs?.[uid];

		return {
			data: contentTypeConfig ?? null
		};
	}
});
