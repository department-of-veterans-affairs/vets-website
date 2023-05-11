import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';

function MemorableDateOfBirth({ formData, dob }) {
  const [dateVal, setDateVal] = useState(dob);
  const [errorVal, setErrorVal] = useState('');
  const today = new Date();
  // new Date as YYYY-MM-DD is giving the day prior to the day select
  // new Date as YYYY MM DD is giving the correct day selected
  const dateInput = new Date(dateVal?.split('-').join(' '));
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (dateInput > today) {
        setErrorVal('Please enter a valid current or past date');
      } else {
        setErrorVal('');
      }
    },
    [dateInput, today],
  );
  const handleDateBlur = event => {
    setDateVal(event.target.value);
  };

  const handleClick = event => {
    const content = event.target.value;
    const updatedFormData = set(
      'application.claimant.dateOfBirth',
      content,
      { ...formData }, // make a copy of the original formData
    );
    setDateVal(content);
    dispatch(setData(updatedFormData));
  };

  return (
    <div data-testid="dob-input">
      <VaMemorableDate
        label="Date of birth"
        required
        error={errorVal}
        value={dateVal}
        onDateBlur={handleDateBlur}
        onDateChange={handleClick}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    formData: state.form?.data,
  };
};

export default connect(mapStateToProps)(MemorableDateOfBirth);
