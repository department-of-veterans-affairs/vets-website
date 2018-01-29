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
    // If someone refreshes this page after submitting a form and it loads
    // without an empty response object, we don't want to throw errors
    const response = form.submission.response
      ? form.submission.response.attributes
      : {};
    const { veteranFullName, verified } = form.data;
    const submittedAt = moment(form.submission.submittedAt);

    return (
      <div>
        <p>We’ve received your application. Thank you for applying for a Veteran ID Card.<br/>
        We process applications and print cards in the order we receive them.</p>

        <h2 className="schemaform-confirmation-section-header">What happens after I apply?</h2>
        {!verified && <div>
          <p>We’ll review your application to verify your eligibility. We may contact you if we have any questions or need more information.</p>
          <p>To be eligible for a Veteran ID Card, you must have separated under honorable conditions. If you have an other than honorable discharge, you can apply for an upgrade or correction.<br/>
            <a href="/discharge-upgrade-instructions" target="_blank">Find out how to apply for a discharge upgrade</a>.</p>
          <p>If you upload a copy of your discharge document, we can use it to verify that you were honorably discharged.</p>
        </div>}
        {verified && <div>
          <p>You should receive your Veteran ID Card in the mail in about 60 days.<br/>
          In the meantime, you can print a temporary digital Veteran ID Card.</p>
          <VeteranIDCard/>
          <button type="button" className="va-button-link" onClick={() => window.print()}>Print your temporary Veteran ID Card.</button>
        </div>}
        <p><em>Please print this page for your records</em></p>
        <div className="inset">
          <h3 className="schemaform-confirmation-claim-header">Veteran ID Card claim</h3>
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
          <p className="confirmation-guidance-message">If you have questions, call <a href="tel:+1-855-673-4357">1-855-673-4357</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET). For Telecommunication Relay Services, dial <a href="tel:711">711</a>.</p>
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
