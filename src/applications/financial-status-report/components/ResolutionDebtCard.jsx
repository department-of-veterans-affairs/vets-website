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

const ExpandedContent = ({ debt, updateDebts, showError }) => {
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
  const objKey = 'offerToPay';

  useEffect(
    () => {
      if (showError && !checked) {
        setError(true);
      } else {
        setError(false);
      }
    },
    [checked, showError],
  );

  switch (debt.value) {
    case 'Extended monthly payments':
      return (
        <div className="currency-input">
          <TextInput
            additionalClass="input-size-3"
            label="How much can you afford to pay monthly on this debt?"
            field={{ value: debt.offerToPay || '' }}
            onValueChange={input => updateDebts(objKey, input, debt)}
            //   required
          />
        </div>
      );
    case 'Compromise':
      return (
        <div className="currency-input">
          <TextInput
            additionalClass="input-size-3 currency-input"
            label="How much do you offer to pay for this debt with a single payment?"
            field={{ value: debt.offerToPay || '' }}
            onValueChange={input => updateDebts(objKey, input, debt)}
            //   required
          />
        </div>
      );
    default:
      return (
        <Checkbox
          label="By checking this box, I’m agreeing that I understand how a debt waiver may affect my VA education benefits. If VA grants me a waiver, this will reduce any remaining education benefit entitlement I may have."
          checked={checked}
          onValueChange={value => setChecked(value)}
          errorMessage={error && 'Check the box!!'}
          //   required
        />
      );
  }
};

const ResolutionDebtCard = ({ formData, selectedDebts, setDebts }) => {
  const radioOptions = ['Waiver', 'Extended monthly payments', 'Compromise'];
  const radioLabels =
    'Which repayment or relief option would you like for this debt?';

  const updateDebts = (objKey, input, debt) => {
    setDebts({
      ...formData,
      selectedDebts: selectedDebts.map(item => {
        if (item.id === debt.id) {
          return {
            ...item,
            [`${objKey}`]: input.value,
          };
        }
        return item;
      }),
    });
  };

  return (
    <>
      <h4 className="vads-u-margin--0">Your selected debts</h4>
      {selectedDebts.map(debt => {
        const objKey = 'value';
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
              open={debt.value}
              additionalClass="form-expanding-group-active-radio"
            >
              <RadioButtons
                id={debt.id}
                name={debt.id}
                label={radioLabels}
                options={radioOptions}
                value={{ value: debt.value }}
                onValueChange={input => updateDebts(objKey, input, debt)}
                // required
              />
              <ExpandedContent
                debt={debt}
                updateDebts={updateDebts}
                // showError
              />
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
)(ResolutionDebtCard);
