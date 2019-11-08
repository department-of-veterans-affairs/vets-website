import React from 'react';
import { Link } from 'react-router';
// import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { getTypeOfCare } from '../utils/selectors';
import newAppointmentFlow from '../newAppointmentFlow';
import { PURPOSE_TEXT } from '../utils/constants';
import PreferredDates from './PreferredDates';

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
const TypeOfCareSection = props => {
  if (props.data.facilityType === 'communityCare')
    return (
      <h2 className="usa-alert-heading vads-u-padding-top--1">
        Community care appointment
      </h2>
    );
  else if (!props.data.facilityType !== 'communityCare')
    return (
      <h2 className="usa-alert-heading vads-u-padding-top--1">
        VA appointment
      </h2>
    );
  else if (props.DirectSchedule) return null;

  return null;
};

const ReasonForAppointmentSection = props => (
  <>
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        <div className="vads-l-col--6">
          <h3 className="vaos-appts__block-label">
            {PURPOSE_TEXT[props.data.reasonForAppointment]} visit
          </h3>
        </div>
        <div className="vads-l-col--6 vads-u-text-align--right">
          <Link to={newAppointmentFlow.reasonForAppointment.url}>Edit</Link>
        </div>
      </div>
    </div>
    <span>{props.data.reasonAdditionalInfo}</span>
  </>
);

const ContactDetailSection = props => (
  <>
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        <div className="vads-l-col--6">
          <h3 className="vaos-appts__block-label">Your contact details</h3>
        </div>
        <div className="vads-l-col--6 vads-u-text-align--right">
          <Link to={newAppointmentFlow.contactInfo.url}>Edit</Link>
        </div>
      </div>
    </div>
    <span className="vads-u-padding-right--1">
      {props.data.email}
      <br />
      {props.data.phoneNumber}
      <br />
      <i>Call {formatBestTime(props.data.bestTimeToCall).toLowerCase()}</i>
    </span>
  </>
);

const PreferredDatesSection = props => (
  <>
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        <div className="vads-l-col--6">
          <h3 className="vaos-appts__block-label">Preferred date and time</h3>
        </div>
        <div className="vads-l-col--6 vads-u-text-align--right">
          <Link to={newAppointmentFlow.requestDateTime.url}>Edit</Link>
        </div>
      </div>
    </div>
    <PreferredDates dates={props.data.calendarData.selectedDates} />
  </>
);

const VAAppointmentSection = props => (
  <>
    <ReasonForAppointmentSection data={props.data} />
    <hr />
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-l-row">
        <div className="vads-l-col--6">
          <h3 className="vaos-appts__block-label">Preferred date and time</h3>
        </div>
        <div className="vads-l-col--6 vads-u-text-align--right">
          <Link to={newAppointmentFlow.requestDateTime.url}>Edit</Link>
        </div>
      </div>
    </div>
    <PreferredDates dates={props.data.calendarData.selectedDates} />
    <hr />
    <ContactDetailSection data={props.data} />
  </>
);

const CommunityCareSection = props => (
  <>
    {props.data.hasCommunityCareProvider && (
      <>
        <div className="vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col--6">
              <h3 className="vaos-appts__block-label">Preferred providers</h3>
            </div>
            <div className="vads-l-col--6 vads-u-text-align--right">
              <Link to={newAppointmentFlow.ccPreferences.url}>Edit</Link>
            </div>
          </div>
        </div>
        <span>
          {props.data.communityCareProvider.practiceName}
          <br />
          {props.data.communityCareProvider.firstName} &nbsp;
          {props.data.communityCareProvider.lastName}
          <br />
          {props.data.communityCareProvider.address.street}
          <br />
          {props.data.communityCareProvider.address.street2}
          <br />
          {props.data.communityCareProvider.address.city}, &nbsp;
          {props.data.communityCareProvider.address.state} &nbsp;
          {props.data.communityCareProvider.address.postalCode}
        </span>
      </>
    )}
    {!props.data.hasCommunityCareProvider && (
      <>
        <div className="vads-l-grid-container vads-u-padding--0">
          <div className="vads-l-row">
            <div className="vads-l-col--6">
              <h3 className="vaos-appts__block-label">Not specified</h3>
            </div>
            <div className="vads-l-col--6 vads-u-text-align--right">
              <Link to={newAppointmentFlow.ccPreferences.url}>Edit</Link>
            </div>
          </div>
        </div>
      </>
    )}
    <hr />
    <ReasonForAppointmentSection data={props.data} />
    <hr />
    <PreferredDatesSection data={props.data} />
    <hr />
    <ContactDetailSection data={props.data} />
  </>
);

// const DirectSchedule = props => { };
// const ContentSection = props => { };

export default function ReviewRequestInfo({ data }) {
  const isCommunityCare = data.facilityType === 'communityCare';
  const isVAAppointment = data.facilityType === 'vamc';

  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        Review your appointment
        <br />
        details
      </h1>
      <TypeOfCareSection data={data} />
      <hr />
      <h3 className="vaos-appts__block-label">{getTypeOfCare(data)?.name}</h3>
      <hr />
      {isCommunityCare && <CommunityCareSection data={data} />}
      {isVAAppointment && <VAAppointmentSection data={data} />}
    </div>
  );
}
