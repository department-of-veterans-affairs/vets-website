import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import QuestionnaireItem from '../QuestionnaireItem';

const index = props => {
  const { questionnaires } = props;
  return (
    <div id="tabpanel_toDo">
      <h2>To do questionnaires</h2>
      <ul className="questionnaire-list toDo">
        {questionnaires.map(questionnaire => {
          const { appointment } = questionnaire;

          return (
            <QuestionnaireItem
              key={appointment.id}
              data={questionnaire}
              Actions={() => (
                <button className="va-button">Answer questions</button>
              )}
              DueDate={() => {
                const dueDate = moment(appointment.appointmentTime).subtract(
                  1,
                  'day',
                );
                const meridiem = dueDate.hours() > 12 ? 'p.m.' : 'a.m.';
                return (
                  <section className="due-date">
                    <p>Due date:</p>
                    <p>{dueDate.format('dddd, MMMM D, YYYY')}</p>
                    <p>
                      {dueDate.format(`H:MM`)} {meridiem}
                    </p>
                  </section>
                );
              }}
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
    questionnaires: state.questionnaireListData?.list?.questionnaires?.toDo,
  };
}

export default connect(mapStateToProps)(index);
