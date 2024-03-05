import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import { getAvs } from '../api/v0';
import { getFormattedAppointmentDate } from '../utils';

import { useDatadogRum } from '../hooks/useDatadogRum';

import BreadCrumb from '../components/BreadCrumb';
import MoreInformation from '../components/MoreInformation';
import TextWithLineBreaks from '../components/TextWithLineBreaks';
import YourAppointment from '../components/YourAppointment';
import YourHealthInformation from '../components/YourHealthInformation';
import YourTreatmentPlan from '../components/YourTreatmentPlan';

const generateAppointmentHeader = avs => {
  const appointmentDate = getFormattedAppointmentDate(avs);
  return `Your appointment on ${appointmentDate}`;
};

const Avs = props => {
  useDatadogRum();

  const user = useSelector(selectUser);
  const { avsEnabled, featureTogglesLoading } = useSelector(
    state => {
      return {
        featureTogglesLoading: state.featureToggles.loading,
        avsEnabled: state.featureToggles[FEATURE_FLAG_NAMES.avsEnabled],
      };
    },
    state => state.featureToggles,
  );
  const { isLoggedIn } = props;
  const { id } = useParams();

  const [avs, setAvs] = useState({});
  const [avsLoading, setAvsLoading] = useState(true);

  const [error, setError] = useState(null);

  if (error) {
    throw error;
  }

  useEffect(
    () => {
      const fetchAvs = async () => {
        try {
          const response = await getAvs(id);

          // cf. https://github.com/department-of-veterans-affairs/avs/blob/master/ll-avs-web/src/main/java/gov/va/med/lom/avs/client/model/AvsDataModel.java
          setAvs(response.data.attributes);
          setAvsLoading(false);
        } catch (e) {
          setError(e);
        }
      };

      if (isLoggedIn && avsLoading) {
        fetchAvs();
      }
    },
    [avs, avsLoading, id, isLoggedIn],
  );

  if (avsEnabled === false) {
    window.location.replace('/');
  }

  if (isLoggedIn && (avsLoading || featureTogglesLoading)) {
    return (
      <va-loading-indicator
        data-testid="avs-loading-indicator"
        message="Loading your after-visit summary"
      />
    );
  }

  return (
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0 main-content">
      <RequiredLoginView
        user={user}
        serviceRequired={[backendServices.USER_PROFILE]}
      >
        <BreadCrumb />
        <h1>After-visit summary</h1>
        {avs.meta?.pageHeader && (
          <p>
            <TextWithLineBreaks text={avs.meta.pageHeader} />
          </p>
        )}

        <va-accordion uswds>
          <va-accordion-item
            header={generateAppointmentHeader(avs)}
            open="true"
            uswds
          >
            <YourAppointment avs={avs} />
          </va-accordion-item>
          <va-accordion-item
            header="Your treatment plan from this appointment"
            uswds
          >
            <YourTreatmentPlan avs={avs} />
          </va-accordion-item>
          <va-accordion-item
            header="Your health information as of this appointment"
            uswds
          >
            <YourHealthInformation avs={avs} />
          </va-accordion-item>
          <va-accordion-item header="More information" uswds>
            <MoreInformation avs={avs} />
          </va-accordion-item>
        </va-accordion>
      </RequiredLoginView>
    </div>
  );
};

const mapStateToProps = state => ({
  isLoggedIn: state.user.login.currentlyLoggedIn,
});

Avs.propTypes = {
  isLoggedIn: PropTypes.bool,
  params: PropTypes.object,
};

export default connect(mapStateToProps)(Avs);
