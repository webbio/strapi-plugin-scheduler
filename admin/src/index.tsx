import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import Scheduler from './components/Scheduler';

const name = pluginPkg.strapi.name;

export default {
	register(app: any) {
		const plugin = {
			id: pluginId,
			initializer: Initializer,
			isReady: false,
			name
		};

		app.registerPlugin(plugin);
	},
	bootstrap(app: any) {
		app.injectContentManagerComponent('editView', 'right-links', {
			name: 'scheduler',
			Component: Scheduler
		});
	},
	async registerTrads(app: any) {
		const { locales } = app;

		const importedTrads = await Promise.all(
			locales.map((locale: string) => {
				return import(`./translations/${locale}.json`)
					.then(({ default: data }) => {
						return {
							data: prefixPluginTranslations(data, pluginId),
							locale
						};
					})
					.catch(() => {
						return {
							data: {},
							locale
						};
					});
			})
		);

		return Promise.resolve(importedTrads);
	}
};
