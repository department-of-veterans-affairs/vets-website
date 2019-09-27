import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getFormData,
  getChosenFacilityInfo,
  getChosenClinicInfo,
} from '../utils/selectors';
import ReviewDirectScheduleInfo from '../components/ReviewDirectScheduleInfo';
import ReviewRequestInfo from '../components/ReviewRequestInfo';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';

const dsState = {
  newAppointment: {
    facilities: {
      '323_983': [
        {
          institution: {
            institutionCode: '983GB',
            name: 'CHYSHR-Sidney VA Clinic',
            city: 'Sidney',
            stateAbbrev: 'NE',
            authoritativeName: 'CHYSHR-Sidney VA Clinic',
            rootStationCode: '983',
            adminParent: false,
            parentStationCode: '983',
          },
          requestSupported: true,
          directSchedulingSupported: true,
          expressTimes: null,
          institutionTimezone: 'America/Denver',
        },
      ],
    },
    clinics: {
      '323_983GB': [
        {
          siteCode: '983GB',
          clinicId: '2276',
          clinicName: 'DC/PACT GREEN FOUR',
          clinicFriendlyLocationName: 'GREEN VASSALL',
          primaryStopCode: '323',
          secondaryStopCode: '',
          directSchedulingFlag: 'Y',
          displayToPatientFlag: 'Y',
          institutionName: 'Washington VA Medical Center',
          institutionCode: '983GB',
          objectType: 'CdwClinic',
          link: [],
        },
      ],
    },
    data: {
      isDirectSchedule: true,
      typeOfCareId: '323',
      vaSystem: '983',
      vaFacility: '983GB',
      clinicId: '2276',
      appointmentTime: '2019-10-03T08:30:00',
      phoneNumber: '5555555555',
      email: 'fake@va.gov',
      additionalDetails: 'My foot hurts',
      reasonForAppointment: 'routine-follow-up',
    },
  },
};

export class ReviewPage extends React.Component {
  render() {
    const { data, facility, clinic } = this.props;

    return (
      <div>
        {data.isDirectSchedule && (
          <ReviewDirectScheduleInfo
            data={data}
            facility={facility}
            clinic={clinic}
          />
        )}
        {!data.isDirectSchedule && (
          <ReviewRequestInfo data={data} facility={facility} />
        )}
        <div className="vads-u-margin-y--2">
          <LoadingButton
            onClick={() => this.props.router.push('/')}
            className="usa-button usa-button-primary"
          >
            {data.isDirectSchedule
              ? 'Confirm appointment'
              : 'Request appointment'}
          </LoadingButton>
        </div>
      </div>
    );
  }
}

ReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  facility: PropTypes.object,
  clinic: PropTypes.object,
};

function mapStateToProps() {
  const state = dsState;
  dsState.newAppointment.data.isDirectSchedule = false;
  return {
    data: getFormData(state),
    facility: getChosenFacilityInfo(state),
    clinic: getChosenClinicInfo(state),
  };
}

export default connect(mapStateToProps)(ReviewPage);
