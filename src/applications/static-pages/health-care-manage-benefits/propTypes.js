import PropTypes from 'prop-types';

export const authenticatedWithSSOePropType = PropTypes.bool;

export const ehrDataByVhaIdPropType = PropTypes.objectOf(
  PropTypes.shape({
    vhaId: PropTypes.string.isRequired,
    vamcFacilityName: PropTypes.string.isRequired,
    vamcSystemName: PropTypes.string.isRequired,
    ehr: PropTypes.oneOf(['vista', 'cerner_staged', 'cerner']),
  }).isRequired,
);

export const facilitiesPropType = PropTypes.arrayOf(
  PropTypes.shape({
    facilityId: PropTypes.string.isRequired,
    isCerner: PropTypes.bool.isRequired,
    usesCernerAppointments: PropTypes.bool,
    usesCernerMedicalRecords: PropTypes.bool,
    usesCernerMessaging: PropTypes.bool,
    usesCernerRx: PropTypes.bool,
    usesCernerTestResults: PropTypes.bool,
  }).isRequired,
);

export const cernerFacilitiesPropType = PropTypes.arrayOf(
  PropTypes.shape({
    facilityId: PropTypes.string.isRequired,
    isCerner: PropTypes.bool.isRequired,
    usesCernerAppointments: PropTypes.bool,
    usesCernerMedicalRecords: PropTypes.bool,
    usesCernerMessaging: PropTypes.bool,
    usesCernerRx: PropTypes.bool,
    usesCernerTestResults: PropTypes.bool,
  }).isRequired,
);

export const otherFacilitiesPropType = PropTypes.arrayOf(
  PropTypes.shape({
    facilityId: PropTypes.string.isRequired,
    isCerner: PropTypes.bool.isRequired,
  }).isRequired,
);

export const useSingleLogoutPropType = PropTypes.bool;
