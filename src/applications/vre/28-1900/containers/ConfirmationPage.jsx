import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { focusElement } from 'platform/utilities/ui';

import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('#thank-you-message');
    scrollToTop('topScrollElement');
  }

  render() {
    const { submission, data } = this.props.form;
    const { isLoggedIn, fullName } = this.props;
    const { response } = submission;
    const name = isLoggedIn ? fullName : data.veteranInformation.fullName;

    return (
      <div>
        <p>
          Equal to VA Form 28-1900 (Vocational Rehabilitation for Claimants With
          Service-Connected Disabilities)
        </p>
        <div className="inset">
          <h2
            id="thank-you-message"
            className="vads-u-font-size--h3 vads-u-margin-top--1"
          >
            Thank you for submitting your application
          </h2>
          <h3 className="vads-u-font-size--h4">
            Veteran Readiness and Employment Application{' '}
            <span className="additional">(VA Form 28-1900)</span>
          </h3>
          <span>
            FOR: {name.first} {name?.middle} {name.last} {name?.suffix}
          </span>

          {response && (
            <ul className="claim-list">
              <li>
                <strong>Date submitted</strong>
                <br />
                <span>{moment(response.timestamp).format('MMM D, YYYY')}</span>
              </li>
            </ul>
          )}
          <button
            className="usa-button button screen-only"
            onClick={() => window.print()}
          >
            Print this page
          </button>
        </div>
        <h3>What happens after I apply?</h3>
        <p>
          After you apply, we’ll schedule a meeting for you with a Vocational
          Rehabilitation Counselor (VRC) to find out if you’re eligible for VR&E
          benefits and services. After we make a decision, you and your
          counselor will work together to develop a rehabilitation plan. This
          plan outlines the VR&E services you can get.
        </p>
        <h3>How long will it take VA to process my application?</h3>
        <p>
          We usually decide on applications within 1 week. If we need you to
          provide more information or documents, we’ll contact you by mail.
        </p>
        <p>
          If we haven’t contacted you within a week after you submitted your
          application, don’t apply again. Instead, call our toll-free hotline at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
          through Friday, 8:00 am to 8:00 pm ET.
        </p>
        <h3>How can I check the status of my application?</h3>
        <div className="process schemaform-process vads-u-padding-bottom--0">
          <ol>
            <li className="process-step list-one vads-u-padding-bottom--1p5">
              <h3 className="vads-u-font-size--h5">Sign in to VA.gov</h3>
              <p>
                You can sign in with your existing <ServiceProvidersText />
                account. <ServiceProvidersTextCreateAcct isFormBased />
              </p>
            </li>
            <li className="process-step list-two vads-u-padding-bottom--1p5">
              <h3 className="vads-u-font-size--h5">
                If you haven't yet verified your identity, complete this process
                when prompted
              </h3>
              <p>
                This helps keep your information safe, and prevents fraud and
                identity theft. If you’ve already verified your identity with
                us, you won’t need to do this again.
              </p>
            </li>
            <li className="process-step list-three vads-u-padding-bottom--1p5">
              <h3 className="vads-u-font-size--h5">
                Go to your personalized My VA homepage
              </h3>
              <p>
                Once you’re signed in, you can go to your homepage by clicking
                on the My VA link near the top right of any VA.gov page. You’ll
                find your application status information in the Your
                Applications section of your homepage.
              </p>
              <p>
                Note: Your application status may take some time to appear on
                our homepage. If you don’t see it there right away, check back
                later.
              </p>
            </li>
          </ol>
        </div>
        <h3 className="vads-u-margin-top--1p5">
          What if I have more questions?
        </h3>
        <p>
          Call our toll-free hotline at{' '}
          <va-telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
          through Friday, 8:00 am to 8:00 pm ET.
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
    fullName: state?.user?.profile?.userFullName,
    isLoggedIn: state?.user?.login?.currentlyLoggedIn,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
