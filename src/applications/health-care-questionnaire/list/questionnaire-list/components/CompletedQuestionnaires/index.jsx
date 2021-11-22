import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import QuestionnaireItem from '../QuestionnaireItem';
import EmptyMessage from '../Messages/EmptyMessage';
import ServiceDown from '../Messages/ServiceDown';
import PrintButton from '../../../../shared/components/print/PrintButton';

import {
  appointmentSelector,
  organizationSelector,
  questionnaireResponseSelector,
} from '../../../../shared/utils/selectors';

const index = props => {
  const { questionnaires } = props;
  return (
    <div id="tabpanel_completed">
      <h2 className="questionnaire-list-header">Completed questionnaires</h2>
      {questionnaires ? (
        <>
          {questionnaires.length === 0 ? (
            <EmptyMessage
              message={
                "We don't have any completed health questionnaires for you in our system."
              }
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/no-redundant-roles
            <ol
              className="questionnaire-list completed"
              data-testid="questionnaire-list"
              role="list"
            >
              {questionnaires.map(data => {
                const { questionnaire, appointment, organization } = data;
                const facilityName = organizationSelector.getName(organization);
                const appointmentTime = appointmentSelector.getStartDateTime(
                  appointment,
                );

                const qr = questionnaireResponseSelector.getQuestionnaireResponse(
                  questionnaire[0].questionnaireResponse,
                );

                return (
                  <QuestionnaireItem
                    key={appointment.id}
                    data={data}
                    Actions={() => (
                      <PrintButton
                        displayArrow={false}
                        facilityName={facilityName}
                        appointmentTime={appointmentTime}
                        questionnaireResponseId={qr.id}
                      />
                    )}
                    DueDate={() => {
                      if (!qr.submittedOn) {
                        return <p className="completed-date" />;
                      } else {
                        return (
                          <>
                            <dt className="vads-u-margin-top--1p5">
                              Submitted on
                            </dt>
                            <dd>
                              {moment(qr.submittedOn).format('dddd')}{' '}
                              <time
                                dateTime={moment(qr.submittedOn).format(
                                  'YYYY-MM-DDTHH:MM',
                                )}
                              >
                                {moment(qr.submittedOn).format('MMMM D, YYYY')}
                              </time>
                            </dd>
                          </>
                        );
                      }
                    }}
                  />
                );
              })}
            </ol>
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
