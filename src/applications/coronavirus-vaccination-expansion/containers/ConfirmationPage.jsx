import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';

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
    return (
      <div>
        <h2>We've received your information</h2>
        <p>
          Thank you for signing up to get a COVID-19 vaccine at VA. When we have
          new information to share about our COVID-19 plans and your vaccine
          options, we'll send you updates by email or text.
        </p>
        <h2>When can I get a COVID-19 at VA?</h2>
        <p>
          At this time, we still have a limited amount of vaccines. We’re
          working to determine how quickly we can begin to offer vaccines
          to people other than Veterans who are already enrolled in VA health
          care. We appreciate your patience as we prepare to offer more
          vaccines.
        </p>
        <p>
          Your employer, pharmacy, healthcare provider’s office, or local public
          health officials may offer you a COVID-19 vaccine. We encourage you to
          take the first opportunity you have to get a vaccine at the most
          convenient location for you.
        </p>
        <p>
          <strong>Note:</strong> We’ll contact you when you can get a vaccine.
          You don’t need to call or go in person to a VA health facility.
        </p>
        <h2>How will VA contact me when I can get a COVID-19 vaccine?</h2>
        <p>
          Your closest VA health facility may contact you by phone, email, or
          text message. If you’re eligible and want to get a vaccine, we
          encourage you to respond.
        </p>
        <p>
          But before you provide any personal information or click on any links,
          be sure the call, email, or text is really from VA.
        </p>
        <ul>
          <li>
            Text messages will always come from <strong>53079</strong>.
          </li>
          <li>
            Emails will always come from a <strong>va.gov</strong> email
            address.
          </li>
          <li>
            If someone calls you from VA and you don’t recognize the phone
            number, ask for a number to call them back. Then call the VA health
            facility to verify.{' '}
          </li>
        </ul>
        <p>Your facility may invite you to get a vaccine in different ways:</p>
        <ul>
          <li>
            They may invite you to a large vaccination event, like a drive-thru
            clinic.
          </li>
          <li>They may offer you a specific date and time to get a vaccine.</li>
          <li>They may ask you to schedule an appointment.</li>
        </ul>
        <h2>If I’m a Veteran, how can I apply for VA health care?</h2>
        <p>
          First, you’ll need to find out if you’re eligible based on your
          service history or other factors. If you’re eligible, you can apply
          online.
        </p>
        <a
          href="/health-care/how-to-apply/"
          className="vads-u-padding-bottom--4 vads-u-display--block"
        >
          Find out if you're eligible for VA health care and how to apply
        </a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
