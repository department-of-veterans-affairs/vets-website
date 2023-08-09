import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherIncome } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateTotalIncome } from '../../utils/streamlinedDepends';

const SpouseAdditionalIncomeCheckList = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { gmtData, additionalIncome } = data;
  const { spAddlIncome = [] } = additionalIncome?.spouse;

  // Calculate income properties as necessary
  const updateStreamlinedValues = () => {
    if (spAddlIncome.length || !gmtData?.isEligibleForStreamlined) return;

    const calculatedIncome = calculateTotalIncome(data);

    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        incomeBelowGmt: calculatedIncome < gmtData?.gmtThreshold,
        incomeBelowOneFiftyGmt:
          calculatedIncome < gmtData?.incomeUpperThreshold,
      },
    });
  };

  const onChange = ({ target }) => {
    const { value } = target;
    return spAddlIncome.some(source => source.name === value)
      ? setFormData({
          ...data,
          additionalIncome: {
            ...additionalIncome,
            spouse: {
              spAddlIncome: spAddlIncome.filter(
                source => source.name !== value,
              ),
            },
          },
        })
      : setFormData({
          ...data,
          additionalIncome: {
            ...additionalIncome,
            spouse: {
              ...additionalIncome.spouse,
              spAddlIncome: [...spAddlIncome, { name: value, amount: '' }],
            },
          },
        });
  };

  const isBoxChecked = option => {
    return spAddlIncome.some(incomeValue => incomeValue.name === option);
  };
  const title = 'Your spouse’s other income';
  const prompt = 'Select any additional income your spouse receives:';

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset>
        <div className="vads-l-grid-container--full">
          <Checklist
            title={title}
            prompt={prompt}
            options={otherIncome}
            onChange={event => onChange(event)}
            isBoxChecked={isBoxChecked}
          />
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={updateStreamlinedValues}
            submitToContinue
          />
          {contentAfterButtons}
        </div>
      </fieldset>
    </form>
  );
};

SpouseAdditionalIncomeCheckList.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      spouse: PropTypes.shape({
        spAddlIncome: PropTypes.array,
      }),
    }),
    gmtData: PropTypes.shape({
      gmtThreshold: PropTypes.number,
      incomeBelowGmt: PropTypes.bool,
      incomeBelowOneFiftyGmt: PropTypes.bool,
      isEligibleForStreamlined: PropTypes.bool,
      incomeUpperThreshold: PropTypes.number,
    }),
    questions: PropTypes.shape({
      isMarried: PropTypes.bool,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
};

export default SpouseAdditionalIncomeCheckList;
