import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { ProgressBarProps } from './types';
import { VaSegmentedProgressBar } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { RouterContext, RouterContextProvider } from '../routing/RouterContext';

/**
 * Form Title component is a simple wrapper
 * around a Form Title and subTitle using VA styles
 *
 * @param {ProgressBarProps} props
 *
 * @example
 * Here's a simple example:
 * ```typescript
 * <ProgressBar stepTitle="My Title" stepNumber={5} numberOfSteps={10}/>;
 * ```
 *
 * @returns React.Component
 */
const ProgressBar = (props: ProgressBarProps) => {
  const { numberOfSteps, currentStep, stepTitle } = props;

  return (
    <>
      <VaSegmentedProgressBar
        current={currentStep}
        total={numberOfSteps}
        toFixed={false}
      />
      <div
        className="schemaform-chapter-progress"
        style={{
          paddingLeft: '2rem',
        }}
      >
        <div className="nav-header nav-header-schemaform">
          <h2 className="vads-u-font-size--h4" id="nav-form-header">
            Step {currentStep} of {numberOfSteps}: {stepTitle}
          </h2>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
