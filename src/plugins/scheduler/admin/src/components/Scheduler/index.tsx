import React, { useState, useEffect, memo, useMemo } from 'react';
import { Box, Stack, Divider, Typography } from '@strapi/design-system';
import { useCMEditViewDataManager, useFetchClient } from '@strapi/helper-plugin';

import { IScheduler, ISchedulerControllerReturn } from '../../../../server/controllers/scheduler';
import { IConfig, IConfigControllerReturn } from '../../../../server/controllers/config';
import DateTimePickerWrapper from '../date-time-picker-wrapper';

const DATETIME_PICKER_STEP_SIZE = 5;

const Scheduler = () => {
	const { onChange, layout, initialData, modifiedData, isCreatingEntry } = useCMEditViewDataManager();
	const { get } = useFetchClient();

	const [isLoadingConfig, setIsLoadingConfig] = useState(true);
	const [isLoadingScheduler, setIsLoadingScheduler] = useState(true);

	const [config, setConfig] = useState<IConfig | undefined | null>();
	const [scheduler, setScheduler] = useState<IScheduler | undefined | null>(undefined);

	const publishAt = useMemo(() => {
		const newDate = modifiedData?.publishAt ?? initialData.publishAt;
		return newDate ? new Date(newDate) : null;
	}, [initialData.publishAt, modifiedData.publishAt]);

	const archiveAt = useMemo(() => {
		const newDate = modifiedData?.archiveAt ?? initialData.archiveAt;

		return newDate ? new Date(newDate) : null;
	}, [initialData.archiveAt, modifiedData.archiveAt]);

	const updateFormValue = (name: string, value: Date | null, initialValue = false) => {
		const stringDate = value ? value.toDateString() : null;

		onChange(
			{
				target: { name, value: stringDate, type: 'string' }
			},
			initialValue
		);
	};

	const handleChangePublishAt = (value: Date | null) => {
		updateFormValue('publishAt', value, false);
	};

	const onClearPublishAt = () => {
		updateFormValue('publishAt', null, false);
	};

	const handleChangeArchiveAt = (value: Date | null) => {
		updateFormValue('archiveAt', value, false);
	};

	const onClearArchiveAt = () => {
		updateFormValue('archiveAt', null, false);
	};

	const fetchConfig = async (uid: string) => {
		try {
			const configFetchResult: { data?: IConfigControllerReturn } = await get(`/scheduler/config/${uid}`);
			const { data: config } = configFetchResult?.data || {};
			setConfig(config);
		} catch (error) {
		} finally {
			setIsLoadingConfig(false);
		}
	};

	const fetchScheduler = async (uid: string, entryId: string) => {
		try {
			const schedulerFetchResult: { data: ISchedulerControllerReturn } = await get(
				`/scheduler/scheduler/${uid}/${entryId}`
			);
			const { data: scheduler } = schedulerFetchResult?.data;
			setScheduler(scheduler);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoadingScheduler(false);
		}
	};

	useEffect(() => {
		const uid = layout.uid;
		const entryId = initialData?.id;
		fetchConfig(uid);

		if (entryId) {
			fetchScheduler(uid, entryId);
		}

		if (isCreatingEntry) {
			setIsLoadingScheduler(false);
		}
	}, []);

	useEffect(() => {
		if (isLoadingConfig === false && isLoadingScheduler === false) {
			const initialPublishAt = getInitialPublishAt(scheduler, config);
			const initialArchiveAt = getInitialArchiveAt(scheduler, config);

			if (initialPublishAt !== undefined) {
				const value = initialPublishAt === null ? null : new Date(initialPublishAt);
				updateFormValue('publishAt', value, true);
			}

			if (initialArchiveAt !== undefined) {
				const value = initialArchiveAt === null ? null : new Date(initialArchiveAt);
				updateFormValue('archiveAt', value, true);
			}
		}
	}, [isLoadingConfig, isLoadingScheduler]);

	if (!config) {
		return null;
	}

	return (
		<Box
			as="aside"
			aria-labelledby="scheduler"
			background="neutral0"
			borderColor="neutral150"
			hasRadius
			paddingBottom={4}
			paddingLeft={4}
			paddingRight={4}
			paddingTop={6}
			shadow="tableShadow"
		>
			<Typography variant="sigma" textColor="neutral600" id="scheduler">
				Scheduler
			</Typography>
			<Box marginTop={2} marginBottom={4}>
				<Divider />
			</Box>
			<Stack spacing={2}>
				<DateTimePickerWrapper
					ariaLabel="Publish at"
					label="Publish at"
					name="publishAt"
					onChange={handleChangePublishAt}
					onClear={onClearPublishAt}
					size="S"
					step={DATETIME_PICKER_STEP_SIZE}
					value={publishAt}
					error={null}
				/>
				<DateTimePickerWrapper
					ariaLabel="Archive at"
					label="Archive at"
					name="archiveAt"
					onChange={handleChangeArchiveAt}
					onClear={onClearArchiveAt}
					size="S"
					step={DATETIME_PICKER_STEP_SIZE}
					value={archiveAt}
					error={null}
				/>
			</Stack>
		</Box>
	);
};

export default Scheduler;

const getInitialPublishAt = (scheduler?: IScheduler | null, config?: IConfig | null) => {
	if (scheduler?.publishAt === null || scheduler?.publishAt !== undefined) {
		return scheduler.publishAt;
	}

	if (config?.initialPublishAtDate === null || config?.initialPublishAtDate !== undefined) {
		return config.initialPublishAtDate;
	}

	return undefined;
};

const getInitialArchiveAt = (scheduler?: IScheduler | null, config?: IConfig | null) => {
	if (scheduler?.archiveAt === null || scheduler?.archiveAt !== undefined) {
		return scheduler.archiveAt;
	}

	if (config?.initialArchiveAtDate === null || config?.initialArchiveAtDate !== undefined) {
		return config.initialArchiveAtDate;
	}

	return undefined;
};
