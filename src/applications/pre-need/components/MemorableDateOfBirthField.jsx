import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { setData } from 'platform/forms-system/src/js/actions';

const MemorableDateOfBirth = ({ formData }) => {
  const [dateVal, setDateVal] = useState(
    get('application.claimant.dateOfBirth', formData),
  );
  const [errorVal, setErrorVal] = useState('');
  const today = new Date();
  // new Date as YYYY-MM-DD is giving the day prior to the day select
  // new Date as YYYY MM DD is giving the correct day selected
  const dateInput = new Date(dateVal?.split('-').join(' '));
  const dispatch = useDispatch();

  function handleDateBlur() {
    if (dateInput > today) {
      setErrorVal('Date must be in the past');
    } else {
      setErrorVal('');
    }
  }

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
    <>
      <VaMemorableDate
        label="Date of birth"
        required
        error={errorVal}
        value={dateVal}
        onDateBlur={() => handleDateBlur()}
        onDateChange={handleClick}
      />
    </>
  );
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(mapStateToProps)(MemorableDateOfBirth);
