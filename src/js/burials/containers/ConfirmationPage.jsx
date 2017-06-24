import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import { focusElement } from '../../common/utils/helpers';
import { benefitsLabels, documentLabels } from '../labels';

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
    // const form = this.props.form;
    const form = {
      data: {
        claimantFullName: {
          first: 'Sally',
          middle: 'Jane',
          last: 'Doe'
        },
        veteranFullName: {
          first: 'Josie',
          middle: 'Henrietta',
          last: 'Smith'
        },
        'view:claimedBenefits': {
          burialAllowance: true,
          plotAllowance: true,
          transportation: true
        },
        pages: {
          schema: {
            properties: {
              deathCertificate: {
                items: {
                  length: 1
                }
              },
              transportationReceipts: {
                items: {
                  length: 2
                }
              }
            }
          }
        }
      },
      submission: {
        submittedAt: Date.now()
      }
    };
//    const response = this.props.form.submission.response
//       ? this.props.form.submission.response.attributes
//       : {};
    const response = {
      confirmationNumber: 'V-EBC-177',
      regionalOffice: <div><p>Western Region</p><p>VA Regional Office</p><p>P.O. Box 8888</p><p>Muskogee, OK 74402-8888</p></div>
    };
    const { 'view:claimedBenefits': benefits,
            claimantFullName: claimantName,
            veteranFullName: veteranName } = form.data;

    const documents = form.data.pages.schema.properties;

    return (
      <div className="edu-benefits-submit-success">
        <h3 className="burial-page-title">Claim received</h3>
        <p>Normally processed within <strong>30 days</strong></p>
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
            <li>
              <strong>Documents Uploaded</strong><br/>
              {_.map(documents, (contents, documentName) => { // eslint-disable-line consistent-return
                const fileNumber = contents.items.length;
                const fileString = (fileNumber > 1) ? 'files' : 'file';
                if (fileNumber) {
                  return <p>{documentLabels[documentName]}: {fileNumber} {fileString}</p>;
                }
              })
              }
            </li>
            <li>
              <strong>Your claim was sent to</strong><br/>
              <address className="edu-benefits-pre">{response.regionalOffice}</address>
            </li>
          </ul>
        </div>
        <p>Find out what happens <a href="/burials-and-memorials/after-you-apply">after you apply</a>.</p>
        <p>Need help? If you have questions, call <a href="tel:888-442-4551">xxx-xxx-xxxx</a> from x:xx a.m. - x:xx p.m. ET Mon - Fri and have the Veteran’s Social security number or VA file number ready.</p>
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
