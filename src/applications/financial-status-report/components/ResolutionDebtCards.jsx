import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { setData } from 'platform/forms-system/src/js/actions';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const ExpandedContent = ({ debt, updateDebts, error }) => {
  const inputError = error && !debt.resolution.offerToPay;
  const checkboxError = error && !debt.resolution.agreeToWaiver;
  const objKey = 'offerToPay';

  switch (debt.resolution.resolutionType) {
    case 'Extended monthly payments':
      return (
        <div className="currency-input">
          <TextInput
            additionalClass="input-size-3"
            label="How much can you afford to pay monthly on this debt?"
            field={{ value: debt.resolution?.offerToPay || '' }}
            onValueChange={({ value }) => updateDebts(objKey, value, debt)}
            errorMessage={inputError && 'Please enter an amount'}
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
            field={{ value: debt.resolution?.offerToPay || '' }}
            onValueChange={({ value }) => updateDebts(objKey, value, debt)}
            errorMessage={inputError && 'Please enter an amount'}
            required
          />
        </div>
      );
    default:
      return (
        <>
          <Checkbox
            label="By checking this box, I’m agreeing that I understand how a debt waiver may affect my VA education benefits. If VA grants me a waiver, this will reduce any remaining education benefit entitlement I may have."
            checked={debt.resolution?.agreeToWaiver || false}
            onValueChange={value => updateDebts('agreeToWaiver', value, debt)}
            errorMessage={checkboxError && 'Please provide a response'}
            required
          />
          <p>
            Note: If you have questions about this, call us at{' '}
            <Telephone contact={CONTACTS.DMC || '800-827-0648'} /> (or{' '}
            <Telephone
              contact={CONTACTS.DMC_OVERSEAS || '1-612-713-6415'}
              pattern={PATTERNS.OUTSIDE_US}
            />{' '}
            from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00
            p.m. ET.
          </p>
        </>
      );
  }
};

const ResolutionDebtCards = ({
  formData,
  selectedDebts,
  setDebts,
  formContext,
}) => {
  const [error, setError] = useState(false);

  useEffect(
    () => {
      setError(formContext.submitted);
    },
    [formContext.submitted],
  );

  const updateDebts = (objKey, value, debt) => {
    setDebts({
      ...formData,
      selectedDebts: selectedDebts.map(item => {
        if (item.id === debt.id && objKey === 'resolutionType') {
          return {
            ...item,
            resolution: {
              [`${objKey}`]: value,
            },
          };
        }
        if (item.id === debt.id) {
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

  return (
    <>
      <h4 className="vads-u-margin--0">Your selected debts</h4>
      {selectedDebts.map(debt => {
        const objKey = 'resolutionType';
        const radioError = error && !debt.resolution.resolutionType;
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
                label="Which repayment or relief option would you like for this debt?"
                options={['Waiver', 'Extended monthly payments', 'Compromise']}
                value={{ value: debt.resolution?.resolutionType }}
                onValueChange={({ value }) => updateDebts(objKey, value, debt)}
                errorMessage={radioError && 'Please provide a response'}
                required
              />
              <ExpandedContent
                debt={debt}
                updateDebts={updateDebts}
                error={error}
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
)(ResolutionDebtCards);
