import React from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import moment from 'moment';

import { focusElement } from '../../common/utils/helpers';

import VeteranIDCard from '../components/VeteranIDCard';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
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

  toggleExpanded = (e) => {
    e.preventDefault();
    this.setState({ isExpanded: !this.state.isExpanded });
  }

  render() {
    const form = this.props.form;
    const response = form.submission.response
      ? form.submission.response.attributes
      : {};
    const { veteranFullName, verified } = form.data;
    const submittedAt = moment(form.submission.submittedAt);

    return (
      <div>
        <p>You have completed your application.<br/>
        We process applications and print cards in the order we receive them.</p>

        <h4>What happens after I apply?</h4>
        {!verified && <div>
          <p>We’ll review your application to verify your eligibility. We may contact you if we have any questions or need more information.</p>
          <p>You must have separated under honorable conditions to be eligible for a Veteran ID Card. If you have an other than honorable discharge, you can apply for an upgrade or correction. If your application goes through and your discharge is upgraded, you’ll be eligible for the Veteran ID Card. <a href="/discharge-upgrade-instructions" target="_blank">Find out how to apply for a discharge upgrade</a>.</p>
          <p>If you uploaded a copy of your DD214, we can use it to review your application and verify that you were honorably discharged.</p>
        </div>}
        {verified && <div>
          <p>You should receive your Veteran ID Card in the mail in about 60 days.<br/>
          In the meantime, you can print and download a temporary digital Veteran ID Card.</p>
          <VeteranIDCard/>
          <button type="button" className="va-button-link" onClick={() => window.print()}>Print your temporary Veteran ID Card.</button>
        </div>}
        <p><em>Please print this page for your records</em></p>
        <div className="inset">
          <h4>Veteran ID Card claim</h4>
          <span>for {veteranFullName.first} {veteranFullName.middle} {veteranFullName.last} {veteranFullName.suffix}</span>
          <ul className="claim-list">
            <li>
              <strong>Confirmation number</strong><br/>
              <span>{response.confirmationNumber}</span>
            </li>
            <li>
              <strong>Date received</strong><br/>
              <span>{submittedAt.format('MMM D, YYYY')}</span>
            </li>
          </ul>
        </div>
        <div className="confirmation-guidance-container">
          <h4 className="confirmation-guidance-heading">Need help?</h4>
          <p className="confirmation-guidance-message">If you have questions, call <a href="tel:+1-800-827-1000">1-800-827-1000</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 9:00 p.m. (ET). Please have your Social Security number or VA file number ready. For Telecommunication Relay Services, dial <a href="tel:711">711</a>.</p>
        </div>
        <div className="row form-progress-buttons schemaform-back-buttons">
          <div className="small-6 usa-width-one-half medium-6 columns">
            <a href="/">
              <button className="usa-button-primary">Go Back to Vets.gov</button>
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
