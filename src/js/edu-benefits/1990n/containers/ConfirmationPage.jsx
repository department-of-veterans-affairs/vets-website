import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../../common/utils/helpers';

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
    const response = this.props.form.submission.response
      ? this.props.form.submission.response.attributes
      : {};
    const name = form.data.veteranFullName;

    const docExplanation = this.state.isExpanded
      ? (<div className="usa-accordion-content">
        <p>In the future, you might need a copy of your DD 2863 (National Call to Service (NCS) Election of Options).</p>
        <p>Documents can be uploaded using the <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">GI Bill site</a>.</p>
      </div>)
      : null;

    return (
      <div>
        <h3 className="confirmation-page-title">Claim received</h3>
        <p>Normally processed within <strong>30 days</strong></p>
        <p>
          We may contact you for more information or documents.<br/>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>Education Benefit Claim <span className="additional">(Form 22-1990N)</span></h4>
          <span>for {name.first} {name.middle} {name.last} {name.suffix}</span>

          <ul className="claim-list">
            <li>
              <strong>Confirmation number</strong><br/>
              <span>{response.confirmationNumber}</span>
            </li>
            <li>
              <strong>Date received</strong><br/>
              <span>{moment(form.submission.submittedAt).format('MMM D, YYYY')}</span>
            </li>
            <li>
              <strong>Your claim was sent to</strong><br/>
              <address className="schemaform-address-view">{response.regionalOffice}</address>
            </li>
          </ul>
        </div>
        <div id="collapsiblePanel" className="usa-accordion-bordered">
          <ul className="usa-unstyled-list">
            <li>
              <div className="accordion-header clearfix">
                <button
                  className="usa-button-unstyled"
                  aria-expanded={this.state.isExpanded ? 'true' : 'false'}
                  aria-controls="collapsible-document-explanation"
                  onClick={this.toggleExpanded}>
                  No documents required at this time
                </button>
              </div>
              <div id="collapsible-document-explanation">
                {docExplanation}
              </div>
            </li>
          </ul>
        </div>
        <p>Find out what happens <a href="/education/after-you-apply">after you apply</a>.</p>
        <p>Need help? If you have questions, call <a href="tel:888-442-4551">888-442-4551</a> (888-GI-BILL-1) from 8:00 a.m. - 7:00 p.m. ET Mon - Fri.</p>
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
