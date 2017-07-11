import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../common/utils/helpers';
import { benefitsLabels } from '../labels';

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
    focusElement('.burial-page-title');
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
    const { 'view:claimedBenefits': benefits,
            claimantFullName: claimantName,
            veteranFullName: veteranName } = form.data;
    const hasDocuments = form.data.deathCertificate || form.data.transportationReceipts;
    const { deathCertificate, transportationReceipts } = form.data;

    return (
      <div className="edu-benefits-submit-success">
        <h3 className="burial-page-title">Claim received</h3>
        <p>
          We may contact you for more information or documents.<br/>
          <i>Please print this page for your records.</i>
        </p>
        <div className="inset">
          <h4>Burial Benefit Claim <span className="additional">(Form 21P-530)</span></h4>
          <span>for {claimantName.first} {claimantName.middle} {claimantName.last} {claimantName.suffix}</span>

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
              <strong>Deceased Veteran</strong><br/>
              <span>{veteranName.first} {veteranName.middle} {veteranName.last} {veteranName.suffix}</span>
            </li>
            <li>
              <strong>Benefits claimed</strong><br/>
              {_.map(benefits, (isRequested, benefitName) => isRequested && <p>{benefitsLabels[benefitName]}</p>)}
            </li>
            {hasDocuments && <li>
              <strong>Documents uploaded</strong><br/>
              {deathCertificate && <p>Death certificate: 1 file</p>}
              {transportationReceipts && <p>Transportation documentation: {transportationReceipts.length} {transportationReceipts.length > 1 ? 'files' : 'file'}</p>}
            </li>}
            <li>
              <strong>Your claim was sent to</strong><br/>
              <address className="schemaform-address-view">{_.map(response.regionalOffice, (line, index) => <p key={index}>{line}</p>)}</address>
            </li>
          </ul>
        </div>
        <p>Need help? If you have questions, call <a href="tel:+1-800-827-1000">800-827-1000</a> from 8:00 a.m. - 9:00 p.m. EST Mon - Fri and have the Veteran’s Social security number or VA file number ready. For telecommunication relay services, dial <a href="tel:711">711</a>.</p>
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
