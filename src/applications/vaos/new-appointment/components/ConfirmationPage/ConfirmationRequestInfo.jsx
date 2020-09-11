import React, { useState } from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { getTypeOfCare } from '../../../utils/selectors';
import { FACILITY_TYPES, PURPOSE_TEXT } from '../../../utils/constants';
import FacilityAddress from '../../../components/FacilityAddress';

function formatBestTime(bestTime) {
  const times = [];
  if (bestTime?.morning) {
    times.push('Morning');
  }

  if (bestTime?.afternoon) {
    times.push('Afternoon');
  }

  if (bestTime?.evening) {
    times.push('Evening');
  }

  if (times.length === 1) {
    return times[0];
  } else if (times.length === 2) {
    return `${times[0]} or ${times[1]}`;
  }

  return 'Anytime during the day';
}

export default function ConfirmationRequestInfo({
  data,
  facilityDetails,
  pageTitle,
}) {
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const isVideoVisit = data.visitType === 'telehealth';
  const [isAdditionalInfoOpen, toggleAdditionalInfo] = useState(false);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <AlertBox status="success">
        <strong>Your appointment request has been submitted.</strong>
        <br />
        We’re reviewing your request. You don’t have anything to do right now. A
        scheduler will contact you to schedule the first available appointment.
      </AlertBox>
      <div className="vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-y--3 vads-u-border-top--4px vads-u-border-color--warning-message">
        <div className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans">
          {isCommunityCare && 'Community Care'}
          {isVideoVisit && 'VA Video Connect'}
          {!isVideoVisit && !isCommunityCare && 'VA appointment'}
        </div>
        <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
          {getTypeOfCare(data)?.name} appointment
        </h2>
        <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-top--2">
          <div className="vads-u-margin-right--1">
            <i aria-hidden="true" className="fas fa-exclamation-triangle" />
          </div>
          <span className="vads-u-font-weight--bold vads-u-flex--1">
            <div className="vaos-appts__status-text vads-u-font-size--base vads-u-font-family--sans">
              <strong>Pending</strong>{' '}
              <div className="vads-u-font-weight--normal">
                The time and date of this appointment are still to be
                determined.
              </div>
            </div>
          </span>
        </div>
        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <div className="vads-u-flex--1 vads-u-margin-right--1 vads-u-margin-top--2 vaos-u-word-break--break-word">
            <dl className="vads-u-margin--0">
              {isCommunityCare &&
                !data.hasCommunityCareProvider && (
                  <>
                    <dt>
                      <strong>Preferred provider</strong>
                    </dt>
                    <dd>No preference</dd>
                  </>
                )}
              {isCommunityCare &&
                data.hasCommunityCareProvider && (
                  <>
                    <dt>
                      <strong>Preferred provider</strong>
                    </dt>
                    <dd>
                      {!!data.communityCareProvider.practiceName && (
                        <>
                          {data.communityCareProvider.practiceName}
                          <br />
                        </>
                      )}
                      {data.communityCareProvider.firstName}{' '}
                      {data.communityCareProvider.lastName}
                      <br />
                      {data.communityCareProvider.phone}
                      <p>
                        {data.communityCareProvider.address.street}
                        {!!data.communityCareProvider.address.street2 && (
                          <>
                            <br />
                            {data.communityCareProvider.address.street2}
                          </>
                        )}
                        <br />
                        {data.communityCareProvider.address.city},{' '}
                        {data.communityCareProvider.address.state}{' '}
                        {data.communityCareProvider.address.postalCode}
                        <br />
                      </p>
                    </dd>
                  </>
                )}
              {!isCommunityCare &&
                !!facilityDetails && (
                  <>
                    <dt>
                      <strong>{facilityDetails.name}</strong>
                    </dt>
                    <dd>
                      <FacilityAddress facility={facilityDetails} />
                    </dd>
                  </>
                )}
            </dl>
          </div>
          <div className="vads-u-flex--1 vads-u-margin-top--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                Preferred date and time
              </dt>
              <dd>
                <ul className="usa-unstyled-list">
                  {data.calendarData?.selectedDates.map(
                    ({ date, optionTime }) => (
                      <li key={`${date}-${optionTime}`}>
                        {moment(date).format('MMMM D, YYYY')}{' '}
                        {optionTime === 'AM'
                          ? 'in the morning'
                          : 'in the afternoon'}
                      </li>
                    ),
                  )}
                </ul>
              </dd>
            </dl>
          </div>
        </div>
        <div className="vads-u-margin-top--2">
          <AdditionalInfo
            triggerText={isAdditionalInfoOpen ? 'Show less' : 'Show more'}
            onClick={() => toggleAdditionalInfo(!isAdditionalInfoOpen)}
          >
            <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
              <div className="vaos_appts__message vads-u-flex--1 vaos-u-word-break--break-word">
                <dl className="vads-u-margin--0 vads-u-margin-right--1">
                  <dt className="vads-u-font-weight--bold">
                    {
                      PURPOSE_TEXT.find(
                        purpose => purpose.id === data.reasonForAppointment,
                      )?.short
                    }
                  </dt>
                  <dd>{data.reasonAdditionalInfo}</dd>
                </dl>
              </div>
              <div className="vads-u-flex--1 vads-u-margin-top--2 small-screen:vads-u-margin-top--0 vaos-u-word-break--break-word">
                <dl className="vads-u-margin--0">
                  <dt className="vads-u-font-weight--bold vads-u-display--block">
                    Your contact details
                  </dt>
                  <dd>
                    {data.email}
                    <br />
                    {data.phoneNumber}
                    <br />
                    {formatBestTime(data.bestTimeToCall)}{' '}
                  </dd>
                </dl>
              </div>
            </div>
          </AdditionalInfo>
        </div>
      </div>
    </div>
  );
}
