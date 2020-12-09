import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import QuestionnaireItem from '../QuestionnaireItem';
import EmptyMessage from '../Messages/EmptyMessage';
import ServiceDown from '../Messages/ServiceDown';

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
              {questionnaires.map(questionnaire => {
                const { appointment } = questionnaire;
                return (
                  <QuestionnaireItem
                    key={appointment.id}
                    data={questionnaire}
                    Actions={() => (
                      <a
                        className="usa-button va-button answer-button"
                        href={`/health-care/health-questionnaires/questionnaires/answer-questions?id=${
                          appointment.id
                        }`}
                        aria-label={`Fill out your pre-appointment questionnaire for your primary care visit at ${
                          appointment.facilityName
                        } on ${moment(appointment.appointmentTime).format(
                          'MMMM, D, YYYY',
                        )}`}
                      >
                        <span>Answer questions</span>
                        <i className={`fa fa-chevron-right`} />
                      </a>
                    )}
                    DueDate={() => {
                      const dueDate = moment(
                        appointment.appointmentTime,
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
