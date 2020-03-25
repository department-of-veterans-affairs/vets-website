import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const CautionFlagHeading = ({ cautionFlags, onViewWarnings }) => {
  if (cautionFlags) {
    const headline =
      cautionFlags.length === 1
        ? 'This school has a cautionary warning'
        : 'This school has cautionary warnings';

    return (
      <AlertBox
        content={
          <div>
            {cautionFlags.map(flag => (
              <div className="headingFlag" key={flag.id}>
                {flag.title}
              </div>
            ))}
            <p>
              <a href="#viewWarnings" onClick={onViewWarnings}>
                View cautionary information about this school
              </a>
            </p>
          </div>
        }
        headline={headline}
        isVisible={cautionFlags.length > 0}
        status="warning"
      />
    );
  }
  return null;
};

export default CautionFlagHeading;
