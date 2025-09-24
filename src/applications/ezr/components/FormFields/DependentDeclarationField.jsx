import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { scrollAndFocus } from 'platform/utilities/scroll';
import YesNoWidget from 'platform/forms-system/src/js/widgets/YesNoWidget';
import { DEPENDENT_VIEW_FIELDS } from '../../utils/constants';
import content from '../../locales/en/content.json';

const yesNoLabels = hasList => ({
  labels: {
    Y: content[`household-dependent-report-yes${hasList ? '-addtl' : ''}`],
    N: content[`household-dependent-report-no${hasList ? '-addtl' : ''}`],
  },
});

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
        <span className="vads-u-display--block vads-u-margin-top--2">
          {!hasList
            ? content['household-dependent-report-question']
            : content['household-dependent-report-question-addtl']}
        </span>
        <span className="schemaform-required-span">
          {content['validation-required-label']}
        </span>
        <p className="usa-hint vads-u-margin-bottom--0">
          You can add up to six dependents.
        </p>
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
