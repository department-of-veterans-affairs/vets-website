import React from 'react';
import AlertBox from '../AlertBox';

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
              headline={
                <h4 className="vads-u-font-size--h3 usa-alert-heading">
                  {flag.title}
                </h4>
              }
              key={flag.id}
              status="warning"
              content={
                <div className="flagDetail">
                  <p>{flag.description}</p>
                  {flag.linkText && !flag.linkUrl && <p>{flag.linkText}</p>}
                  {flag.linkText &&
                    flag.linkUrl && (
                      <a
                        href={flag.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {flag.linkText}
                      </a>
                    )}
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
