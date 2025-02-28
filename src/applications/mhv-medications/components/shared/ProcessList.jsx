import React from 'react';
import PropTypes from 'prop-types';

const ProcessList = ({ stepGuideProps }) => {
  const { title, processSteps } = stepGuideProps;
  return (
    <section>
      <div className="no-print vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4 vads-u-border-bottom--2px vads-u-border-color--gray-light" />
      <h2
        className="vads-u-margin-top--0 vads-u-margin-bottom--3"
        data-testid="progress-list-header"
      >
        {title}
      </h2>
      <va-process-list>
        {processSteps.map((step, index) => (
          <va-process-list-item key={index} header={step.header}>
            {step.content}
          </va-process-list-item>
        ))}
      </va-process-list>
    </section>
  );
};

ProcessList.propTypes = {
  stepGuideProps: PropTypes.object,
};

export default ProcessList;
