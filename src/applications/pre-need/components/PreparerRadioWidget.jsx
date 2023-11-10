import React, { useState } from 'react';

import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { authorizedAgentDescription } from '../utils/helpers';

export default function RadioWidget(props) {
  const { options, formContext = {}, value, disabled, onChange, id } = props;
  const { enumOptions, labels = {} } = options;

  const onReviewPage = formContext?.onReviewPage || false;
  const inReviewMode = (onReviewPage && formContext.reviewMode) || false;
  const showRadio = !onReviewPage || (onReviewPage && !inReviewMode); // I think we need to take out first condition.
  const [priorEvent, setPriorEvent] = useState();
  const onChangeEvent = option => {
    // title may be a React component
    const title = options.title?.props?.children || options.title || '';
    // this check isn't ideal since the message may exist and the question
    // may be dynamically toggled between being required or not
    let optionLabel =
      enumOptions.find(item => item.value === option.detail.value)?.label || '';
    if (optionLabel === 'Someone else, such as a preparer')
      optionLabel = 'Authorized Agent/Rep';
    else if (optionLabel !== '') optionLabel = 'Self';

    const currentEvent = {
      event: 'int-radio-option-click',
      'radio-button-label': title,
      'radio-button-optionLabel': optionLabel,
      'radio-button-required': true,
    };
    // if prior event is identical to current event it must be a duplicate.
    if (
      !priorEvent ||
      JSON.stringify(currentEvent) !== JSON.stringify(priorEvent)
    ) {
      recordEvent(currentEvent);
      setPriorEvent(currentEvent);
    }
    onChange(option.detail.value);
  };
  return (
    <>
      {showRadio ? (
        <>
          <div className="preparer-va-radio">
            <VaRadio onVaValueChange={onChangeEvent}>
              {enumOptions.map((option, i) => {
                const checked = option.value === value;
                return (
                  <div className="form-radio-buttons" key={option.value}>
                    <va-radio-option
                      id={`${id}_${i}`}
                      name={`${id}`}
                      label={labels[option.value] || option.label}
                      value={option.value}
                      checked={checked}
                      disabled={disabled}
                    />
                  </div>
                );
              })}
            </VaRadio>
          </div>
          <div className="preparer-additonal-info">
            {authorizedAgentDescription}
          </div>
        </>
      ) : (
        <span>
          {enumOptions.find(item => item.value === value)?.label || ''}
        </span>
      )}
    </>
  );
}

RadioWidget.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  options: PropTypes.shape({
    enumOptions: PropTypes.array,
    labels: PropTypes.shape({}),
    nestedContent: PropTypes.shape({}),
    widgetProps: PropTypes.shape({}),
    selectedProps: PropTypes.shape({}),
    enableAnalytics: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    errorMessages: PropTypes.shape({}),
  }),
  value: PropTypes.string,
  onChange: PropTypes.func,
};
