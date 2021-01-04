import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { getCurrentAppointmentId } from '../../utils';

import delay from 'lodash/delay';

const HiddenFields = props => {
  const { onChange, context } = props;
  const [questionnaireId] = useState(context.questionnaire?.id);
  const [appointmentId] = useState(getCurrentAppointmentId(window));

  useEffect(
    () => {
      if (questionnaireId || appointmentId) {
        delay(() => {
          onChange({ questionnaireId, appointmentId });
        }, 0);
      }
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
