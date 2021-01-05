import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

const pageKey = 'review';
const pageTitle = 'Review';

function ReviewPage({
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
}) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <FormButtons
        nextButtonText="Submit"
        pageChangeInProgress={pageChangeInProgress}
        onBack={() => {
          routeToPreviousAppointmentPage(history, pageKey);
        }}
        onSubmit={() => {
          routeToNextAppointmentPage(history, pageKey);
        }}
      />
    </div>
  );
}

const mapDispatchToProps = {
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  null,
  mapDispatchToProps,
)(ReviewPage);
