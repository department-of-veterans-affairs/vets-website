import React from 'react';
import PropTypes from 'prop-types';
import CaseProgressDescription from './CaseProgressDescription';

const getItemPropsByStatus = status => {
  if (status === 'COMPLETED') {
    return { checkmark: true };
  }

  if (status === 'ACTIVE') {
    return { active: true };
  }

  if (status === 'PENDING') {
    return { pending: true };
  }

  return {};
};

const CaseProgressProcessList = ({ stepLabels, stateList = [] }) => {
  const hasStateList = Array.isArray(stateList) && stateList.length > 0;

  return (
    <div className="vads-u-margin-top--2">
      <va-process-list>
        {stepLabels.map((stepLabel, index) => {
          const stepNumber = index + 1;

          const stepState = hasStateList ? stateList[index] : null;
          const status = stepState?.status;

          const headerText = status
            ? `Step ${stepNumber}: ${stepLabel} - [${status}]`
            : `Step ${stepNumber}: ${stepLabel}`;

          const statusProps = getItemPropsByStatus(status);

          return (
            <va-process-list-item
              key={`case-process-step-${stepNumber}`}
              header={headerText}
              {...statusProps}
            >
              <CaseProgressDescription
                step={stepNumber}
                showHubCards={status === 'ACTIVE'}
              />
            </va-process-list-item>
          );
        })}
      </va-process-list>
    </div>
  );
};

CaseProgressProcessList.propTypes = {
  stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateList: PropTypes.array,
};

export default CaseProgressProcessList;
