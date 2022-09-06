import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import { setData } from 'platform/forms-system/src/js/actions';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import { currency } from '../utils/helpers';

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
        <div className="currency-input">
          <TextInput
            name="extended-payment-resolution-amount"
            additionalClass="input-size-3"
            label="How much can you pay monthly on this debt?"
            field={{ value: debt.resolution?.offerToPay || '' }}
            onValueChange={({ value }) => updateDebts(objKey, value, debt)}
            errorMessage={submitted && inputErrMsg}
          />
        </div>
      );
    case 'Compromise':
      return (
        <div className="currency-input">
          <TextInput
            name="compromise-resolution-amount"
            additionalClass="input-size-3"
            label="What is your offer for a one-time payment?"
            field={{ value: debt.resolution?.offerToPay || '' }}
            onValueChange={({ value }) => updateDebts(objKey, value, debt)}
            errorMessage={submitted && inputErrMsg}
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
            Note: If you have questions about this, call us at
            <Telephone
              contact={CONTACTS.DMC || '800-827-0648'}
              className="vads-u-margin-x--0p5"
            />
            (or
            <Telephone
              contact={CONTACTS.DMC_OVERSEAS || '1-612-713-6415'}
              pattern={PATTERNS.OUTSIDE_US}
              className="vads-u-margin-x--0p5"
            />
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
  errorSchema,
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

  return (
    <>
      <h4 className="resolution-options-debt-title">Your selected debts</h4>
      {selectedDebts.map((debt, index) => {
        const objKey = 'resolutionType';
        const { submitted } = formContext;
        const radioError = submitted && !debt.resolution?.resolutionType;
        const type = debt.resolution?.resolutionType;
        const compPenWaiver = debt.deductionCode === '30' && type === 'Waiver';
        const title = deductionCodes[debt.deductionCode] || debt.benefitType;
        const subTitle = currency(debt?.currentAr);

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
            <ExpandingGroup
              open={type && !compPenWaiver}
              additionalClass="form-expanding-group-active-radio"
            >
              <RadioButtons
                id={debt.id}
                name={debt.id}
                label="Which option would you like for this debt?"
                options={['Waiver', 'Extended monthly payments', 'Compromise']}
                value={{ value: debt.resolution?.resolutionType }}
                onValueChange={({ value }) => updateDebts(objKey, value, debt)}
                errorMessage={
                  radioError && 'Please select a debt resolution option.'
                }
                required
              />
              <ExpandedContent
                index={index}
                debt={debt}
                updateDebts={updateDebts}
                submitted={submitted}
                errorSchema={errorSchema}
              />
            </ExpandingGroup>
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
