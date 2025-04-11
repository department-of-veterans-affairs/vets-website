import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { scrollAndFocus } from 'platform/utilities/ui';
import YesNoWidget from 'platform/forms-system/src/js/widgets/YesNoWidget';
import { DependentDescription } from '../FormDescriptions';

const DependentDeclaration = ({ defaultValue, error, hasList, onChange }) => {
  const fieldsetRef = useRef(null);

  // set focus to this component on form error
  useEffect(() => {
    if (error && fieldsetRef?.current) {
      scrollAndFocus(fieldsetRef?.current);
    }
  }, [error, fieldsetRef]);

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
        id="root_view:reportDependents-label"
        className={classNames({
          'schemaform-label': true,
          'usa-input-error-label': error,
        })}
      >
        Do you have {hasList ? 'another dependent' : 'any dependents'} to
        report?
        <span className="schemaform-required-span">(*Required)</span>
      </legend>

      {/** Additional Info component for description */}
      <DependentDescription />

      {/** Error message */}
      {error ? (
        <span
          role="alert"
          id="root_view:reportDependents-message"
          className="usa-input-error-message"
        >
          <span className="sr-only">Error</span> Please provide a response
        </span>
      ) : null}

      {/** Radio options */}
      <div className="schemaform-widget-wrapper">
        <YesNoWidget
          id="root_view:reportDependents"
          value={defaultValue}
          onChange={onChange}
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
