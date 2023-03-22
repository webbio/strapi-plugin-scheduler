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

Now when you run your application, you will see some information is added to the sidebar. You can choose a date and time to publish or depublish your article.

<img src="./assets/showcase.png" width="200">
