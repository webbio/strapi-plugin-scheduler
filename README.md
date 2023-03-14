# Strapi plugin scheduler

Strapi Plugin to schedule publish and depublish actions for any collection type.
There are a couple of steps necessary to get the plugin up and running but they will be explained down below.

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
