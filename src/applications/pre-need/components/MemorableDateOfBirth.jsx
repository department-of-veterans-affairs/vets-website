import React from 'react';
import { connect } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { selectMemorableDateOfBirth } from '../redux-selectors';

const MemorableDateOfBirthField = props => {
  const { showDateOfBirth, formData } = props;

  // console.log(formData);
  const updateField = event => {
    const claimant = set(
      'application.claimant.dateOfBirth',
      event.target.value,
      formData,
    );
    // console.log(claimant);
    return set('application.claimant', claimant, formData);
  };

  if (showDateOfBirth) {
    return (
      <>
        <VaMemorableDate
          value={get('application.claimant.dateOfBirth', formData)}
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
