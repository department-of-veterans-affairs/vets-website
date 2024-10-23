import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createId } from '../../utils/helpers';

export default function CalculatorSheetResultRow({
  id,
  label,
  value,
  header,
  bold,
  visible,
  boldLabel,
  boldValue,
  plainTextValue,
}) {
  const boldAll = !boldLabel && !boldValue && bold;
  const boldClass = boldCheck =>
    boldCheck ? 'vads-u-font-weight--bold' : null;

  return visible ? (
    <div
      id={`summary-sheet-calculator-result-row-${createId(
        id == null ? label : id,
      )}`}
      className={classNames('row', 'calculator-result', boldClass(boldAll))}
    >
      <div className="small-8 columns">
        {header ? (
          <h5 className="vads-u-margin-y--0">{label}:</h5>
        ) : (
          <div
            className={classNames('vads-u-margin-y--0 ', boldClass(boldLabel))}
          >
            {label}:
          </div>
        )}
      </div>
      <div className="small-4 columns vads-u-text-align--right">
        {header && !plainTextValue ? (
          <h5 className="vads-u-margin-y--0">{value}</h5>
        ) : (
          <div
            className={classNames('vads-u-margin-y--0 ', boldClass(boldValue))}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  ) : null;
}
CalculatorSheetResultRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bold: PropTypes.bool,
  boldLabel: PropTypes.bool,
  boldValue: PropTypes.bool,
  header: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  plainTextValue: PropTypes.bool,
  visible: PropTypes.bool,
};
