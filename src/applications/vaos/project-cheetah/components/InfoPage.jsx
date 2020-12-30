import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

const pageKey = 'info';
const pageTitle = 'Project Cheetah booking information';

function InfoPage({
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
      <div className="process schemaform-process">
        <ol>
          <li className="process-step list-one">
            <h2 className="vads-u-padding-y--0p25">
              Create a project cheetah appointment online
            </h2>
          </li>
          <li className="process-step list-two">
            <h2 className="vads-u-padding-y--0p25">
              Arrive at VA facility for your first appointment
            </h2>
          </li>
          <li className="process-step list-three">
            <h2 className="vads-u-padding-y--0p25">
              Create a follow-up appointment with VA staff
            </h2>
          </li>
          <li className="process-step list-four">
            <h2 className="vads-u-padding-y--0p25">
              Arrive at VA facility for your second appointment
            </h2>
          </li>
        </ol>
      </div>
      <FormButtons
        backBeforeText=""
        backButtonText="Cancel"
        nextButtonText="Continue with booking"
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
)(InfoPage);
