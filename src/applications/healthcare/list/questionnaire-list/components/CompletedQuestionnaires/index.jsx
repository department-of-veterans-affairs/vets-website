import React from 'react';
import { connect } from 'react-redux';

const index = props => {
  const { questionnaires } = props;
  return (
    <div id="tabpanel_completed">
      <h2>Title goes here</h2>
      <ul>
        {questionnaires.map(questionnaire => {
          return (
            <li key={questionnaire.appointment.id}>
              {questionnaire.appointment.facilityName}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isLoading: state.questionnaireListData?.list?.status?.isLoading,
    questionnaires:
      state.questionnaireListData?.list?.questionnaires?.completed,
  };
}

export default connect(mapStateToProps)(index);
