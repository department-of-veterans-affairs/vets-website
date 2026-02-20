import React from 'react';
import PropTypes from 'prop-types';
import CaseProgressDescription from './CaseProgressDescription';

const CaseProgressBar = ({
  current,
  stepLabels,
  stateList = [],
  headingText = 'VA Benefits',
  label = 'Label is here',
  counters = 'small',
  headerLevel = 2,
}) => {
  const total = stepLabels.length;

  const currentStatus = stateList?.[current - 1]?.status || 'PENDING';

  return (
    <>
      <div className="usa-width-one-whole vads-u-margin-top--2">
        <va-segmented-progress-bar
          counters={counters}
          current={String(current)}
          header-level={headerLevel}
          heading-text={headingText}
          label={label}
          labels={stepLabels.join(';')}
          total={String(total)}
        />
      </div>

      <CaseProgressDescription step={current} status={currentStatus} />
    </>
  );
};

CaseProgressBar.propTypes = {
  current: PropTypes.number.isRequired,
  stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateList: PropTypes.array,
  headingText: PropTypes.string,
  label: PropTypes.string,
  counters: PropTypes.oneOf(['small', 'large']),
  headerLevel: PropTypes.number,
};

export default CaseProgressBar;
