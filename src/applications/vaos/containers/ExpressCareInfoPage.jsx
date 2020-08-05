import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import React from 'react';
import { connect } from 'react-redux';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/expressCare';
import FormButtons from '../components/FormButtons';
import { selectExpressCare } from '../utils/selectors';
import { scrollAndFocus } from '../utils/scrollAndFocus';

const pageKey = 'info';
const pageTitle = 'How Express Care works';

class ExpressCareInfoPage extends React.Component {
  componentDidMount() {
    document.title = `${pageTitle} | Veterans Affairs`;

    scrollAndFocus();
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { localWindowString } = this.props;
    return (
      <div>
        <h1>{pageTitle}</h1>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <p className="vads-u-font-size--h4 vads-u-font-family--serif vads-u-padding-y--0p25 vads-u-font-weight--bold">
                Submit an Express Care request online
              </p>
              You can request Express Care today between{' '}
              {localWindowString?.replace(' to ', ' and ')}. You don’t need to
              have an assigned Patient Aligned Care Team (PACT) to use Express
              Care.
            </li>
            <li className="process-step list-two">
              <p className="vads-u-font-size--h4 vads-u-font-family--serif vads-u-padding-y--0p25 vads-u-font-weight--bold">
                Wait for a call from VA health care staff
              </p>
              Someone from VA health care staff will call you soon after you
              submit your request. This call won’t be from your primary care
              provider or someone on your PACT team.
            </li>
            <li className="process-step list-three">
              <p className="vads-u-font-size--h4 vads-u-font-family--serif vads-u-padding-y--0p25 vads-u-font-weight--bold">
                Talk to the VA health care staff member about your health
                concern
              </p>
              The VA health care staff will assess your condition and recommend
              next steps. Depending on your needs, they might recommend you have
              a follow-up phone or video call with your primary care provider or
              a specialist. They might recommend a prescription. Not all Express
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
          <p>
            <strong>
              Call <a href="tel:911">911</a> or go to the nearest emergency room
              now if you have any of these symptoms:
            </strong>
          </p>
          <ul>
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
          <p>
            <strong>If you need to talk to someone right now:</strong>
          </p>
          <ul>
            <li>
              Call our Veterans Crisis Line at{' '}
              <a href="tel:800-273-8255">800-273-8255</a> and select 1.
            </li>
          </ul>
        </AlertBox>
        <p>
          <b>
            By choosing to continue with your Express Care request, you agree
            that you don't have any of the symptoms listed above.
          </b>
        </p>

        <FormButtons
          backBeforeText=""
          backButtonText="Cancel"
          nextButtonText="Continue with Express Care request"
          onBack={this.goBack}
          onSubmit={this.goForward}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  selectExpressCare,
  mapDispatchToProps,
)(ExpressCareInfoPage);
