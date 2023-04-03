import React, { useState } from 'react';
import { connect } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { selectMemorableDateOfBirth } from '../redux-selectors';

const MemorableDateOfBirthField = props => {
  const { showDateOfBirth, formData } = props;
  const [dateOfBirth, setDateOfBirth] = useState(
    get('application.claimant.dateOfBirth', formData),
  );
  // console.log(formData);
  const updateField = event => {
    const claimant = set(
      'dateOfBirth',
      event.target.value,
      formData.application?.claimant,
    );
    setDateOfBirth(claimant?.dateOfBirth);
    // console.log(dateOfBirth);
  };

  if (showDateOfBirth) {
    return (
      <>
        <VaMemorableDate
          value={dateOfBirth}
          onDateBlur={updateField}
          onDateChange={updateField}
        />
      </>
    );
  }
  return <p>Toggle is OFF</p>;
};

function mapStateToProps(state) {
  return {
    showDateOfBirth: selectMemorableDateOfBirth(state),
    formData: state.form?.data,
  };
}

export default connect(mapStateToProps)(MemorableDateOfBirthField);
