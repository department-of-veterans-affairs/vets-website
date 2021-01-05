import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import delay from 'lodash/delay';

const HiddenFields = props => {
  const { onChange, context } = props;
  const [questionnaireId] = useState(context.questionnaire?.id);
  const [appointmentId] = useState(context.appointment?.id);
  const setData = props.delay || delay;
  useEffect(
    () => {
      if (questionnaireId && appointmentId) {
        setData(() => {
          onChange({ questionnaireId, appointmentId });
        }, 0);
      }
    },
    [appointmentId, questionnaireId, onChange, setData],
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
