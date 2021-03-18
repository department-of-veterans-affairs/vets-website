import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const DependencyVerificationHeader = () => {
  return (
    <header>
      <h2>Dependents on your VA benefits</h2>
      <p>
        Our records show the following dependents on your VA benefits. Please
        let us know if a dependent's status has changed.
      </p>
      <AdditionalInfo triggerText="When should I notify VA about dependents on my benefits?">
        <p>
          You need to let VA know when there is a change in a dependent's
          status. Changes in status could include:
        </p>
        <ul>
          <li>The birth or adoption of a child</li>
          <li>If you get married or divorced</li>
          <li>The death of a dependent</li>
          <li>If your child is over 18 and is not attending school</li>
        </ul>
      </AdditionalInfo>
    </header>
  );
};

export default DependencyVerificationHeader;
