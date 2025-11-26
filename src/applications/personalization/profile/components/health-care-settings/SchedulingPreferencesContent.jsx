import React from 'react';
import PropTypes from 'prop-types';
import { FIELD_IDS, FIELD_NAMES, FIELD_TITLES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { ProfileInfoSection } from '../ProfileInfoSection';
import LoadFail from '../alerts/LoadFail';

const SchedulingPreferencesContent = ({ hasSchedulingPreferencesError }) => {
  const contactPreferencesData = [
    {
      title: FIELD_TITLES[FIELD_NAMES.CONTACT_PREFERENCE_1],
      id: FIELD_IDS[FIELD_NAMES.CONTACT_PREFERENCE_1],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.CONTACT_PREFERENCE_1}
        />
      ),
    },
    {
      title: FIELD_TITLES[FIELD_NAMES.CONTACT_PREFERENCE_2],
      id: FIELD_IDS[FIELD_NAMES.CONTACT_PREFERENCE_2],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.CONTACT_PREFERENCE_2}
        />
      ),
    },
  ];

  const appointmentPreferencesData = [
    {
      title: FIELD_TITLES[FIELD_NAMES.APPOINTMENT_PREFERENCE_1],
      id: FIELD_IDS[FIELD_NAMES.APPOINTMENT_PREFERENCE_1],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.APPOINTMENT_PREFERENCE_1}
        />
      ),
    },
    {
      title: FIELD_TITLES[FIELD_NAMES.APPOINTMENT_PREFERENCE_2],
      id: FIELD_IDS[FIELD_NAMES.APPOINTMENT_PREFERENCE_2],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.APPOINTMENT_PREFERENCE_2}
        />
      ),
    },
  ];

  const providerPreferencesData = [
    {
      title: FIELD_TITLES[FIELD_NAMES.PROVIDER_PREFERENCE_1],
      id: FIELD_IDS[FIELD_NAMES.PROVIDER_PREFERENCE_1],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.PROVIDER_PREFERENCE_1}
        />
      ),
    },
    {
      title: FIELD_TITLES[FIELD_NAMES.PROVIDER_PREFERENCE_2],
      id: FIELD_IDS[FIELD_NAMES.PROVIDER_PREFERENCE_2],
      value: (
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.PROVIDER_PREFERENCE_2}
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

export default SchedulingPreferencesContent;
