import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';

function MemorableDateOfBirth({ formData, dob }) {
  const [dateVal, setDateVal] = useState(dob);
  const dispatch = useDispatch();

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
        value={dateVal}
        onDateBlur={handleClick}
        onDateChange={handleClick}
        style={{ 'margin-top': '0px' }}
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
