import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import { handleScrollOnInputFocus } from '../utils/helpers';

const RadioButtons = ({
  errorMessage,
  label,
  name,
  onChange,
  onFocus,
  options,
  required,
  value,
}) => {
  const inputId = _.uniqueId('radio-buttons-');

  const handleFocus = () => {
    onFocus(`${inputId}-field`);
  };

  const handleChange = e => {
    handleFocus();
    onChange(e);
  };

  const renderOptions = () => {
    const optionsArr = _.isArray(options) ? options : [];
    const storedValue = value;
    return optionsArr.map((obj, index) => {
      let optionLabel;
      let optionValue;
      let optionAdditional;
      let learnMore;
      if (_.isString(obj)) {
        optionLabel = obj;
        optionValue = obj;
      } else {
        optionLabel = obj.label;
        optionValue = obj.value;
        if (obj.additional) {
          optionAdditional = <div>{obj.additional}</div>;
        }
        if (obj.learnMore) {
          learnMore = obj.learnMore;
        }
      }
      const checked = optionValue === storedValue ? 'checked=true' : '';
      const inputElementId = `${inputId}-${index}`;
      const labelId = `${inputElementId}-label`;
      const radioButton = (
        <div
          key={optionAdditional ? undefined : index}
          className="form-radio-buttons gids-radio-buttons"
        >
          <input
            className="gids-radio-buttons-input"
            checked={checked}
            id={inputElementId}
            name={name}
            type="radio"
            value={optionValue}
            onChange={handleChange}
            aria-labelledby={`${inputElementId}-legend ${labelId}`}
          />
          <label
            id={labelId}
            name={`${name}-${index}-label`}
            htmlFor={inputElementId}
            className="vads-u-margin-top--1 vads-u-margin-bottom--1"
          >
            {optionLabel}
          </label>
          {learnMore}
        </div>
      );

      let output = radioButton;

      // Return an expanding group for buttons with additional content
      if (optionAdditional) {
        output = (
          <ExpandingGroup
            additionalClass="form-expanding-group-active-radio"
            open={checked}
            key={index}
          >
            {radioButton}
            <div>{optionAdditional}</div>
          </ExpandingGroup>
        );
      }

      return output;
    });
  };

  // TODO: extract error logic into a utility function
  // Calculate error state.
  let errorSpan = '';
  let errorSpanId = undefined;
  if (errorMessage) {
    errorSpanId = `${inputId}-error-message`;
    errorSpan = (
      <span className="usa-input-error-message" role="alert" id={errorSpanId}>
        <span className="sr-only">Error</span> {errorMessage}
      </span>
    );
  }

  // Calculate required.
  let requiredSpan = undefined;
  if (required) {
    requiredSpan = <span className="form-required-span">*</span>;
  }

  return (
    <div
      id={`${inputId}-field`}
      className={classNames('vads-u-margin-top--3', {
        'usa-input-error': errorMessage,
      })}
    >
      <fieldset>
        <div>
          <span
            id={`${inputId}-legend`}
            className={errorMessage ? 'usa-input-error-label' : 'gibct-legend'}
          >
            {label}
            {requiredSpan}
          </span>
          {errorSpan}
          {renderOptions()}
        </div>
      </fieldset>
    </div>
  );
};

RadioButtons.propTypes = {
  errorMessage: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        additional: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        learnMore: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      }),
    ]),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  onFocus: PropTypes.func,
};

RadioButtons.defaultProps = {
  onFocus: handleScrollOnInputFocus,
};

export default RadioButtons;
