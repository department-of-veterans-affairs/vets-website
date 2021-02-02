import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import QuestionnaireItem from '../QuestionnaireItem';
import EmptyMessage from '../Messages/EmptyMessage';
import ServiceDown from '../Messages/ServiceDown';
import AnswerQuestions from '../Shared/Buttons/AnswerQuestions';
import ViewAndPrint from '../Shared/Buttons/ViewAndPrint';
import { getAppointmentStatus, isAppointmentCancelled } from '../../../utils';

const index = props => {
  const { questionnaires } = props;
  return (
    <div id="tabpanel_toDo">
      <h2 className="questionnaire-list-header">To-do questionnaires</h2>
      {questionnaires ? (
        <>
          {questionnaires.length === 0 ? (
            <EmptyMessage
              message={
                'Your health care providers haven’t sent any questionnaires to you yet.'
              }
            />
          ) : (
            <ul
              data-testid="questionnaire-list"
              className="questionnaire-list toDo"
            >
              {questionnaires.map(data => {
                const { appointment, questionnaire } = data;
                const appointmentStatus = getAppointmentStatus(appointment);
                const isCancelled = isAppointmentCancelled(appointmentStatus);

                return (
                  <QuestionnaireItem
                    key={appointment.id}
                    data={data}
                    extraText={
                      isCancelled
                        ? 'for your canceled or rescheduled appointment at CHY PC CASSIDY, Cheyenne VA Medical Center. You can access this questionnaire to copy answers for a rescheduled appointment.'
                        : ''
                    }
                    Actions={() =>
                      isCancelled ? (
                        <ViewAndPrint />
                      ) : (
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
                      )
                    }
                    DueDate={() => {
                      const dueDate = moment(
                        appointment.attributes.vdsAppointments[0]
                          .appointmentTime,
                      );
                      const guess = moment.tz.guess();
                      const formattedTimezone = moment.tz(guess).format('z');
                      const meridiem = dueDate.hours() > 12 ? 'p.m.' : 'a.m.';
                      return (
                        <section className="due-date">
                          <p>{isCancelled ? 'Access until' : 'Complete by'}</p>
                          <p className="vads-u-font-weight--bold">
                            {dueDate.format('dddd, MMMM D, YYYY')}
                          </p>
                          {!isCancelled && (
                            <p className="vads-u-font-weight--bold">
                              {dueDate.format(`H:MM`)} {meridiem}{' '}
                              {formattedTimezone}
                            </p>
                          )}
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
