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

const ExpandedContent = ({ selected, input, setInput }) => {
  switch (selected.value) {
    case 'Extended monthly payments':
      return (
        <TextInput
          additionalClass="input-size-3"
          label="How much can you afford to pay monthly on this debt?"
          field={input || ''}
          onValueChange={data => setInput(data.value)}
          //   required
        />
      );
    case 'Compromise':
      return (
        <TextInput
          additionalClass="input-size-3"
          label="How much do you offer to pay for this debt with a single payment?"
          field={input || ''}
          onValueChange={data => setInput(data.value)}
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

const ResolutionDebtCard = props => {
  const { selectedDebts } = props;

  const [input, setInput] = useState('');
  const [selected, setSelected] = useState({
    id: null,
    value: '',
    offerToPay: 0,
  });

  const options = ['Waiver', 'Extended monthly payments', 'Compromise'];
  const label =
    'Which repayment or relief option would you like for this debt?';

  return (
    <>
      <h4 className="vads-u-margin--0">Your selected debts</h4>
      {selectedDebts.map(debt => {
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
              open={selected.id === debt.id}
              additionalClass="form-expanding-group-active-radio"
            >
              <RadioButtons
                id={debt.id}
                name={debt.id}
                label={label}
                options={options}
                value={selected.id === debt.id ? selected : null}
                onValueChange={val =>
                  setSelected({ id: debt.id, value: val.value })
                }
                // required
              />
              <ExpandedContent
                selected={selected}
                input={input}
                setInput={setInput}
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

export default connect(mapStateToProps)(ResolutionDebtCard);
