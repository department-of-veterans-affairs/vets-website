import React from 'react';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

export default function YesNoWidget({
  id,
  value,
  disabled,
  onChange,
  options = {},
}) {
  const {
    yesNoReverse = false,
    labels = {},
    widgetProps = {},
    selectedProps = {},
    enableAnalytics = false,
  } = options;

  const values = {
    Y: !yesNoReverse,
    N: yesNoReverse,
  };

  const getProps = key => ({
    ...(widgetProps[key] || {}),
    ...((value === values[key] && selectedProps[key]) || {}),
  });

  const onChangeEvent = val => {
    if (enableAnalytics) {
      // title may be a React component
      const title = options.title?.props?.children || options.title || '';
      // labels may or may not have custom text
      const optionLabel = labels[val] || (values[val] ? 'Yes' : 'No');
      // this check isn't ideal since the message may exist and the question
      // may be dynamically toggled between being required or not
      const required = !!options.errorMessages?.required;
      recordEvent({
        event: 'int-radio-button-option-click',
        'radio-button-label': title,
        'radio-button-optionLabel': optionLabel,
        'radio-button-required': required,
      });
    }
    onChange(values[val]);
  };

  return (
    <div className="form-radio-buttons">
      <input
        type="radio"
        checked={value === values.Y}
        autoComplete="off"
        id={`${id}Yes`}
        name={`${id}`}
        value="Y"
        disabled={disabled}
        onChange={_ => onChangeEvent('Y')}
        {...getProps('Y')}
      />
      <label htmlFor={`${id}Yes`}>
        {labels.Y || 'Yes, also update my profile'}
      </label>
      <input
        type="radio"
        checked={value === values.N}
        autoComplete="off"
        id={`${id}No`}
        name={`${id}`}
        value="N"
        disabled={disabled}
        onChange={_ => onChangeEvent('N')}
        {...getProps('N')}
      />
      <label htmlFor={`${id}No`}>
        {labels.N || 'No, only update this form'}
      </label>
    </div>
  );
}

YesNoWidget.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  options: PropTypes.shape({
    enumOptions: PropTypes.array,
    labels: PropTypes.shape({}),
    nestedContent: PropTypes.shape({}),
    widgetProps: PropTypes.shape({}),
    selectedProps: PropTypes.shape({}),
    enableAnalytics: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    errorMessages: PropTypes.shape({}),
  }),
  value: PropTypes.bool,
  onChange: PropTypes.func,
};
