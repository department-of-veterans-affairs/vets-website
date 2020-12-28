import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

const pageKey = 'confirmation';
const pageTitle = 'Confirmation';

function ConfirmationPage({
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
        backBeforeText=""
        backButtonText="Cancel"
        nextButtonText="Continue with request"
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
)(ConfirmationPage);
