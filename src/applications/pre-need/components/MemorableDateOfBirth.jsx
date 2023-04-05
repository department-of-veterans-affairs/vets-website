import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import get from 'platform/utilities/data/get';
import { setData } from 'platform/forms-system/src/js/actions';
import { selectMemorableDateOfBirth } from '../redux-selectors';

const MemorableDateOfBirth = ({ showDateOfBirth, formData }) => {
  const dispatch = useDispatch();

  const handleClick = event => {
    const content = event.target.value;
    const updatedFormData = set(
      'application.claimant.dateOfBirth',
      content,
      { ...formData }, // make a copy of the original formData
    );
    dispatch(setData(updatedFormData));
  };

  return (
    <>
      {!showDateOfBirth && (
        <VaMemorableDate
          value={get('application.claimant.dateOfBirth', formData)}
          onDateChange={handleClick}
        />
      )}
      {showDateOfBirth && <p>Toggle is OFF</p>}
    </>
  );
};

const mapStateToProps = state => ({
  showDateOfBirth: selectMemorableDateOfBirth(state),
  formData: state.form?.data,
});

export default connect(mapStateToProps)(MemorableDateOfBirth);
