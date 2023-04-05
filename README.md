# Strapi plugin scheduler

Strapi Plugin to schedule publish and depublish actions for any collection type.

Schedule when you want to publish your content

![Alt Text](https://media.giphy.com/media/ziKkXCGDftGmvLs1lJ/giphy.gif)

Choose the date and time of publication and choose when to archive your page

![Alt Text](https://media.giphy.com/media/CpFm7AC67Mkul8VTFI/giphy.gif)

That's it!

![Alt Text](https://media.giphy.com/media/gvMbDw1bOhals0hI3g/giphy.gif)

# Installation

1. To install the plugin run `npm i @webbio/strapi-plugin-scheduler` or `yarn add @webbio/strapi-plugin-scheduler`.

2. After the plugin is installed, add the plugin to the plugins.js file in your config folder.

```
scheduler: {
		enabled: true,
		config: {
			contentTypes: {
				'api::page.page': {}
			}
		}
	},
```

# Set initial dates

Set the initial archive date and initial publish date in the plugin settings. These dates will automatically be set when creating a new page.

```
scheduler: {
		enabled: true,
		resolve: './src/plugins/strapi-plugin-scheduler',
		config: {
			'api::page.page': {
				initialPublishAtDate: setMonth(
					new Date(),
					new Date().getMonth() + 1
				).toDateString(),
				initialArchiveAtDate: setMonth(
					new Date(),
					new Date().getMonth() + 3
				).toDateString(),
			},
		},
	},
```

Now when you run your application, the addon will be added to the sidebar. You can choose a date and time to publish or archive your article.
