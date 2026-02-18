import React from 'react';
import PropTypes from 'prop-types';
import CaseProgressDescription from './CaseProgressDescription';

const getHeaderIconAttributes = status => {
  if (status === 'ACTIVE') {
    return {
      icon: 'flag',
      srtext: 'Current',
      class: 'case-progress-active vads-u-color--primary',
    };
  }

  if (status === 'COMPLETED') {
    return {
      icon: 'check_circle',
      srtext: 'Completed',
      class: 'case-progress-complete vads-u-color--green',
    };
  }

  if (status === 'PENDING') {
    return {
      icon: 'radio_button_unchecked',
      srtext: 'Pending',
      class: 'case-progress-pending vads-u-color--gray-medium',
    };
  }

  return null;
};

const CaseProgressAccordion = ({ stepLabels, stateList = [] }) => {
  const hasStateList = Array.isArray(stateList) && stateList.length > 0;

  return (
    <div className=" vads-u-margin-top--2">
      <va-accordion>
        {stepLabels.map((stepLabel, index) => {
          const stepNumber = index + 1;

          const stepState = hasStateList ? stateList[index] : null;
          const status = stepState?.status;

          const stepPrefix = `Step ${stepNumber}:`;
          const headerText = status
            ? `${stepPrefix} ${stepLabel} - [${status}]`
            : `${stepPrefix} ${stepLabel}`;

          const iconAttrs = getHeaderIconAttributes(status);

          return (
            <va-accordion-item
              bordered
              key={`case-progress-step-${stepNumber}`}
              header={headerText}
              id={`case-progress-step-${stepNumber}`}
              open={status === 'ACTIVE'}
            >
              {iconAttrs && (
                <va-icon
                  icon={iconAttrs.icon}
                  class={iconAttrs.class}
                  srtext={iconAttrs.srtext}
                  slot="icon"
                />
              )}

              <CaseProgressDescription
                step={stepNumber}
                showHubCards={status === 'ACTIVE'}
              />
            </va-accordion-item>
          );
        })}
      </va-accordion>
    </div>
  );
};

CaseProgressAccordion.propTypes = {
  stepLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateList: PropTypes.array,
};

export default CaseProgressAccordion;
