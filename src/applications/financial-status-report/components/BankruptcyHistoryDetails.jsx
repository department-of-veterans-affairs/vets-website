import React, { useState } from 'react';
import moment from 'moment';
import { useSelector, connect } from 'react-redux';
import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isDateComplete } from '../utils/helpers';

const BankruptcyHistoryDetails = props => {
  const [ariaDescribedby, setAriaDescribedby] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const dateTemplate = 'YYYY-MM-DD';

  const { setFormData } = props;

  const formData = useSelector(state => state.form.data);

  // const [selectedDeductions, setSelectedDeductions] = useState(deductions);

  // const mapDeductions = target => {
  //   return selectedDeductions.map(deduction => {
  //     if (deduction.name === target.name) {
  //       return {
  //         ...deduction,
  //         amount: target.value,
  //       };
  //     }
  //     return deduction;
  //   });
  // };

  // const onChange = event => {
  //   const { target } = event;
  //   const updatedDeductions = mapDeductions(target);
  //   setSelectedDeductions(updatedDeductions);
  // };

  const onDateChange = event => {
    const pageState = event.target.value || '';
    const date = isDateComplete(pageState)
      ? moment(pageState, dateTemplate)
      : null;

    if (date) {
      // only set when there's a valid date
      setAriaDescribedby(date);
    } else {
      setAriaDescribedby('');
    }

    let error = null;
    if (isDirty || date) {
      if (date) {
        // show an error message right away
        setIsDirty(true);
      } else {
        error = 'Please provide a valid date';
      }
    }
    setErrorMessage(error);
  };

  const updateFormData = e => {
    e.preventDefault();

    setFormData({
      ...formData,
      additionalData: {
        bankruptcy: {
          dateDischarged: '2004-10-XX',
          courtLocation: 'Tampa, FL',
          docketNumber: '123456',
        },
        additionalComments: 'Supporting personal statement...',
      },
    });
  };

  return (
    <form onSubmit={updateFormData}>
      <h3 className="vads-u-margin-top--neg1p5">Your bankruptcy details</h3>{' '}
      <VaDate
        label="Date a court granted you a bankruptcy discharge"
        onDateChange={onDateChange}
        name="discharge-date"
        value={formData.additionalData.bankruptcy.dateDischarged}
        error={errorMessage}
        ariaDescribedby={ariaDescribedby}
      />
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BankruptcyHistoryDetails);
