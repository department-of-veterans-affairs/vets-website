import React from 'react';
import { createId } from '../../utils/helpers';
import classNames from 'classnames';

export const CalculatorResultRow = ({
  id,
  label,
  value,
  header,
  bold,
  visible,
  labelBold,
  valueBold,
}) => {
  const boldAll = !labelBold && !valueBold && bold;
  const boldClass = boldCheck => (boldCheck ? 'bold' : null);

  return visible ? (
    <div
      id={`calculator-result-row-${createId(id == null ? label : id)}`}
      className={classNames('row', 'calculator-result', boldClass(boldAll))}
    >
      <div className={classNames('small-6', 'columns', boldClass(labelBold))}>
        {header ? <h4>{label}:</h4> : <div>{label}:</div>}
      </div>
      <div
        className={classNames(
          'small-6',
          'columns',
          'vads-u-text-align--right',
          boldClass(valueBold),
        )}
      >
        {header ? <h5>{value}</h5> : <div>{value}</div>}
      </div>
    </div>
  ) : null;
};

export default CalculatorResultRow;
