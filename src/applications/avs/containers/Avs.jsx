import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

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

const Avs = () => {
  // TODO: handle un-authed users.
  // TODO: boot folks out if the feature toggle is not enabled.
  const { id } = useParams();

  const [avs, setAvs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchAvs = async () => {
        const response = await getAvs(id);
        setAvs(response.data.attributes);
        setLoading(false);
      };
      fetchAvs();
    },
    [id],
  );

  if (loading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message="Loading your After-visit Summary"
      />
    );
  }

  return (
    <div>
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
    </div>
  );
};

Avs.propTypes = {
  id: PropTypes.string,
};

export default Avs;
