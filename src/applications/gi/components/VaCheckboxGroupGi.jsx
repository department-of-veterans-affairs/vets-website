import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { handleScrollOnInputFocus } from '../utils/helpers';

const calculateGap = (row, padding) => {
  if (padding) {
    return 'v3-checkbox-vads-l-row';
  }
  return row ? 'vads-l-row' : '';
};

const VACheckboxGroupGi = ({
  errorMessage,
  label,
  onChange,
  onFocus,
  options,
  row = false,
  padding = false,
  colNum = null,
  labelMargin = '1p5',
  className,
  // focusOnFirstInput,
  // setIsCleared,
}) => {
  const inputId = _.uniqueId('checkbox-group-');

  // If Row is true then style checkboxes in a row within a container
  // with 16px margin to the left and right of the label
  const checkBoxStyleGrid = row ? 'vads-l-grid-container' : '';
  const checkBoxStyleRow = calculateGap(row, padding);
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
          <VaCheckbox
            key={optionLabel}
            data-index={index}
            label={optionLabel}
            data-testid={dataTestId}
            label-header-level="3"
            checked={checked}
            onFocus={() => onFocus(`${inputId}-${index}`)}
            onVaChange={target => {
              onChange(target, name);
            }}
            enable-analytics
            uswds
          />
          <label
            className={`gi-checkbox-label ${checkBoxLabelMargin}`}
            aria-hidden
          >
            {learnMore}
          </label>
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

VACheckboxGroupGi.propTypes = {
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
  padding: PropTypes.bool,
};

VACheckboxGroupGi.defaultProps = {
  onFocus: handleScrollOnInputFocus,
};

export default VACheckboxGroupGi;
