import React from 'react';
import { connect } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { selectMemorableDateOfBirth } from '../redux-selectors';

const MemorableDateOfBirthField = props => {
  const { showDateOfBirth } = props;

  if (showDateOfBirth) {
    return (
      <>
        <VaMemorableDate />
      </>
    );
  }
  return <p>Toggle is OFF</p>;
};

function mapStateToProps(state) {
  return {
    showDateOfBirth: selectMemorableDateOfBirth(state),
  };
}

export default connect(mapStateToProps)(MemorableDateOfBirthField);
