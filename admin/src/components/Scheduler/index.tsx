import React, { useState, useEffect } from 'react';
import { Box, Stack, Divider, Typography } from '@strapi/design-system';
import { useCMEditViewDataManager, DateTimePicker } from '@strapi/helper-plugin';
import axios from '../../utils/axiosInstance';

const DATETIME_PICKER_STEP_SIZE = 5;

const Scheduler = () => {
	const form = useCMEditViewDataManager();

	const [isLoadingConfig, setIsLoadingConfig] = useState(true);
	const [isLoadingScheduler, setIsLoadingScheduler] = useState(true);

	const [config, setConfig] = useState({
		config: undefined
	});
	const [scheduler, setScheduler] = useState({
		scheduler: undefined
	});

	const [publishAt, setPublishAt] = useState<any>(undefined);
	const [archiveAt, setArchiveAt] = useState<any>(undefined);

	const updateFormValue = (name, value, initialValue = false) => {
		if (value === null) {
			form.onChange(
				{
					target: { name, value, type: 'string' }
				},
				initialValue
			);
		} else {
			form.onChange(
				{
					target: { name, value: value.toISOString(), type: 'string' }
				},
				initialValue
			);
		}
	};

	const handleChangePublishAt = (value) => {
		setPublishAt(value);
		updateFormValue('publishAt', value, false);
	};

	const onClearPublishAt = () => {
		setPublishAt(null);
		updateFormValue('publishAt', null, false);
	};

	const handleChangeArchiveAt = (value) => {
		setArchiveAt(value);
		updateFormValue('archiveAt', value, false);
	};

	const onClearArchiveAt = () => {
		setArchiveAt(null);
		updateFormValue('archiveAt', null, false);
	};

	const fetchConfig = async (uid) => {
		try {
			const configFetchResult = await axios.get(`/scheduler/config/${uid}`);
			const { data: config } = configFetchResult?.data;
			setConfig(config);
		} catch (error) {
		} finally {
			setIsLoadingConfig(false);
		}
	};

	const getInitialPublishAt = (scheduler, config) => {
		if (scheduler?.publishAt === null || scheduler?.publishAt !== undefined) {
			return scheduler.publishAt;
		}

		if (config?.initialPublishAtDate === null || config?.initialPublishAtDate !== undefined) {
			return config.initialPublishAtDate;
		}

		return undefined;
	};

	const getInitialArchiveAt = (scheduler, config) => {
		if (scheduler?.archiveAt === null || scheduler?.archiveAt !== undefined) {
			return scheduler.archiveAt;
		}

		if (config?.initialArchiveAtDate === null || config?.initialArchiveAtDate !== undefined) {
			return config.initialArchiveAtDate;
		}

		return undefined;
	};

	const fetchScheduler = async (uid, entryId) => {
		try {
			const schedulerFetchResult = await axios.get(`/scheduler/scheduler/${uid}/${entryId}`);
			const { data: scheduler } = schedulerFetchResult?.data;
			setScheduler(scheduler);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoadingScheduler(false);
		}
	};

	useEffect(() => {
		const uid = form.layout.uid;
		const entryId = form?.initialData?.id;
		fetchConfig(uid);

		if (entryId) {
			fetchScheduler(uid, entryId);
		}

		if (form.isCreatingEntry) {
			setIsLoadingScheduler(false);
		}
	}, []);

	useEffect(() => {
		if (isLoadingConfig === false && isLoadingScheduler === false) {
			const initialPublishAt = getInitialPublishAt(scheduler, config);
			const initialArchiveAt = getInitialArchiveAt(scheduler, config);

			if (initialPublishAt !== undefined) {
				const value = initialPublishAt === null ? null : new Date(initialPublishAt);
				setPublishAt(value);
				updateFormValue('publishAt', value, true);
			}

			if (initialArchiveAt !== undefined) {
				const value = initialArchiveAt === null ? null : new Date(initialArchiveAt);
				setArchiveAt(value);
				updateFormValue('archiveAt', value, true);
			}
		}
	}, [isLoadingConfig, isLoadingScheduler]);

	return config ? (
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
				<DateTimePicker
					ariaLabel="Publish at"
					clearLabel="Clear"
					disabled={false}
					label="Publish at"
					name="publishAt"
					onChange={handleChangePublishAt}
					onClear={onClearPublishAt}
					size="S"
					step={DATETIME_PICKER_STEP_SIZE}
					value={publishAt}
					error={null}
				/>
				<DateTimePicker
					ariaLabel="Archive at"
					clearLabel="Clear"
					disabled={false}
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
	) : null;
};

export default Scheduler;
