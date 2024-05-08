import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import ServiceProvidersText, {
  ServiceProvidersTextCreateAcct,
} from 'platform/user/authentication/components/ServiceProvidersText';

import manifest from '../manifest.json';

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('#thank-you-message');
    scrollToTop('topScrollElement');
  }

  handlePrintClick = () => {
    window.print();
  };

  render() {
    const { submission, data } = this.props.form;
    const { response } = submission;
    const veteranFirstName = data?.veteranInformation?.fullName?.first || '';
    const veteranLastName = data?.veteranInformation?.fullName?.last || '';
    const dateSubmitted = moment(response?.timestamp);

    return (
      <>
        <div className="print-only">
          <img
            src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
            alt="VA logo"
            width="300"
          />
          <h2 className="vads-u-margin-top--2">
            Add or remove a dependent on your VA disability benefits
          </h2>
          <div className="vads-u-margin-bottom--2">
            VA Form 21-686c (with 21P-527EZ and 21-674)
          </div>
        </div>
        <div className="inset">
          <h2
            id="thank-you-message"
            className="vads-u-font-size--h3 vads-u-font-family--serif vads-u-margin-top--1"
          >
            Thank you for submitting your application
          </h2>
          <dl>
            <dt>
              <strong>
                Application for Declaration of Status of Dependents (Form
                21-686c), and/or
                <br />
                Request for Approval of School Attendance (Form 21-674), and/or
                <br />
                Application for Veterans Pension (Form 21P-527EZ)
              </strong>
            </dt>
            <dd>
              {veteranFirstName || veteranLastName
                ? `for ${veteranFirstName} ${veteranLastName}`
                : ''}
            </dd>
            <dt>
              <strong>Date submitted</strong>
            </dt>
            <dd>
              {dateSubmitted.isValid()
                ? dateSubmitted.format('MMMM D, YYYY')
                : ''}
            </dd>
          </dl>
          <button
            type="button"
            className="usa-button screen-only"
            onClick={this.handlePrintClick}
          >
            Print this page for your records
          </button>
        </div>
        <div>
          <h2 className="vads-u-font-size--h3 vads-u-font-family--serif">
            How long will it take VA to make a decision on my application?
          </h2>

          <p>
            We usually decide on applications within <strong>1 week</strong>. If
            we need you to provide more information or documents, we’ll contact
            you by mail.
          </p>
          <p>
            If we haven’t contacted you within a week after you submitted your
            application, <strong>don’t apply again</strong>. Instead, call our
            toll-free hotline at{' '}
            <va-telephone contact="8772228387" vanity="VETS" />. We’re here
            Monday through Friday, 8:00 am to 8:00 pm ET
          </p>

          <h2 className="vads-u-font-size--h3 vads-u-font-family--serif">
            How can I check the status of my application?
          </h2>
          <ol className="process">
            <li className="process-step list-one">
              <h3 className="vads-u-font-size--h4">Sign in to VA.gov</h3>
              <p>
                You can sign in with your existing <ServiceProvidersText />
                account. <ServiceProvidersTextCreateAcct isFormBased />
              </p>
            </li>
            <li className="process-step list-two">
              <h3 className="vads-u-font-size--h4">
                If you haven’t yet verified your identity, complete this process
                when prompted
              </h3>
              <p>
                This helps keep you information safe, and prevents fraud and
                identity theft. If you’ve already verified your identity with
                us, you won’t need to do this again..
              </p>
            </li>
            <li className="process-step list-three">
              <h3 className="vads-u-font-size--h4">
                Go to your personalized My VA homepage
              </h3>
              <p>
                Once you’re signed in, you can go to your homepage by clicking
                on the <strong>My VA link</strong> near the top right of any
                VA.gov page. You’ll find your application status information in
                the <strong>Your Applications</strong> section of you homepage.
              </p>
              <p>
                <strong>Note:</strong> Your application status may take some
                time to appear on our homepage. If you don’t see it there right
                away, check back later.
              </p>
            </li>
          </ol>
          <h2 className="vads-u-font-size--h3 vads-u-font-family--serif vads-u-margin-top--0">
            How will I know if my application to add or remove dependents is
            approved?
          </h2>
          <p className="vads-u-margin-bottom--6">
            We’ll send you a packet by U.S. mail that includes details of the
            decision on your claim. If you check your status online and see a
            decision, allow 7 to 10 business days for your packet to arrive
            before contacting a VA call center.
          </p>
          <h2 className="vads-u-font-size--h3 vads-u-font-family--serif">
            What if I need to add or remove another dependent now or at a later
            time?
          </h2>
          <p className="vads-u-margin-bottom--6">
            If something changes in your family status let VA know. Return to
            the <a href={manifest.rootUrl}>21-686c</a> form, select the option
            that describes your family status change and complete the form. This
            will update our records and your benefits pay will be adjusted
            accordingly.
          </p>
          <h2 className="vads-u-font-size--h3 vads-u-font-family--serif">
            What if I have more questions?
          </h2>
          <p className="vads-u-margin-bottom--6">
            Call <va-telephone contact="8772228387" vanity="VETS" /> and select
            2. We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      veteranInformation: PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          last: PropTypes.string,
        }),
      }),
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      response: {
        timestamp: PropTypes.string,
      },
    }),
  }),
};

export default connect(mapStateToProps)(ConfirmationPage);
