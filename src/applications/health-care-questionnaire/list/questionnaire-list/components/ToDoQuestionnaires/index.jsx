import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import QuestionnaireItem from '../QuestionnaireItem';
import EmptyMessage from '../Messages/EmptyMessage';
import ServiceDown from '../Messages/ServiceDown';
import AnswerQuestions from '../Shared/Buttons/AnswerQuestions';

const index = props => {
  const { questionnaires } = props;
  return (
    <div id="tabpanel_toDo">
      <h2 className="questionnaire-list-header">To do questionnaires</h2>
      {questionnaires ? (
        <>
          {questionnaires.length === 0 ? (
            <EmptyMessage />
          ) : (
            <ul
              data-testid="questionnaire-list"
              className="questionnaire-list toDo"
            >
              {questionnaires.map(data => {
                const { appointment, questionnaire } = data;
                return (
                  <QuestionnaireItem
                    key={appointment.id}
                    data={data}
                    Actions={() => (
                      <AnswerQuestions
                        id={appointment.id}
                        facilityName={
                          appointment.attributes.vdsAppointments[0].clinic
                            .facility.displayName
                        }
                        appointmentTime={
                          appointment.attributes.vdsAppointments[0]
                            .appointmentTime
                        }
                        status={questionnaire[0].questionnaireResponse.status}
                      />
                    )}
                    DueDate={() => {
                      const dueDate = moment(
                        appointment.attributes.vdsAppointments[0]
                          .appointmentTime,
                      ).subtract(1, 'day');
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
    questionnaires: state.questionnaireListData?.list?.questionnaires?.toDo,
  };
}

export default connect(mapStateToProps)(index);
