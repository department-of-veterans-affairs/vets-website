import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
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
          .map((flag, index) => (
            <AlertBox
              headline={
                <h4 className="vads-u-font-size--h3 usa-alert-heading">
                  {flag.title}
                </h4>
              }
              key={`caution-flag-detail-${index}`}
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
                        onClick={() => {
                          recordEvent({
                            event: 'nav-warning-alert-box-content-link-click',
                            alertBoxHeading: flag.title,
                          });
                        }}
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
