import React from 'react';
import PropTypes from 'prop-types';
import { FIELD_IDS, FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { connect } from 'react-redux';
import { ProfileInfoSection } from '../ProfileInfoSection';
import LoadFail from '../alerts/LoadFail';

const SchedulingPreferencesContent = props => {
  const { hasSchedulingPreferencesError } = props;
  const contactPreferencesData = [
    {
      title: FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
      id: FIELD_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.SCHEDULING_PREF_CONTACT_METHOD}
        />
      ),
    },
    {
      title: FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES],
      id: FIELD_IDS[FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.SCHEDULING_PREF_CONTACT_TIMES}
        />
      ),
    },
  ];

  const appointmentPreferencesData = [
    {
      title: FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING],
      id: FIELD_IDS[FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.SCHEDULING_PREF_HELP_SCHEDULING}
        />
      ),
    },
    {
      title: FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES],
      id: FIELD_IDS[FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.SCHEDULING_PREF_APPOINTMENT_TIMES}
        />
      ),
    },
  ];

  const providerPreferencesData = [
    {
      title: FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER],
      id: FIELD_IDS[FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.SCHEDULING_PREF_PROVIDER_GENDER}
        />
      ),
    },
    {
      title: FIELD_TITLES[FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING],
      id: FIELD_IDS[FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.SCHEDULING_PREF_HELP_CHOOSING}
        />
      ),
    },
  ];

  return (
    <>
      {hasSchedulingPreferencesError ? (
        <LoadFail />
      ) : (
        <>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
            Manage your scheduling preferences for health care appointments.
            When possible, schedulers will consider your preferences when
            scheduling your appointments.
          </p>

          <ProfileInfoSection
            title="Contact preferences"
            level={2}
            data={contactPreferencesData}
            className="vads-u-margin-bottom--4"
          />

          <ProfileInfoSection
            title="Appointment preferences"
            level={2}
            data={appointmentPreferencesData}
            className="vads-u-margin-bottom--4"
          />

          <ProfileInfoSection
            title="Provider preferences"
            level={2}
            data={providerPreferencesData}
          />
        </>
      )}
    </>
  );
};

SchedulingPreferencesContent.propTypes = {
  hasSchedulingPreferencesError: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  preferredContactMethod:
    state.vaProfile?.schedulingPreferences?.preferredContactMethod,
  preferredContactTimes:
    state.vaProfile?.schedulingPreferences?.preferredContactTimes,
  needsHelpSchedulingAppointments:
    state.vaProfile?.schedulingPreferences?.needsHelpSchedulingAppointments,
  preferredAppointmentTimes:
    state.vaProfile?.schedulingPreferences?.preferredAppointmentTimes,
  preferredProviderGender:
    state.vaProfile?.schedulingPreferences?.preferredProviderGender,
  needsHelpChoosingProvider:
    state.vaProfile?.schedulingPreferences?.needsHelpChoosingProvider,
});

export default connect(mapStateToProps)(SchedulingPreferencesContent);
