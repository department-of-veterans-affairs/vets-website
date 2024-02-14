import React from 'react';
import PropTypes from 'prop-types';
import {
  VaCheckboxGroup,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import _ from 'lodash';

const VaCheckboxGroupGi = ({
  errorMessage,
  label,
  onChange,
  options,
  row = false,
  isVaGroup = true,
}) => {
  const inputId = _.uniqueId('checkbox-group-');
  // If Row is true then style checkboxes in a row within a container
  // with 16px margin to the left and right of the label
  const checkBoxStyleGrid = row ? 'vads-l-grid-container' : '';
  const checkBoxStyleRow = row ? 'vads-l-row-gi' : '';

  const renderOptions = () => {
    const displayOptions = Array.isArray(options) ? options : [];
    return displayOptions.map((option, index) => {
      const { checked, optionLabel, name } = option;
      let checkboxLabel = optionLabel;
      if (typeof optionLabel !== 'string') {
        checkboxLabel = optionLabel?.props?.children;
        // return "";
      }

      return (
        <VaCheckbox
          key={label}
          data-index={index}
          label={checkboxLabel}
          checked={checked}
          onVaChange={target => {
            onChange(target, name);
          }}
          class="vads-l-col--1p5 about-school-checkbox"
        />
      );
    });
  };
  if (isVaGroup) {
    return (
      <VaCheckboxGroup
        label={label}
        error={null} // form system validation handles this
        label-header-level={5}
      >
        {renderOptions()}
      </VaCheckboxGroup>
    );
  }
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

VaCheckboxGroupGi.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      }),
    ]),
  ).isRequired,
  row: PropTypes.bool,
  isVaGroup: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export default VaCheckboxGroupGi;
