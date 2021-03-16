import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import CollapsiblePanel from '@department-of-veterans-affairs/component-library/CollapsiblePanel';
import recordEvent from 'platform/monitoring/record-event';
import * as actions from '../redux/actions';
import { GA_PREFIX } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import NewTabAnchor from '../../components/NewTabAnchor';

const pageKey = 'planAhead';
const pageTitle = 'Plan ahead';

function PlanAheadPage({ routeToNextAppointmentPage }) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      <p>
        If you haven’t received a COVID-19 vaccine yet, you can schedule one
        now.
      </p>

      <ProgressButton
        buttonText="Start scheduling"
        buttonClass="vads-u-font-weight--bold vads-u-font-size--md vads-u-width--full small-screen:vads-u-width--auto"
        onButtonClick={() => {
          recordEvent({
            event: `${GA_PREFIX}-covid19-start-scheduling-button-clicked`,
          });
          routeToNextAppointmentPage(history, pageKey);
        }}
      />
      <h2 className="vads-u-margin-top--2">Common questions</h2>
      <CollapsiblePanel panelName="Collapsible panel example">
        <div>Panel contents go here.</div>
      </CollapsiblePanel>
      <CollapsiblePanel panelName="Collapsible panel example">
        <div>Panel contents go here.</div>
      </CollapsiblePanel>
      <CollapsiblePanel panelName="Collapsible panel example">
        <div>Panel contents go here.</div>
      </CollapsiblePanel>
      <CollapsiblePanel panelName="Collapsible panel example">
        <div>Panel contents go here.</div>
      </CollapsiblePanel>
      <NewTabAnchor
        href="/health-care/covid-19-vaccine"
        className="vads-u-display--block vads-u-margin-top--2"
      >
        Learn more about COVID-19 vaccines at the VA.
      </NewTabAnchor>
    </div>
  );
}

const mapDispatchToProps = {
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
};

export default connect(
  null,
  mapDispatchToProps,
)(PlanAheadPage);
