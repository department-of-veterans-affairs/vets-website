import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const CautionFlagHeading = ({ cautionFlags, onViewWarnings }) => {
  const validFlags = cautionFlags
    ? [...cautionFlags].filter(flag => flag.title)
    : [];
  if (validFlags.length > 0) {
    const headline =
      validFlags.length === 1
        ? 'This school has a cautionary warning'
        : 'This school has cautionary warnings';

    return (
      <AlertBox
        content={
          <div>
            <ul>
              {validFlags
                .sort(
                  (a, b) =>
                    a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1,
                )
                .map(flag => (
                  <li className="headingFlag" key={flag.id}>
                    <div>{flag.title}</div>
                  </li>
                ))}
            </ul>
            <p>
              <a href="#viewWarnings" onClick={onViewWarnings}>
                View details below
              </a>
            </p>
          </div>
        }
        headline={headline}
        isVisible={validFlags.length > 0}
        status="warning"
      />
    );
  }
  return null;
};

export default CautionFlagHeading;
