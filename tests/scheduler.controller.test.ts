import schedulerController from '../server/controllers/scheduler';

describe('Todo Controller', () => {
	let strapi;
	beforeEach(async function () {
		// mock this teh strapi object to allow for calling of create  await strapi.plugin('todo').service('create').create({ name })
		strapi = {
			plugin: jest.fn().mockReturnValue({
				service: jest.fn().mockReturnValue({
					getByUidAndEntryId: jest.fn().mockReturnValue([
						{
							id: 1,
							type: 'publish',
							datetime: '2021-08-10T12:00:00.000Z'
						},
						{
							id: 1,
							type: 'archive',
							datetime: '2021-09-11T12:00:00.000Z'
						}
					])
				})
			})
		};
	});
	it('should get data for scheduler', async function () {
		// call the index function
		const result = await schedulerController({ strapi }).getByUidAndEntryId({ params: { uid: '1', entryId: '2' } });
		console.log('result', result);
		// expect create to be called once
		expect(strapi.plugin('scheduler').service('getByUidAndEntryId').getByUidAndEntryId).toBeCalledTimes(1);
	});
	it('should not return data for scheduler because missing params', async function () {
		try {
			await schedulerController({ strapi }).getByUidAndEntryId({ params: { entryId: '2' } });
		} catch (error) {
			expect(error.message).toBe('no uuid');
		}
	});
});
