import React, { useState } from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import { getTypeOfCare } from '../../redux/selectors';
import { FACILITY_TYPES, PURPOSE_TEXT } from '../../../utils/constants';
import FacilityAddress from '../../../components/FacilityAddress';
import State from '../../../components/State';

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
  useProviderSelection,
}) {
  const isCommunityCare = data.facilityType === FACILITY_TYPES.COMMUNITY_CARE;
  const isVideoVisit = data.visitType === 'telehealth';
  const [isAdditionalInfoOpen, toggleAdditionalInfo] = useState(false);
  const hasSelectedProvider =
    !!data.communityCareProvider &&
    !!Object.keys(data.communityCareProvider).length;

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <AlertBox status="success">
        <strong>We’re reviewing your request</strong>
        <br />A scheduler will contact you to schedule the first available
        appointment. You don’t have to do anything right now.
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
            <div className="vads-u-margin--0">
              {isCommunityCare &&
                ((!useProviderSelection && !data.hasCommunityCareProvider) ||
                  (useProviderSelection && !hasSelectedProvider)) && (
                  <>
                    <h3 className="vaos-appts__block-label">
                      <strong>Preferred provider</strong>
                    </h3>
                    <p
                      className="vaos-appts__block-label"
                      style={{ marginBottom: 0 }}
                    >
                      No preference
                    </p>
                  </>
                )}
              {isCommunityCare &&
                !useProviderSelection &&
                data.hasCommunityCareProvider && (
                  <>
                    <h3 className="vaos-appts__block-label">
                      <strong>Preferred provider</strong>
                    </h3>
                    <div>
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
                        <State
                          state={data.communityCareProvider.address.state}
                        />{' '}
                        {data.communityCareProvider.address.postalCode}
                        <br />
                      </p>
                    </div>
                  </>
                )}
              {isCommunityCare &&
                useProviderSelection &&
                hasSelectedProvider && (
                  <>
                    <h3 className="vaos-appts__block-label">
                      <strong>Preferred provider</strong>
                    </h3>
                    <div>
                      {data.communityCareProvider.name}
                      <br />
                      {data.communityCareProvider.address.line.map(line => (
                        <>
                          {line}
                          <br />
                        </>
                      ))}
                      {data.communityCareProvider.address.city},{' '}
                      <State state={data.communityCareProvider.address.state} />{' '}
                      {data.communityCareProvider.address.postalCode}
                      <br />
                    </div>
                  </>
                )}
              {!isCommunityCare &&
                !!facilityDetails && (
                  <>
                    <h3 className="vaos-appts__block-label">
                      <strong>{facilityDetails.name}</strong>
                    </h3>
                    <div>
                      <FacilityAddress facility={facilityDetails} />
                    </div>
                  </>
                )}
            </div>
          </div>
          <div className="vads-u-flex--1 vads-u-margin-top--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
            <h3 className="vaos-appts__block-label">Preferred date and time</h3>
            <div>
              <ul className="usa-unstyled-list">
                {data.selectedDates?.map(date => (
                  <li key={date}>
                    {moment(date).format('MMMM D, YYYY')}{' '}
                    {moment(date).hour() < 12
                      ? 'in the morning'
                      : 'in the afternoon'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="vads-u-margin-top--2">
          <AdditionalInfo
            triggerText={isAdditionalInfoOpen ? 'Show less' : 'Show more'}
            onClick={() => toggleAdditionalInfo(!isAdditionalInfoOpen)}
          >
            <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
              <div className="vaos_appts__message vads-u-flex--1 vaos-u-word-break--break-word">
                <div className="vads-u-margin--0 vads-u-margin-right--1">
                  <h3 className="vaos-appts__block-label">
                    {
                      PURPOSE_TEXT.find(
                        purpose => purpose.id === data.reasonForAppointment,
                      )?.short
                    }
                  </h3>
                  <div>{data.reasonAdditionalInfo}</div>
                </div>
              </div>
              <div className="vads-u-flex--1 vads-u-margin-top--2 small-screen:vads-u-margin-top--0 vaos-u-word-break--break-word">
                <h3 className="vaos-appts__block-label">
                  Your contact details
                </h3>
                <div>
                  {data.email}
                  <br />
                  {data.phoneNumber}
                  <br />
                  {formatBestTime(data.bestTimeToCall)}{' '}
                </div>
              </div>
            </div>
          </AdditionalInfo>
        </div>
      </div>
    </div>
  );
}
