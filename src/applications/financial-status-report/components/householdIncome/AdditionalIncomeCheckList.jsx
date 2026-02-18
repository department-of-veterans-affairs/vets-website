import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherIncome } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { checkIncomeGmt } from '../../utils/streamlinedDepends';

const AdditionalIncomeCheckList = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  useWebComponents,
}) => {
  const {
    additionalIncome,
    gmtData,
    questions,
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  const { addlIncRecords = [] } = additionalIncome;

  // Compare calculated income to thresholds
  useEffect(() => {
    if (
      questions?.isMarried ||
      addlIncRecords?.length ||
      !gmtData?.isEligibleForStreamlined
    )
      return;

    checkIncomeGmt(data, setFormData);
  }, []);

  const onChange = ({ name, checked }) => {
    setFormData({
      ...data,
      additionalIncome: {
        ...additionalIncome,
        addlIncRecords: checked
          ? [...addlIncRecords, { name, amount: '' }]
          : addlIncRecords.filter(source => source.name !== name),
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
            isRequired={false}
          />
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={goForward}
            submitToContinue
            useWebComponents={useWebComponents}
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
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default AdditionalIncomeCheckList;
