import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const CautionFlagDetails = ({ cautionFlags }) => {
  const validFlags = cautionFlags
    ? [...cautionFlags].filter(flag => flag.title)
    : [];
  if (validFlags.length > 0) {
    return (
      <div className="cautionFlagDetails">
        {validFlags
          .sort(
            (a, b) => (a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1),
          )
          .map(flag => (
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
