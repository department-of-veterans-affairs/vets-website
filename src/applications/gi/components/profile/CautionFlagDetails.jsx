import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const CautionFlagDetails = ({ cautionFlags }) => {
  if (cautionFlags && cautionFlags.length > 0) {
    return (
      <div className="cautionFlagDetails">
        {cautionFlags.map(flag => (
          <AlertBox
            headline={flag.title}
            key={flag.id}
            status="warning"
            content={
              <div className="flagDetail">
                <p>{flag.description}</p>
                {flag.linkText && !flag.linkUrl && <p>{flag.linkText}</p>}
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
