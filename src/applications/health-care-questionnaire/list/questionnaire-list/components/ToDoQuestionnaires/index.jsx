import React from 'react';
import { connect } from 'react-redux';

import EmptyMessage from '../Messages/EmptyMessage';
import ServiceDown from '../Messages/ServiceDown';
import ToDoQuestionnaireItem from './ToDoQuestionnaireItem';

const Index = props => {
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
            <ol
              data-testid="questionnaire-list"
              className="questionnaire-list toDo"
              aria-label="Your outstanding questionnaires"
            >
              {questionnaires.map((data, i) => {
                return <ToDoQuestionnaireItem data={data} key={i} />;
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
    questionnaires: state.questionnaireListData?.list?.questionnaires?.toDo,
  };
}

export default connect(mapStateToProps)(Index);
