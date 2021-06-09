import React from 'react';
import classNames from 'classnames';

export const CautionFlagAdditionalInfo = ({
  cautionFlags,
  expanded,
  setCount,
}) => {
  const validFlags = cautionFlags
    ? [...cautionFlags].filter(flag => flag.title)
    : [];

  const headline =
    validFlags.length === 1
      ? 'This school has 1 cautionary warning'
      : `This school has ${validFlags.length} cautionary warnings`;
  return (
    <div className="usa-alert usa-alert-warning vads-u-background-color--white">
      <div className="usa-alert-body " onClick={() => setCount(!expanded)}>
        <div className="vads-u-display--flex">
          <div className="vads-u-flex--1">
            <h4 className="usa-alert-heading caution-flag-alert-heading">
              {headline}
            </h4>
          </div>
          <div className="vads-u-flex--1">
            <i
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

        {expanded && (
          <ul>
            {validFlags
              .sort(
                (a, b) =>
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
      </div>
    </div>
  );
};
