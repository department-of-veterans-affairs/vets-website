import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherIncome } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateTotalAnnualIncome } from '../../utils/streamlinedDepends';

const AdditionalIncomeCheckList = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    gmtData,
    additionalIncome,
    questions,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { addlIncRecords = [] } = additionalIncome;

  // Calculate income properties as necessary
  const updateStreamlinedValues = () => {
    if (
      questions?.isMarried ||
      addlIncRecords?.length ||
      !gmtData?.isEligibleForStreamlined
    )
      return;

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
    return addlIncRecords.some(source => source.name === value)
      ? setFormData({
          ...data,
          additionalIncome: {
            ...additionalIncome,
            addlIncRecords: addlIncRecords.filter(
              source => source.name !== value,
            ),
          },
        })
      : setFormData({
          ...data,
          additionalIncome: {
            ...additionalIncome,
            addlIncRecords: [...addlIncRecords, { name: value, amount: '' }],
          },
        });
  };

  const onSubmit = event => {
    event.preventDefault();
    if (
      showReviewNavigation &&
      !questions?.isMarried &&
      !addlIncRecords?.length &&
      reviewNavigation
    ) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      return goToPath('/review-and-submit');
    }
    return goForward(data);
  };

  const isBoxChecked = option => {
    return addlIncRecords.some(incomeValue => incomeValue.name === option);
  };

  const title = 'Your other income';
  const prompt = 'Select any additional income you receive:';

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

AdditionalIncomeCheckList.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      addlIncRecords: PropTypes.array,
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
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default AdditionalIncomeCheckList;
