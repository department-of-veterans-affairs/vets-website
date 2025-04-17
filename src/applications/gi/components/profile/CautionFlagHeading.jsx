import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import AlertBox from '../AlertBox';

const CautionFlagHeading = ({ cautionFlags, onViewWarnings }) => {
  const validFlags = cautionFlags
    ? [...cautionFlags].filter(flag => flag.title)
    : [];
  if (validFlags.length > 0) {
    const headline =
      validFlags.length === 1
        ? 'This school has a cautionary warning'
        : 'This school has cautionary warnings';
    const flagContenet = (
      <div>
        {validFlags.length === 1 && <p>{validFlags[0].title}</p>}
        {validFlags.length > 1 && (
          <ul>
            {validFlags
              .sort((a, b) =>
                a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1,
              )
              .map((flag, index) => (
                <li
                  className="headingFlag vads-u-margin-left--1p5"
                  key={`caution-flag-heading-${index}`}
                >
                  {flag.title}
                </li>
              ))}
          </ul>
        )}
        <p>
          <a
            href="#viewWarnings"
            onClick={() => {
              recordEvent({
                event: 'nav-warning-alert-box-content-link-click',
                alertBoxHeading:
                  'Jumplink - This school has a cautionary warning',
              });
              if (onViewWarnings) {
                onViewWarnings();
              }
            }}
          >
            View details below
          </a>
        </p>
      </div>
    );
    return (
      <AlertBox
        content={flagContenet}
        headline={
          <h2 className="vads-u-font-size--h3 usa-alert-heading">{headline}</h2>
        }
        isVisible={validFlags.length > 0}
        status="warning"
      />
    );
  }
  return null;
};

CautionFlagHeading.propTypes = {
  cautionFlags: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ),
  onViewWarnings: PropTypes.func,
};

export default CautionFlagHeading;
