import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from 'platform/utilities/ui';
import FormFooter from '../components/FormFooter';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const deniedPage = (
  <div className="meb-confirmation-page meb-confirmation-page_denied">
    <h1>You are not eligible</h1>
    <div className="feature">
      <h3>
        Unfortunately, based on the information you provided and Department of
        Defense records, we have determined you are not eligible for the
        Post-9/11 GI Bill program at this time.
      </h3>
      <p>
        Your denial letter, which explains why you are ineligible, is now
        available. A physical copy will also be mailed to your mailing address.
      </p>
      <button type="button" className="usa-button">
        Download your letter
      </button>
      <a href="#">View an explanation of your benefits</a>
    </div>
    <h2>What happens next?</h2>
    <ul>
      <li>
        We will review your eligibility for other VA education benefit programs.
      </li>
      <li>You will be notified if you have potential eligibility.</li>
      <li>There is no further action required by you at this time.</li>
    </ul>
    <h2>What if I disagree with this decision?</h2>
    <p>
      If you disagree with our decision, you have until one year from the date
      of your letter to request an additional review. For more information,
      please see <a href="#">VA Form 20-0998</a>,
      <em>Your Rights to Seek Further Review of Our Decision</em>.{' '}
    </p>

    <button className="usa-button-secondary">Download your application</button>

    <a href="#">Go to your My VA dashboard</a>
    <FormFooter />
  </div>
);

export class ConfirmationPage extends React.Component {
  componentDidMount() {
    focusElement('.schemaform-title > h1');
    scrollToTop();
  }

  render() {
    const { submission, data } = this.props.form;
    const { response } = submission;
    const name = data.veteranFullName;

    const confirmationResult = 'denied';

    switch (confirmationResult) {
      case 'approved': {
        return <h1>Approved</h1>;
      }
      case 'denied': {
        return deniedPage;
      }
      case 'pending': {
        return <h1>Pending</h1>;
      }
      default: {
        return (
          <div>
            <h3 className="confirmation-page-title">Claim received</h3>
            <p>
              We usually process claims within <strong>a week</strong>.
            </p>
            <p>
              We may contact you for more information or documents.
              <br />
              <i>Please print this page for your records.</i>
            </p>
            <div className="inset">
              <h4>
                My Education Benefits Claim{' '}
                <span className="additional">(Form 22-1990)</span>
              </h4>
              {name ? (
                <span>
                  for {name.first} {name.middle} {name.last} {name.suffix}
                </span>
              ) : null}

              {response ? (
                <ul className="claim-list">
                  <li>
                    <strong>Date received</strong>
                    <br />
                    <span>
                      {moment(response.timestamp).format('MMM D, YYYY')}
                    </span>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        );
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
