import React, { memo } from 'react';

import { DateTimePicker } from '@strapi/design-system';

const component = ({ ...props }: any) => {
	return <DateTimePicker {...props} />;
};

const DateTimePickerWrapper = memo(component, arePropsEqual);

export default DateTimePickerWrapper;

function arePropsEqual(oldProps: any, newProps: any) {
	return oldProps?.value === newProps?.value;
}
