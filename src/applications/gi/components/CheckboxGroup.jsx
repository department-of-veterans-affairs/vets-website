import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { handleScrollOnInputFocus, createId } from '../utils/helpers';

const CheckboxGroup = ({
  errorMessage,
  label,
  onChange,
  onFocus,
  options,
  row = false,
  colNum = null,
  labelMargin = '1p5',
  className,
}) => {
  const inputId = _.uniqueId('checkbox-group-');

  // If Row is true then style checkboxes in a row within a container
  // with 16px margin to the left and right of the label
  const checkBoxStyleGrid = row ? 'vads-l-grid-container' : '';
  const checkBoxStyleRow = row ? 'vads-l-row' : '';
  const checkBoxStyleColOption =
    colNum != null ? `vads-l-col--${colNum}` : 'vads-l-col';
  const checkBoxStyleCol = row ? checkBoxStyleColOption : '';
  const checkBoxLabelMargin = row ? `vads-u-margin-right--${labelMargin}` : '';

  const renderOptions = () => {
    const displayOptions = Array.isArray(options) ? options : [];
    return displayOptions.map((option, index) => {
      const { checked, optionLabel, name, learnMore, dataTestId } = option;
      return (
        <div key={index} className={`${checkBoxStyleCol} ${className}`}>
          <input
            checked={checked}
            id={`${inputId}-${index}`}
            name={name}
            data-testid={dataTestId}
            type="checkbox"
            onFocus={() => onFocus(`${inputId}-${index}`)}
            onChange={onChange}
            aria-labelledby={`${inputId}-legend ${createId(
              name,
            )}-${index}-label`}
          />
          <label
            className={`gi-checkbox-label ${checkBoxLabelMargin}`}
            id={`${createId(name)}-${index}-label`}
            name={`${name}-label`}
            htmlFor={`${inputId}-${index}`}
          >
            {optionLabel}
          </label>
          {learnMore}
        </div>
      );
    });
  };

  return (
    <div className={errorMessage ? 'usa-input-error' : ''}>
      <fieldset>
        <div className={checkBoxStyleGrid}>
          <span id={`${inputId}-legend`} className="gibct-legend">
            {label}
          </span>
          <div className={checkBoxStyleRow}>{renderOptions()}</div>
        </div>
      </fieldset>
    </div>
  );
};

CheckboxGroup.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      }),
    ]),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  row: PropTypes.bool,
};

CheckboxGroup.defaultProps = {
  onFocus: handleScrollOnInputFocus,
};

export default CheckboxGroup;
