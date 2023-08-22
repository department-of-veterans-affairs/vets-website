import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { RequiredLoginView } from '@department-of-veterans-affairs/platform-user/RequiredLoginView';

import { getAvs } from '../api/v0';
import {
  getFormattedAppointmentDate,
  getFormattedGenerationDate,
} from '../utils';

import YourAppointment from '../components/YourAppointment';
import YourHealthInformation from '../components/YourHealthInformation';
import YourTreatmentPlan from '../components/YourTreatmentPlan';
import MoreInformation from '../components/MoreInformation';

const generateAppointmentHeader = avs => {
  const appointmentDate = getFormattedAppointmentDate(avs);
  return `Your appointment on ${appointmentDate}`;
};

const generateFooter = avs => {
  const generationDate = getFormattedGenerationDate(avs);
  return (
    <p>
      Date and time generated
      <br />
      {generationDate}
    </p>
  );
};

const Avs = props => {
  // TODO: boot folks out if the feature toggle is not enabled.
  const user = useSelector(selectUser);
  const { isLoggedIn } = props;
  const { id } = props.params;

  const [avs, setAvs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchAvs = async () => {
        const response = await getAvs(id);
        // cf. https://github.com/department-of-veterans-affairs/avs/blob/master/ll-avs-web/src/main/java/gov/va/med/lom/avs/client/model/AvsDataModel.java
        setAvs(response.data.attributes);
        setLoading(false);
      };

      if (isLoggedIn) {
        fetchAvs();
      }
    },
    [id, isLoggedIn],
  );

  if (isLoggedIn && loading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message="Loading your After-visit Summary"
      />
    );
  }

  return (
    <div className="vads-l-grid-container main-content">
      <RequiredLoginView
        user={user}
        serviceRequired={[backendServices.USER_PROFILE]}
      >
        <h1>After-visit Summary</h1>
        <va-accordion>
          <va-accordion-item header={generateAppointmentHeader(avs)}>
            <YourAppointment avs={avs} />
          </va-accordion-item>
          <va-accordion-item header="Your treatment plan from this appointment">
            <YourTreatmentPlan avs={avs} />
          </va-accordion-item>
          <va-accordion-item header="Your health information as of this appointment">
            <YourHealthInformation avs={avs} />
          </va-accordion-item>
          <va-accordion-item header="More information">
            <MoreInformation avs={avs} />
          </va-accordion-item>
        </va-accordion>
        {generateFooter(avs)}
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
