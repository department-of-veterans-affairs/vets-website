import React from 'react';
import PropTypes from 'prop-types';
import CaseProgressDescription from './CaseProgressDescription';

const CaseProgressBar = ({
  current,
  setCurrent,
  stepLabels,
  stateList = [],
  headingText = 'VA Benefits',
  label = 'Label is here',
  counters = 'small',
}) => {
  const total = stepLabels.length;

  const goPrev = () => setCurrent(c => Math.max(1, c - 1));
  const goNext = () => setCurrent(c => Math.min(total, c + 1));

  let labelsWithStatus = stepLabels;

  if (Array.isArray(stateList) && stateList.length) {
    labelsWithStatus = stepLabels.map((stepLabel, index) => {
      const stepState = stateList[index];
      if (!stepState?.status) {
        return stepLabel;
      }
      return `${stepLabel} - [${stepState.status}]`;
    });
  }

  const currentStatus = stateList?.[current - 1]?.status || 'PENDING';

  return (
    <>
      <div className="usa-width-one-whole vads-u-margin-top--2">
        <va-segmented-progress-bar
          counters={counters}
          current={String(current)}
          heading-text={headingText}
          label={label}
          labels={labelsWithStatus.join(';')}
          total={String(total)}
        />
      </div>

      <CaseProgressDescription step={current} status={currentStatus} />

      <div className="vads-u-margin-top--3 vads-u-margin-bottom--3">
        <va-button
          class="vads-u-margin-right--1"
          secondary
          onClick={goPrev}
          disabled={current === 1}
          text="Previous step"
        />
        <va-button
          class="vads-u-margin-right--1"
          onClick={goNext}
          disabled={current === total}
          text="Next step"
        />
      </div>
    </>
  );
};

CaseProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  setCurrent: PropTypes.func.isRequired,
  stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateList: PropTypes.array,
  headingText: PropTypes.string,
  label: PropTypes.string,
  counters: PropTypes.oneOf(['small', 'large']),
};

export default CaseProgressBar;
