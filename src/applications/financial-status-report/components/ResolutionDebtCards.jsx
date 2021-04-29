import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { setData } from 'platform/forms-system/src/js/actions';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const ExpandedContent = ({ debt, updateDebts }) => {
  const objKey = 'offerToPay';

  const [errors, setErrors] = useState({
    extended: false,
    compromise: false,
    checkbox: false,
  });

  useEffect(
    () => {
      setErrors(prevState => ({
        ...prevState,
        // checkbox: !checked,
        checkbox: false,
      }));
    },
    [debt.resolution?.agreeToWaiver],
  );

  switch (debt.resolution.resolutionType) {
    case 'Extended monthly payments':
      return (
        <div className="currency-input">
          <TextInput
            additionalClass="input-size-3"
            label="How much can you afford to pay monthly on this debt?"
            field={{ value: debt.resolution.offerToPay || '' }}
            onValueChange={({ value }) => updateDebts(objKey, value, debt)}
            errorMessage={errors.extended && 'Please enter an amount'}
            required
          />
        </div>
      );
    case 'Compromise':
      return (
        <div className="currency-input">
          <TextInput
            additionalClass="input-size-3"
            label="How much do you offer to pay for this debt with a single payment?"
            field={{ value: debt.resolution.offerToPay || '' }}
            onValueChange={({ value }) => updateDebts(objKey, value, debt)}
            errorMessage={errors.compromise && 'Please enter an amount'}
            required
          />
        </div>
      );
    default:
      return (
        <Checkbox
          label="By checking this box, I’m agreeing that I understand how a debt waiver may affect my VA education benefits. If VA grants me a waiver, this will reduce any remaining education benefit entitlement I may have."
          checked={debt.resolutionType?.agreeToWaiver}
          onValueChange={value => updateDebts('agreeToWaiver', value, debt)}
          errorMessage={errors.checkbox && 'Please provide a response'}
          required
        />
      );
  }
};

const ResolutionDebtCards = ({ formData, selectedDebts, setDebts }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, []);

  const updateDebts = (objKey, value, debt) => {
    setDebts({
      ...formData,
      selectedDebts: selectedDebts.map(item => {
        if (item.id === debt.id && value === 'Waiver') {
          return {
            ...item,
            resolution: {
              [`${objKey}`]: value,
            },
          };
        }
        if (item.id === debt.id && value !== 'Waiver') {
          return {
            ...item,
            resolution: {
              ...item.resolution,
              [`${objKey}`]: value,
            },
          };
        }
        return item;
      }),
    });
  };

  const radioOptions = ['Waiver', 'Extended monthly payments', 'Compromise'];
  const radioLabels =
    'Which repayment or relief option would you like for this debt?';

  return (
    <>
      <h4 className="vads-u-margin--0">Your selected debts</h4>
      {selectedDebts.map(debt => {
        const objKey = 'resolutionType';
        const title = deductionCodes[debt.deductionCode] || debt.benefitType;
        const subTitle =
          debt.currentAr && formatter.format(parseFloat(debt.currentAr));

        return (
          <div
            key={debt.id}
            className="vads-u-background-color--gray-lightest resolution-card vads-u-padding--3 vads-u-margin-top--2"
          >
            <h4 className="vads-u-margin-top--0">{title}</h4>
            <p>
              <strong>Amount owed: </strong>
              {subTitle}
            </p>
            <ExpandingGroup
              open={debt.resolution?.resolutionType}
              additionalClass="form-expanding-group-active-radio"
            >
              <RadioButtons
                id={debt.id}
                name={debt.id}
                label={radioLabels}
                options={radioOptions}
                value={{ value: debt.resolution?.resolutionType }}
                onValueChange={({ value }) => updateDebts(objKey, value, debt)}
                errorMessage={error && 'Please provide a response'}
                required
              />
              <ExpandedContent debt={debt} updateDebts={updateDebts} />
            </ExpandingGroup>
          </div>
        );
      })}
    </>
  );
};

const mapStateToProps = ({ form }) => ({
  formData: form.data,
  selectedDebts: form.data.selectedDebts,
});

const mapDispatchToProps = {
  setDebts: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResolutionDebtCards);
