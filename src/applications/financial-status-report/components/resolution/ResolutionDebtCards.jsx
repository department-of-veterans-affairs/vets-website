import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaNumberInput,
  VaRadio,
  VaRadioOption,
  VaTelephone,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import { setData } from 'platform/forms-system/src/js/actions';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/Telephone';
import { deductionCodes } from '../../constants/deduction-codes';
import { currency } from '../../utils/helpers';

const ExpandedContent = ({
  index,
  debt,
  updateDebts,
  submitted,
  errorSchema,
}) => {
  const currentSchema = errorSchema[index];
  const inputErrMsg = currentSchema?.resolution?.offerToPay?.__errors[0];
  const checkboxErrMsg = currentSchema?.resolution?.agreeToWaiver?.__errors[0];
  const objKey = 'offerToPay';

  switch (debt.resolution?.resolutionType) {
    case 'Extended monthly payments':
      return (
        <div>
          <VaNumberInput
            className="no-wrap input-size-3"
            currency
            error={(submitted && inputErrMsg) || null}
            id="monthly"
            value={debt.resolution.offerToPay || ''}
            label="How much can you pay monthly on this debt?"
            name="extended-payment-resolution-amount"
            onInput={e => {
              updateDebts(objKey, e.target.value, debt);
            }}
            required
            type="text"
          />
        </div>
      );
    case 'Compromise':
      return (
        <div>
          <VaNumberInput
            className="no-wrap input-size-3"
            currency
            error={(submitted && inputErrMsg) || null}
            id="compromise"
            label="What is your offer for a one-time payment?"
            name="compromise-resolution-amount"
            value={debt.resolution.offerToPay || ''}
            onInput={e => {
              updateDebts(objKey, e.target.value, debt);
            }}
            required
            type="text"
          />
        </div>
      );
    default:
      return (
        <>
          <Checkbox
            name="agree-to-waiver"
            label="By checking this box, I’m agreeing that I understand how a debt waiver may affect my VA education benefits. If VA grants me a waiver, this will reduce any remaining education benefit entitlement I may have."
            checked={debt.resolution?.agreeToWaiver || false}
            onValueChange={value => updateDebts('agreeToWaiver', value, debt)}
            errorMessage={submitted && checkboxErrMsg}
          />
          <p>
            Note: If you have questions about this, call us at{' '}
            <VaTelephone contact={CONTACTS.DMC || '800-827-0648'} /> (or{' '}
            <VaTelephone
              contact={CONTACTS.DMC_OVERSEAS || '1-612-713-6415'}
              international
            />{' '}
            from overseas). We’re here Monday through Friday, 7:30 a.m. to 7:00
            p.m. ET.
          </p>
        </>
      );
  }
};

ExpandedContent.propTypes = {
  debt: PropTypes.object,
  errorSchema: PropTypes.object,
  index: PropTypes.number,
  submitted: PropTypes.bool,
  updateDebts: PropTypes.func,
};

const ResolutionDebtCards = ({
  formData,
  selectedDebts,
  setDebts,
  formContext,
}) => {
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
  const radioLabel = 'Which option would you like for this debt?';
  const options = [
    {
      value: 'Waiver',
      label: 'Waiver',
    },
    {
      value: 'Extended monthly payments',
      label: 'Extended monthly payments',
    },
    {
      value: 'Compromise',
      label: 'Compromise',
    },
  ];

  return (
    <>
      <h4 className="resolution-options-debt-title">Your selected debts</h4>
      {selectedDebts.map(debt => {
        const objKey = 'resolutionType';
        const { submitted } = formContext;
        const radioError = submitted && !debt.resolution?.resolutionType;
        const title = deductionCodes[debt.deductionCode] || debt.benefitType;
        const subTitle = currency(debt?.currentAr);
        const radioButtonProps = {
          label: radioLabel,
          initialValue: debt.resolution?.resolutionType,
          onVaValueChange: e => {
            if (e.returnValue) {
              updateDebts(objKey, e.detail.value, debt);
            }
          },
          error: radioError ? 'Please select a debt resolution option' : null,
        };
        return (
          <div
            key={debt.id}
            className="vads-u-background-color--gray-lightest resolution-cards vads-u-padding--3 vads-u-margin-top--2"
          >
            <h4 className="vads-u-margin-top--0">{title}</h4>
            <p>
              <strong>Amount owed: </strong>
              {subTitle}
            </p>
            <VaRadio
              className="vads-u-margin-y--2"
              {...radioButtonProps}
              required
            >
              {options.map((option, i) => (
                <VaRadioOption
                  key={`${option.value}-${i}`}
                  id={`${debt.id}-${i}-label`}
                  label={option.label}
                  value={option.value}
                  checked={debt.resolution?.resolutionType === option.value}
                  className="vads-u-margin-y--3"
                  ariaDescribedby={
                    debt.resolution?.resolutionType === option.value
                      ? option.value
                      : option.label
                  }
                />
              ))}
            </VaRadio>
          </div>
        );
      })}
    </>
  );
};

ResolutionDebtCards.propTypes = {
  errorSchema: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  selectedDebts: PropTypes.array,
  setDebts: PropTypes.func,
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
