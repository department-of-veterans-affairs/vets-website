import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { scrollAndFocus } from 'platform/utilities/ui';
import YesNoWidget from 'platform/forms-system/src/js/widgets/YesNoWidget';
import { INSURANCE_VIEW_FIELDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const InsuranceCoverageField = ({ defaultValue, error, hasList, onChange }) => {
  const fieldsetRef = useRef(null);

  // set focus to this component on form error
  useEffect(
    () => {
      if (error && fieldsetRef?.current) {
        scrollAndFocus(fieldsetRef?.current);
      }
    },
    [error, fieldsetRef],
  );

  return (
    <fieldset
      ref={fieldsetRef}
      className={classNames({
        'schemaform-field-template': true,
        'schemaform-first-field': !hasList,
        'usa-input-error': error,
      })}
    >
      {/** Question title */}
      <legend
        id={`root_${INSURANCE_VIEW_FIELDS.add}-label`}
        className={classNames({
          'schemaform-label': true,
          'usa-input-error-label': error,
        })}
      >
        {!hasList
          ? content['insurance-coverage-question']
          : content['insurance-coverage-question-addtl']}
        <span className="schemaform-required-span">
          {content['validation-required-label']}
        </span>
      </legend>

      {/** Error message */}
      {error ? (
        <span
          role="alert"
          id={`root_${INSURANCE_VIEW_FIELDS.add}-message`}
          className="usa-input-error-message"
        >
          <span className="sr-only">{content['validation-error-label']}</span>{' '}
          {content['validation-error-message-generic']}
        </span>
      ) : null}

      {/** Radio options */}
      <div className="schemaform-widget-wrapper">
        <YesNoWidget
          id={`root_${INSURANCE_VIEW_FIELDS.add}`}
          value={defaultValue}
          onChange={onChange}
        />
      </div>
    </fieldset>
  );
};

InsuranceCoverageField.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  error: PropTypes.bool,
  hasList: PropTypes.bool,
  onChange: PropTypes.func,
};

InsuranceCoverageField.defaultProps = {
  defaultValue: null,
  error: false,
};

export default InsuranceCoverageField;
