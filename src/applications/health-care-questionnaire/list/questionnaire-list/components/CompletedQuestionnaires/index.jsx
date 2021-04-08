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
            <ol
              data-testid="questionnaire-list"
              className="questionnaire-list completed"
            >
              {questionnaires.map(data => {
                const { questionnaire, appointment, organization } = data;
                const facilityName = organizationSelector.getName(organization);
                const appointmentTime = appointmentSelector.getStartTime(
                  appointment,
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
                      />
                    )}
                    DueDate={() => (
                      <p className="completed-date">
                        Submitted on
                        <br />
                        <span className={`vads-u-font-weight--bold`}>
                          {moment(
                            questionnaire[0].questionnaireResponse.submittedOn,
                          ).format('dddd, MMMM D, YYYY')}
                        </span>
                      </p>
                    )}
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
