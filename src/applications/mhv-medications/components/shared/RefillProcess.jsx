import React, { useMemo } from 'react';
import { refillProcessStepGuide } from '../../util/refillProcessData';

const RefillProcess = () => {
  const stepGuideProps = useMemo(
    () => ({
      processSteps: refillProcessStepGuide.processSteps,
      title: refillProcessStepGuide.title,
    }),
    [],
  );

  return (
    <section
      aria-labelledby="refill-process-heading"
      data-testid="rx-refill-process-container"
    >
      <h3
        id="refill-process-heading"
        className="vads-u-border-bottom--2px vads-u-border-color--primary vads-u-line-height--5"
      >
        {stepGuideProps.title}
      </h3>

      <va-process-list>
        {stepGuideProps.processSteps.map((step, index) => (
          <va-process-list-item key={index} header={step.header}>
            {step.content}
          </va-process-list-item>
        ))}
      </va-process-list>
    </section>
  );
};

export default RefillProcess;
