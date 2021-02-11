import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { GA_PREFIX } from '../../utils/constants';
import * as actions from '../redux/actions';
import FormButtons from '../../components/FormButtons';
import { selectLocalExpressCareWindowString } from '../../appointment-list/redux/selectors';
import { selectExpressCareNewRequest } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/component-library/Telephone';

const pageKey = 'info';
const pageTitle = 'How Express Care works';

function ExpressCareInfoPage({
  localWindowString,
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
              Submit an Express Care request online
            </h2>
            You can request Express Care today between{' '}
            {localWindowString?.replace(' to ', ' and ')}. You don’t need to
            have an assigned Patient Aligned Care Team (PACT) to use Express
            Care.
          </li>
          <li className="process-step list-two">
            <h2 className="vads-u-padding-y--0p25">
              Wait for a call from VA health care staff
            </h2>
            Someone from VA health care staff will call you soon after you
            submit your request. This call won’t be from your primary care
            provider or someone on your PACT team.
          </li>
          <li className="process-step list-three">
            <h2 className="vads-u-padding-y--0p25">
              Talk to the VA health care staff member about your health concern
            </h2>
            The VA health care staff will assess your condition and recommend
            next steps. Depending on your needs, they might recommend you have a
            follow-up phone or video call with your primary care provider or a
            specialist. They might recommend a prescription. Not all Express
            Care calls will result in a follow-up appointment.
          </li>
        </ol>
      </div>
      <AlertBox
        headline="Express Care can’t provide emergency help"
        status="warning"
        className="vads-u-margin-top--0p5 vads-u-margin-bottom--4"
        isVisible
      >
        <p id="vaos-ecip-call-911" data-testid="p_vaos-ecip-call-911">
          <strong>
            Call <Telephone contact={CONTACTS['911']} /> or go to the nearest
            emergency room now if you have any of these symptoms:
          </strong>
        </p>
        <ul
          aria-labelledby="vaos-ecip-call-911"
          data-testid="ul_vaos-ecip-call-911"
        >
          <li>Major bleeding or trauma</li>
          <li>Chest pain with shortness of breath</li>
          <li>Sudden inability to speak or walk</li>
          <li>Vaginal bleeding or abdominal pain during pregnancy</li>
          <li>Sudden, severe headache</li>
          <li>Sudden vision loss</li>
        </ul>
        <p>
          <b>Note: </b>
          For emergencies, you don’t need a VA referral or approval to go a
          non-VA ER in your community.
        </p>
        <p id="vaos-ecip-talk" data-testid="p_vaos-ecip-talk">
          <strong>If you need to talk to someone right now:</strong>
        </p>
        <ul aria-labelledby="vaos-ecip-talk" data-testid="ul_vaos-ecip-talk">
          <li>
            Call our Veterans Crisis Line at{' '}
            <Telephone contact="800-273-8255" extension="1" />.
          </li>
        </ul>
      </AlertBox>
      <p>
        <b>
          By choosing to continue with your Express Care request, you agree that
          you don't have any of the symptoms listed above.
        </b>
      </p>

      <FormButtons
        backBeforeText=""
        backButtonText="Cancel"
        nextButtonText="Continue with Express Care request"
        pageChangeInProgress={pageChangeInProgress}
        onBack={() => {
          recordEvent({
            event: `${GA_PREFIX}-express-care-path-cancelled`,
          });
          routeToPreviousAppointmentPage(history, pageKey);
        }}
        onSubmit={() => {
          recordEvent({
            event: `${GA_PREFIX}-express-care-path-started`,
          });
          routeToNextAppointmentPage(history, pageKey);
        }}
      />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    ...selectExpressCareNewRequest(state),
    localWindowString: selectLocalExpressCareWindowString(state),
  };
};

const mapDispatchToProps = {
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareInfoPage);
