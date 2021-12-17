import React from 'react';
import classNames from 'classnames';
import JumpLink from './profile/JumpLink';
import recordEvent from 'platform/monitoring/record-event';

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
    <div className="usa-alert usa-alert-warning vads-u-background-color--white vads-u-padding-x--0p5 vads-u-padding-y--2">
      <div className="usa-alert-body ">
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
            <div>
              <h4 className="usa-alert-heading caution-flag-alert-heading">
                {headline}
              </h4>
            </div>
            <div>
              <i
                aria-hidden="true"
                style={{
                  float: 'right',
                  margin: '5px',
                }}
                className={classNames('fa', {
                  'fa-chevron-up': expanded,
                  'fa-chevron-down': !expanded,
                })}
              />
            </div>
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

export default CautionFlagAdditionalInfo;
