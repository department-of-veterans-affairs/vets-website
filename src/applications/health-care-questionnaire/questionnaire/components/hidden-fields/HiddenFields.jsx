import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { getCurrentAppointmentId } from '../../utils';

const HiddenFields = props => {
  const { onChange, context } = props;
  const [questionnaireId] = useState(context.questionnaire?.id);
  const [appointmentId] = useState(getCurrentAppointmentId(window));

  useEffect(
    () => {
      let timeout;
      if (questionnaireId || appointmentId) {
        timeout = setTimeout(
          () => onChange({ questionnaireId, appointmentId }),
          0,
        );
      }
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    },
    [appointmentId, questionnaireId, onChange],
  );

  return <></>;
};

const mapStateToProps = state => ({
  context: state?.questionnaireData?.context,
});
export default connect(
  mapStateToProps,
  null,
)(HiddenFields);
