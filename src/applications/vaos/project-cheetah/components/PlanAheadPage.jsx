import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import { GA_PREFIX } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import NewTabAnchor from '../../components/NewTabAnchor';
import FormButtons from '../../components/FormButtons';

const pageKey = 'planAhead';
const pageTitle = 'COVID-19 vaccine appointment';

function PlanAheadPage({
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  pageChangeInProgress,
}) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <p>Here’s what to know:</p>
      <div className="vads-u-padding-y--1p5">
        <div className="vads-l-row vads-u-padding-bottom--2p5">
          {/* icon */}
          <div className="vads-l-col--1">
            <i
              aria-hidden="true"
              className="fas fa-info-circle vads-u-font-size--xl vads-u-color--gray"
            />
          </div>
          {/* text  */}
          <div className="vads-l-col--11 vads-u-padding-left--3 small-desktop-screen:vads-u-padding-left--0 medium-screen:vads-u-padding-left--1">
            Some COVID-19 vaccines require 2 doses.
          </div>
        </div>
        <div className="vads-l-row vads-u-padding-bottom--2p5">
          {/* icon  */}
          <div className="vads-l-col--1 ">
            <i
              aria-hidden="true"
              className="fas fa-info-circle vads-u-font-size--xl vads-u-color--gray"
            />
          </div>
          {/* text  */}
          <div className="vads-l-col--11 vads-u-padding-left--3 small-desktop-screen:vads-u-padding-left--0 medium-screen:vads-u-padding-left--1">
            If you get a vaccine that requires a second dose, we’ll schedule
            your second appointment while you’re here for your first dose.
          </div>
        </div>
      </div>

      <p>
        If you have questions,{' '}
        <NewTabAnchor
          href="/health-care/covid-19-vaccine"
          className="vads-u-margin-top--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-COVID-19-vaccines-at-VA-link-clicked`,
            });
          }}
        >
          go to our main COVID-19 vaccine at VA page.
        </NewTabAnchor>
      </p>
      <FormButtons
        pageChangeInProgress={pageChangeInProgress}
        onButtonClick={() => {
          recordEvent({
            event: `${GA_PREFIX}-covid19-start-scheduling-button-clicked`,
          });
          routeToNextAppointmentPage(history, pageKey);
        }}
        onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
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
)(PlanAheadPage);
