import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import JumpLink from './profile/JumpLink';

export const CautionFlagAdditionalInfo = ({
  cautionFlags,
  expanded,
  toggleExpansion,
  viewDetailsLink,
}) => {
  const validFlags = cautionFlags
    ? [...cautionFlags].filter(flag => flag.title)
    : [];

  const headline =
    validFlags.length === 1
      ? 'This school has 1 cautionary warning'
      : `This school has ${validFlags.length} cautionary warnings`;
  return (
    <div className="vads-u-border-left--10px vads-u-border-color--gold vads-u-background-color--white vads-u-padding-x--0p5 vads-u-padding-y--2">
      <div>
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */}
        <button
          className="caution-flag-toggle"
          onClick={() => {
            toggleExpansion(!expanded);
            const event = !expanded ? 'expand' : 'collapse';
            recordEvent({
              event: `int-additional-info-${event}}`,
              'additionalInfo-click-label': headline,
            });
          }}
        >
          <div className="vads-u-display--flex">
            <va-icon
              icon="warning"
              size={3}
              className="vads-u-margin-right--1p5"
            />
            <div>
              <h4 className="usa-alert-heading caution-flag-alert-heading">
                {headline}
              </h4>
            </div>
            {expanded ? (
              <va-icon icon="expand_less" size={3} />
            ) : (
              <va-icon icon="expand_more" size={3} />
            )}
          </div>
        </button>

        {expanded && (
          <div>
            <ul className="vads-u-padding-right--4">
              {validFlags
                .sort(
                  (a, b) =>
                    a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1,
                )
                .map((flag, index) => (
                  <li
                    className="headingFlag"
                    key={`caution-flag-heading-${index}`}
                  >
                    {flag.title}
                  </li>
                ))}
            </ul>
            {viewDetailsLink && (
              <JumpLink
                label="View details below"
                jumpToId="cautionary-information"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CautionFlagAdditionalInfo.propTypes = {
  expanded: PropTypes.bool.isRequired,
  toggleExpansion: PropTypes.func.isRequired,
  cautionFlags: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    }),
  ),
  viewDetailsLink: PropTypes.bool,
};

export default CautionFlagAdditionalInfo;
