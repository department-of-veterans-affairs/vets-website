import React from 'react';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';
import AlertBox from '../AlertBox';

const SchoolClosingDetails = ({
  schoolClosing,
  schoolClosingOn,
  schoolWebsite,
}) => {
  if (schoolClosing) {
    const isFutureClosing =
      schoolClosingOn && moment(schoolClosingOn) > moment();
    const content = isFutureClosing
      ? 'This school will be closing soon.'
      : 'This school has closed.';
    const headline = isFutureClosing
      ? 'School will be closing soon'
      : 'School has closed';
    return (
      <AlertBox
        content={
          <div>
            <p>{content}</p>
            {schoolWebsite && (
              <a
                href={schoolWebsite}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  recordEvent({
                    event: 'nav-warning-alert-box-content-link-click',
                    alertBoxHeading: headline,
                  });
                }}
              >
                Visit the school's website to learn more
              </a>
            )}
            {!schoolWebsite && <p>Visit the school's website to learn more.</p>}
          </div>
        }
        headline={headline}
        isVisible={!!schoolClosing}
        status="warning"
      />
    );
  }
  return null;
};

export default SchoolClosingDetails;
