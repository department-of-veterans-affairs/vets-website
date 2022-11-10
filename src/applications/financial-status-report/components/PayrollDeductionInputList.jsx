import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const PayrollDeductionInputList = props => {
  const { goBack, onReviewPage } = props;

  const editIndex = new URLSearchParams(window.location.search).get(
    'editIndex',
  );

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const formData = useSelector(state => state.form.data);
  const employmentRecord =
    formData.personalData.employmentHistory.veteran.employmentRecords[index];

  const { employerName } = employmentRecord;

  const dispatch = useDispatch();
  const data = useSelector(state => state.form.data);
  const { currEmployment = [] } = data;
  const selectedEmployment = currEmployment[0];
  const { deductions = [] } = selectedEmployment;

  const mapDeductions = target => {
    return deductions.map(deduction => {
      if (deduction.name === target.name) {
        return {
          ...deduction,
          amount: target.value,
        };
      }
      return deduction;
    });
  };

  const onChange = obj => {
    const { target } = obj;

    return dispatch(
      setData({
        ...data,
        currEmployment: [
          {
            ...selectedEmployment,
            deductions: mapDeductions(target),
            ...currEmployment.filter(
              job => job.employerName !== selectedEmployment.employerName,
            ),
          },
        ],
      }),
    );
  };
  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <div>
      <h3 className="vads-u-margin-top--neg1p5">Your job at {employerName}</h3>{' '}
      <br />
      <p>How much do you pay for each of your payroll deductions?</p>
      {deductions?.map((deduction, key) => (
        <div key={deduction.name + key} className="vads-u-margin-y--2">
          <va-number-input
            label={deduction.name}
            name={deduction.name}
            value={deduction.amount}
            id={deduction.name + key}
            inputmode="decimal"
            onInput={onChange}
            required
          />
        </div>
      ))}
      {onReviewPage ? updateButton : navButtons}
    </div>
  );
};

export default PayrollDeductionInputList;
