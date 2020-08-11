import React from 'react';
import moment from 'moment';

function getHourText(hours) {
  if (!hours) {
    return 'Closed';
  }

  if (hours.allDay) {
    return '24/7';
  }

  if (!hours.openingTime && !hours.closingTime) {
    return '';
  }

  const openingTime = moment(hours.openingTime, 'HH:mm').format('h:mm a');
  const closingTime = hours.closingTime
    ? moment(hours.closingTime, 'HH:mm').format('h:mm a')
    : null;

  return `${openingTime}${closingTime ? ` - ${closingTime}` : null}`;
}

export default function FacilityHours({ hoursOfOperation }) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dayHours = days.map(day => ({
    day,
    hours: hoursOfOperation.find(item =>
      item.daysOfWeek.includes(day.toLowerCase().substr(0, 3)),
    ),
  }));

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        <div className="vads-l-col--8 xsmall-screen:vads-l-col--12">
          {!!dayHours.length && (
            <div className="vads-l-row">
              <div className="vads-l-col--3 xsmall-screen:vads-l-col--4 small-screen:vads-l-col--3 medium-screen:vads-l-col--3 vads-u-font-weight--bold">
                Hours:
              </div>
              <div className="vads-l-col--9 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--9 medium-screen:vads-l-col--9">
                <div className="vads-l-row">
                  {dayHours.map(d => (
                    <React.Fragment key={`hours-${d.day}`}>
                      <div className="vaos-facility-details__day vads-l-col--6 xsmall-screen:vads-l-col--5 medium-screen:small-screen:vads-l-col--3">
                        <span className="vads-u-display--none small-screen:vads-u-display--inline">
                          {d.day}
                        </span>
                        <span className="small-screen:vads-u-display--none">
                          {d.day.slice(0, 3)}
                        </span>
                      </div>
                      <div className="vaos-facility-details__hours vads-l-col--6 xsmall-screen:vads-l-col--7 medium-screen:small-screen:vads-l-col--9">
                        {getHourText(d.hours)}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
