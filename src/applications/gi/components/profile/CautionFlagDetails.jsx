import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const CautionFlagDetails = ({ cautionFlags }) => {
  if (cautionFlags.length > 0) {
    return (
      <div>
        {cautionFlags.map(flag => (
          <AlertBox
            headline={flag.title}
            key={flag.id}
            status="warning"
            content={
              <div>
                <p>{flag.description}</p>
                {flag.linkUrl &&
                  flag.linkText && <a href={flag.linkUrl}>{flag.linkText}</a>}
              </div>
            }
          />
        ))}
      </div>
    );
  }
  return null;
};

export default CautionFlagDetails;
