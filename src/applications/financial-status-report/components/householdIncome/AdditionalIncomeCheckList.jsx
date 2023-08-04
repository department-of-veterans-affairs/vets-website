import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { otherIncome } from '../../constants/checkboxSelections';
import Checklist from '../shared/CheckList';
import { calculateTotalIncome } from '../../utils/streamlinedDepends';

const AdditionalIncomeCheckList = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { gmtData, additionalIncome, questions } = data;
  const { addlIncRecords = [] } = additionalIncome;

  // Calculate income properties as necessary
  const updateStreamlinedValues = () => {
    if (
      questions?.isMarried ||
      addlIncRecords?.length ||
      !gmtData?.isElidgibleForStreamlined
    )
      return;

    const calculatedIncome = calculateTotalIncome(data);
    setFormData({
      ...data,
      gmtData: {
        ...gmtData,
        incomeBelowGMT: calculatedIncome < gmtData?.gmtThreshold,
        incomeBelowOneFiftyGMT:
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

  const isBoxChecked = option => {
    return addlIncRecords.some(incomeValue => incomeValue.name === option);
  };

  const title = 'Your other income';
  const prompt = 'Select any additional income you receive:';

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

AdditionalIncomeCheckList.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalIncome: PropTypes.shape({
      addlIncRecords: PropTypes.array,
    }),
    gmtData: PropTypes.shape({
      gmtThreshold: PropTypes.number,
      incomeBelowGMT: PropTypes.bool,
      incomeBelowOneFiftyGMT: PropTypes.bool,
      isElidgibleForStreamlined: PropTypes.bool,
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

export default AdditionalIncomeCheckList;
