import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherIncome } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateTotalAnnualIncome } from '../../utils/streamlinedDepends';

const SpouseAdditionalIncomeCheckList = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    additionalIncome,
    gmtData,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { spAddlIncome = [] } = additionalIncome?.spouse;

  // Calculate income properties as necessary
  const updateStreamlinedValues = () => {
    if (spAddlIncome.length || !gmtData?.isEligibleForStreamlined) return;

    const calculatedIncome = calculateTotalAnnualIncome(data);

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

  const onSubmit = event => {
    event.preventDefault();
    if (showReviewNavigation && !spAddlIncome.length && reviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      return goToPath('/review-and-submit');
    }
    return goForward(data);
  };

  const isBoxChecked = option => {
    return spAddlIncome.some(incomeValue => incomeValue.name === option);
  };
  const title = 'Your spouse’s other income';
  const prompt = 'Select any additional income your spouse receives:';

  return (
    <form onSubmit={onSubmit}>
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
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default SpouseAdditionalIncomeCheckList;
