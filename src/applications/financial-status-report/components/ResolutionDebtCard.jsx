import React, { useState } from 'react';
import { connect } from 'react-redux';
import { deductionCodes } from '../../debt-letters/const/deduction-codes';
import RadioButtons from '@department-of-veterans-affairs/component-library/RadioButtons';
import ExpandingGroup from '@department-of-veterans-affairs/component-library/ExpandingGroup';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

const ResolutionDebtCard = props => {
  const { selectedDebts } = props;
  const [selected, setSelected] = useState({ id: null, value: '' });

  //   console.log('props: ', props);
  //   console.log('selected: ', selected);

  const options = ['Waiver', 'Extended monthly payments', 'Compromise'];
  const label =
    'Which repayment or relief option would you like for this debt?';

  return (
    <>
      <h4 className="vads-u-margin--0">Your selected debts</h4>
      {selectedDebts.map(item => {
        const heading = deductionCodes[item.deductionCode] || item.benefitType;
        return (
          <div
            key={item.id}
            className="vads-u-background-color--gray-lightest resolution-card vads-u-padding--3 vads-u-margin-top--2"
          >
            <h4 className="vads-u-margin-top--0">{heading}</h4>
            <p>
              <strong>Amount owed: </strong>
              {item.currentAr && formatter.format(parseFloat(item.currentAr))}
            </p>

            <ExpandingGroup
              additionalClass="form-expanding-group-active-radio"
              open={
                selected.id === item.id &&
                selected.value === 'Extended monthly payments'
              }
              key={item.id}
            >
              <RadioButtons
                id={item.id}
                name={item.id}
                label={label}
                options={options}
                onValueChange={val =>
                  setSelected({ id: item.id, value: val.value })
                }
                value={selected.id === item.id ? selected : null}
                required
              />
              <TextInput
                additionalClass="input-size-3"
                label="How much can you afford to pay monthly on this debt?"
                required
                field={{ value: '' }}
                // onValueChange={value => setVeteranName(value)}
                // errorMessage={signatureError && 'Your signature must match.'}
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
