import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import QuestionnaireItem from '../QuestionnaireItem';

const index = props => {
  const { questionnaires } = props;
  return (
    <div id="tabpanel_completed">
      <h2>Completed questionnaires</h2>
      <ul className="questionnaire-list completed">
        {questionnaires.map(questionnaire => {
          const { questionnaireResponse } = questionnaire;
          return (
            <QuestionnaireItem
              key={questionnaire.appointment.id}
              data={questionnaire}
              Actions={() => (
                <button className="va-button">View and print questions</button>
              )}
              DueDate={() => (
                <p className="completed-date">
                  Submitted on{' '}
                  {moment(questionnaireResponse.submittedOn).format(
                    'MMMM D, YYYY',
                  )}
                </p>
              )}
            />
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
