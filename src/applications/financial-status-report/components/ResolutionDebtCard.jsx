import React, { useState } from 'react';
import { connect } from 'react-redux';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const ExpandedContent = ({ debt, setSelected }) => {
  const update = data => {
    setSelected(prevState =>
      prevState.map(item => {
        if (item.id === debt.id) {
          return {
            ...item,
            offerToPay: data.value,
          };
        }
        return item;
      }),
    );
  };

  switch (debt.value) {
    case 'Extended monthly payments':
      return (
        <TextInput
          additionalClass="input-size-3"
          label="How much can you afford to pay monthly on this debt?"
          field={{ value: debt.offerToPay || '' }}
          onValueChange={data => update(data)}
          //   required
        />
      );
    case 'Compromise':
      return (
        <TextInput
          additionalClass="input-size-3"
          label="How much do you offer to pay for this debt with a single payment?"
          field={{ value: debt.offerToPay || '' }}
          onValueChange={data => update(data)}
          //   required
        />
      );
    default:
      return (
        <Checkbox
          label="By checking this box, I’m agreeing that I understand how a debt waiver may affect my VA education benefits. If VA grants me a waiver, this will reduce any remaining education benefit entitlement I may have."
          onValueChange={function noRefCheck() {}}
          //   required
        />
      );
  }
};

const ResolutionDebtCard = ({ selectedDebts }) => {
  const [selected, setSelected] = useState(selectedDebts);
  const radioOptions = ['Waiver', 'Extended monthly payments', 'Compromise'];
  const radioLabels =
    'Which repayment or relief option would you like for this debt?';

  return (
    <>
      <h4 className="vads-u-margin--0">Your selected debts</h4>
      {selected.map(debt => {
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
              key={debt.id}
              open={debt.value}
              additionalClass="form-expanding-group-active-radio"
            >
              <RadioButtons
                id={debt.id}
                name={debt.id}
                label={radioLabels}
                options={radioOptions}
                value={{ value: debt.value }}
                onValueChange={data => {
                  setSelected(prevState =>
                    prevState.map(item => {
                      if (item.id === debt.id) {
                        return {
                          ...item,
                          value: data.value,
                        };
                      }
                      return item;
                    }),
                  );
                }}
                // required
              />
              <ExpandedContent debt={debt} setSelected={setSelected} />
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

export default connect(mapStateToProps)(ResolutionDebtCard);
