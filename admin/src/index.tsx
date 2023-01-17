import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import Scheduler from './components/Scheduler';

const name = pluginPkg.strapi.name;

export default {
	register(app) {
		const plugin = {
			id: pluginId,
			initializer: Initializer,
			isReady: false,
			name
		};

		app.registerPlugin(plugin);
	},
	bootstrap(app) {
		app.injectContentManagerComponent('editView', 'right-links', {
			name: 'scheduler',
			Component: Scheduler
		});
	},
	async registerTrads(app) {
		const { locales } = app;

		const importedTrads = await Promise.all(
			locales.map((locale) => {
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
