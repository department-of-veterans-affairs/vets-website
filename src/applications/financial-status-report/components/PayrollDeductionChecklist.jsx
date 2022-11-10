import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { payrollDeductionOptions } from '../constants/checkboxSelections';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const PayrollDeductionChecklist = props => {
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

  const { currEmployment = [] } = formData;
  const selectedEmployment = currEmployment[0];
  const { deductions = [] } = selectedEmployment ?? [];

  const onChange = ({ target }) => {
    const { value } = target;

    return deductions.some(source => source.name === value)
      ? dispatch(
          setData({
            ...formData,
            currEmployment: [
              {
                ...selectedEmployment,
                deductions: deductions.filter(source => source.name !== value),
              },
              ...currEmployment.filter(
                job => job.employerName !== selectedEmployment.employerName,
              ),
            ],
          }),
        )
      : dispatch(
          setData({
            ...formData,
            currEmployment: [
              {
                ...selectedEmployment,
                deductions: [...deductions, { name: value, amount: '' }],
              },
              ...currEmployment.filter(
                job => job.employerName !== selectedEmployment.employerName,
              ),
            ],
          }),
        );
  };

  const isBoxChecked = option => {
    return deductions.some(incomeValue => incomeValue.name === option);
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <>
      <h3 className="vads-u-margin-top--neg1p5">Your job at {employerName}</h3>{' '}
      <br />
      <div className="checkbox-list">
        {payrollDeductionOptions?.map((option, key) => (
          <div key={option + key} className="checkbox-list-item">
            <input
              type="checkbox"
              id={option + key}
              name={option}
              value={option}
              checked={isBoxChecked(option)}
              onChange={onChange}
            />
            <label className="vads-u-margin-y--2" htmlFor={option + key}>
              {option}
            </label>
          </div>
        ))}
      </div>
      {onReviewPage ? updateButton : navButtons}
    </>
  );
};

export default PayrollDeductionChecklist;
