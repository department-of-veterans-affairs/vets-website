// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
// Relative imports.
import { selectEhrDataByVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import AuthContent from '../AuthContent';
import UnauthContent from '../UnauthContent';
import {
  ehrDataByVhaIdPropType,
  facilitiesPropType,
  useSingleLogoutPropType,
} from '../../../propTypes';

export const App = ({
  ehrDataByVhaId,
  facilities,
  useSingleLogout,
  widgetType,
}) => {
  const cernerFacilities = facilities?.filter(f => f.usesCernerAppointments);
  const otherFacilities = facilities?.filter(f => !f.usesCernerAppointments);
  if (!isEmpty(cernerFacilities)) {
    return (
      <AuthContent
        cernerFacilities={cernerFacilities}
        otherFacilities={otherFacilities}
        ehrDataByVhaId={ehrDataByVhaId}
        useSingleLogout={useSingleLogout}
        widgetType={widgetType}
      />
    );
  }

  return <UnauthContent />;
};

App.propTypes = {
  // From mapStateToProps.
  widgetType: PropTypes.string.isRequired,
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  facilities: facilitiesPropType,
  useSingleLogout: useSingleLogoutPropType,
};

const mapStateToProps = state => ({
  ehrDataByVhaId: selectEhrDataByVhaId(state),
  facilities: selectPatientFacilities(state),
  useSingleLogout: state?.featureToggles?.pwEhrCtaUseSlo,
});

export default connect(
  mapStateToProps,
  null,
)(App);
