import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import { focusElement } from 'platform/utilities/ui';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    const { submission, data } = this.props.form;
    const { isLoggedIn, fullName } = this.props;
    const { response } = submission;
    const name = isLoggedIn ? fullName : data.fullName;

    return (
      <div>
        <p>
          Equal to VA Form 28-8832 (Education/Vocational Counseling Application)
        </p>
        <div className="inset">
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--1">
            Thank you for submitting your application
          </h2>
          <h3 className="vads-u-font-size--h4">
            Education/Vocational Counseling Application{' '}
            <span className="additional">(Form 28-8832)</span>
          </h3>
          {name.first &&
            name.last && (
              <p>
                FOR: {name.first} {name.last}
              </p>
            )}

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
          If you're eligible for career counseling benefits, we'll invite you to
          an orientation session at your nearest VA regional office.
        </p>
        <h3>How long will it take VA to process my application?</h3>
        <p>
          We usually decide on applications within 1 week. If we need you to
          provide more information or documents, we’ll contact you by mail.
        </p>
        <p>
          If we haven’t contacted you within a week after you submitted your
          application, please don’t apply again. Instead, please call our
          toll-free hotline at <Telephone contact={CONTACTS.VA_BENEFITS} />.
          We’re here Monday through Friday, 8:00 am to 8:00 pm ET.
        </p>
        <h3>How can I check the status of my application?</h3>
        <div className="process schemaform-process vads-u-padding-bottom--0">
          <ol>
            <li className="process-step list-one vads-u-padding-bottom--1p5">
              <h3 className="vads-u-font-size--h5">Sign in to VA.gov</h3>
              <p>
                You can sign in with your DS Logon, My HealtheVet, or ID.me
                account. If you completed this form without signing in, and you
                don’t have an account, you can create one now.
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
                Applications section of you homepage.
              </p>
              <p>
                Please note: Your application status may take some time to
                appear on our homepage. If you don’t see it there right away,
                please check back later.
              </p>
            </li>
          </ol>
        </div>
        <h3 className="vads-u-margin-top--1p5">
          What if I have more questions?
        </h3>
        <p>
          Please call our toll-free hotline at{' '}
          <Telephone contact={CONTACTS.VA_BENEFITS} />. We’re here Monday
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
