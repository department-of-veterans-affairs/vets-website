import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';
import { environment } from '@department-of-veterans-affairs/platform-utilities';

const url = path => `${environment.BaseUrl}${path}`;

const PriorityGroup = ({ effectiveDate, priorityGroup }) => {
  const group = priorityGroup.replace('Group ', '');
  // const date = moment(effectiveDate).format('YYYY-MM-DD');
  // const date = moment(effectiveDate).format('MM/DD/YYYY'); // fails in CI due to TZ?

  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages
  const { language } = navigator;
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  const utcDate = new Date(effectiveDate); // effectiveDate: 2019-01-02T21:58:55.000-06:00
  const dateOptions = { dateStyle: 'long', timeZone };
  const date = new Intl.DateTimeFormat(language, dateOptions).format(utcDate);

  const headline = `Your assigned priority group is ${group} as of ${date}`;

  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="success"
      visible
    >
      <h2 slot="headline">{headline}</h2>
      <div>
        <p className="vads-u-margin-y--0">
          If your income has changed or your service-connected disability has
          gotten worse, you may qualify for a different priority group. Use
          <a href={url('/health-care/update-health-information')}>
            form 10-10EZR
          </a>
          to update your information.
        </p>
      </div>
    </va-alert>
  );
};

PriorityGroup.propTypes = {
  effectiveDate: PropTypes.string.isRequired,
  priorityGroup: PropTypes.string.isRequired,
};

export default PriorityGroup;
