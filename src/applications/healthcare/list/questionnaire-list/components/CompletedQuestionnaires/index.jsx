import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import QuestionnaireItem from '../QuestionnaireItem';
import EmptyMessage from '../Messages/EmptyMessage';
import ServiceDown from '../Messages/ServiceDown';

const index = props => {
  const { questionnaires } = props;

  return (
    <div id="tabpanel_completed">
      <h2 className="questionnaire-list-header">Completed questionnaires</h2>
      {questionnaires ? (
        <>
          {questionnaires.length === 0 ? (
            <EmptyMessage />
          ) : (
            <ul
              data-testid="questionnaire-list"
              className="questionnaire-list completed"
            >
              {questionnaires.map(questionnaire => {
                const { questionnaireResponse } = questionnaire;
                return (
                  <QuestionnaireItem
                    key={questionnaire.appointment.id}
                    data={questionnaire}
                    Actions={() => (
                      <button className="va-button">
                        View and print questions
                      </button>
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
          )}
        </>
      ) : (
        <ServiceDown />
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    questionnaires:
      state.questionnaireListData?.list?.questionnaires?.completed,
  };
}

export default connect(mapStateToProps)(index);
