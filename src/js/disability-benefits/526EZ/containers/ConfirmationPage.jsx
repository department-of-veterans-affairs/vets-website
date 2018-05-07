import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../../../platform/utilities/ui';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true
  });
};

class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: false };
  }

  componentDidMount() {
    focusElement('.confirmation-page-title');
    scrollToTop();
  }

  render() {
    const formData = this.props.form.data;
    // const response = this.props.form.submission.response
    // ? this.props.form.submission.response.attributes
    // : {};
    const { fullName, selectedDisabilities } = formData;
    // TODO: update content

    return (
      <div>
        <h3 className="confirmation-page-title">Your claim has been submitted</h3>
        <p>We usually process claims within <strong>99 days</strong>.</p>
        <p>We may contact you if we have questions or need more information. You can print this page for your records.</p>
        
        <p>**If you need us to get your private medical records from your doctor,** you’ll need to fill out an Authorization to Disclose Information to the VA (VA Form 21-4142). If you didn’t upload this form to your application, you can download it here and mail it in.
          [Download VA Form 21-4142](https://www.vba.va.gov/pubs/forms/VBA-21-4142-ARE.pdf).</p><br/>

      Please print the form, fill it out, and send it to:<br>
        
       <dl class="va-address-block">
         <dd>Department of Veterans Affairs</dd>
         <dd>Claims Intake Center</dd>
         <dd>PO Box 4444</dd>
         <dd>Janesville, WI 53547-4444</dd>
       </dl>

        <h4 className="confirmation-guidance-heading">
          What happens after I apply?
        </h4>
        <p className="confirmation-guidance-message">
          You don’t need to do anything unless we send you a letter asking for
          more information. You can check the status of your claim online. The
          time frame you see may vary based on how complex your claim is.
        </p>
        <a href="/disability-benefits/track-claims">
          Check the status of your disability claim
        </a>
        <br/>
        <a href="/disability-benefits/after-you-apply/">
          Learn more about what happens after you file a disability claim.
        </a>
        <div className="inset">
          <h4>Disability Compensation Claim for Increase <span className="additional">(Form 21-526EZ)</span></h4>
          <span>
            For {fullName.first} {fullName.middle} {fullName.last} {fullName.suffix}
          </span>

          <ul className="claim-list">
            <strong>Conditions claimed</strong>
            <br/>
            <ul className="disability-list">
              {selectedDisabilities.map((disability, i) => {
                return <li key={i}>{disability.name}</li>;
              })}
            </ul>
            <li>
              <strong>Confirmation number</strong>
              <br/>
              <span>V-DCCI-3986</span>
              {/* <span>{response.confirmationNumber}</span> */}
            </li>
            <li>
              <strong>Date submitted</strong>
              <br/>
              <span>{moment(Date.now()).format('MMM D, YYYY')}</span>
              {/* <span>{moment(form.submission.submittedAt).format('MMM D, YYYY')}</span> */}
            </li>
          </ul>
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">If you have questions, please call <a href="tel:+18772228387">1-877-222-8387</a>, Monday &#8211;
            Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
          </p>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">
                Go Back to Vets.gov
              </button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    form: state.form
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
export { ConfirmationPage };
