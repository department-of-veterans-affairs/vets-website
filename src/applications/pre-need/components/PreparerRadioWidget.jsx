import React from 'react';
import PropTypes from 'prop-types';

import { isReactComponent } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import environment from 'platform/utilities/environment';
import ExpandingGroup from 'platform/forms-system/src/js/components/ExpandingGroup';

export default function RadioWidget({
  options,
  value,
  disabled,
  onChange,
  id,
}) {
  const {
    enumOptions,
    labels = {},
    nestedContent = {},
    widgetProps = {},
    selectedProps = {},
    enableAnalytics = false,
  } = options;

  const getProps = (key, checked) => ({
    ...(widgetProps[key] || {}),
    ...((checked && selectedProps[key]) || {}),
  });

  // nested content could be a component or just jsx/text
  let content = nestedContent[value];
  if (isReactComponent(content)) {
    const NestedContent = content;
    content = <NestedContent />;
  }

  const onChangeEvent = option => {
    if (enableAnalytics) {
      // title may be a React component
      const title = options.title?.props?.children || options.title || '';
      // this check isn't ideal since the message may exist and the question
      // may be dynamically toggled between being required or not
      const required = !!options.errorMessages?.required;
      recordEvent({
        event: 'int-radio-button-option-click',
        'radio-button-label': title,
        'radio-button-optionLabel': option.label,
        'radio-button-required': required,
      });
    }
    onChange(option.value);
  };

  return (
    <>
      <div>
        {enumOptions.map((option, i) => {
          const checked = option.value === value;
          const radioButton = (
            <div className="form-radio-buttons" key={option.value}>
              <input
                type="radio"
                checked={checked}
                autoComplete="off"
                id={`${id}_${i}`}
                name={`${id}`}
                value={option.value}
                disabled={disabled}
                onChange={_ => onChangeEvent(option)}
                {...getProps(option.value, checked)}
              />
              <label htmlFor={`${id}_${i}`}>
                {labels[option.value] || option.label}
              </label>
            </div>
          );

          if (nestedContent[option.value]) {
            return (
              <ExpandingGroup open={checked} key={option.value}>
                {radioButton}
                <div className="schemaform-radio-indent">{content}</div>
              </ExpandingGroup>
            );
          }

          return radioButton;
        })}
      </div>
      <va-additional-info
        trigger={
          environment.isProduction()
            ? 'Who can a preparer sign for?'
            : "If you're applying for someone else, who can you sign for?"
        }
      >
        <p>
          A preparer can sign for an{' '}
          {environment.isProduction() ? 'individual' : 'applicant'} who’s:
        </p>
        <ul>
          {environment.isProduction() ? (
            <>
              <li>
                Under 18 years of age, <strong>or</strong>
              </li>
              <li>
                Is mentally incompetent, <strong>or</strong>
              </li>
              <li>Is physically unable to sign the application</li>
            </>
          ) : (
            <>
              <li>
                Mentally incompetent <strong>or</strong>
              </li>
              <li>Physically unable to sign the application</li>
            </>
          )}
        </ul>
        {environment.isProduction() && (
          <p>
            If you’re the preparer of this application, you’ll need to provide
            your contact information.
          </p>
        )}
      </va-additional-info>
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
