import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { scrollAndFocus } from 'platform/utilities/scroll';
import YesNoWidget from 'platform/forms-system/src/js/widgets/YesNoWidget';
import { DEPENDENT_VIEW_FIELDS, LAST_YEAR } from '../../utils/constants';
import content from '../../locales/en/content.json';

const yesNoLabels = hasList => {
  if (hasList) {
    return {
      labels: {
        Y: content['household-dependent-report-yes-addtl'],
        N: content['household-dependent-report-no-addtl'],
      },
    };
  }
  return {
    labels: {
      Y: content['household-dependent-report-yes'],
      N: content['household-dependent-report-no'],
    },
  };
};

const DependentDeclaration = ({ defaultValue, error, hasList, onChange }) => {
  const fieldsetRef = useRef(null);
  const labels = yesNoLabels(hasList);

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
        id={`root_${DEPENDENT_VIEW_FIELDS.add}-label`}
        className={classNames({
          'schemaform-label': true,
          'usa-input-error-label': error,
        })}
      >
        {!hasList
          ? content['household-dependent-report-question']
          : content['household-dependent-report-question-addtl']}
        <span className="schemaform-required-span">
          {content['validation-required-label']}
        </span>
        <p className="usa-hint">
          We consider your spouse, including same-sex and common-law marriages,
          to be your dependent.
        </p>
        <p className="usa-hint">
          Your unmarried child can also be your dependent if they are under 18
          years old, between 18 and 23 years old and enrolled in school in{' '}
          {LAST_YEAR}, or they’re living with a permanent disability that
          happened before they turned 18 years old.
        </p>
        <p className="usa-hint">You can add up to six dependents.</p>
      </legend>

      {/** Error message */}
      {error ? (
        <span
          role="alert"
          id={`root_${DEPENDENT_VIEW_FIELDS.add}-message`}
          className="usa-input-error-message"
        >
          <span className="sr-only">{content['validation-error-label']}</span>{' '}
          {content['validation-error-message-generic']}
        </span>
      ) : null}

      {/** Radio options */}
      <div className="schemaform-widget-wrapper">
        <YesNoWidget
          id={`root_${DEPENDENT_VIEW_FIELDS.add}`}
          value={defaultValue}
          onChange={onChange}
          options={labels}
        />
      </div>
    </fieldset>
  );
};

DependentDeclaration.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  error: PropTypes.bool,
  hasList: PropTypes.bool,
  onChange: PropTypes.func,
};

DependentDeclaration.defaultProps = {
  defaultValue: null,
  error: false,
};

export default DependentDeclaration;
