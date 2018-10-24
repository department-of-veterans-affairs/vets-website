/* eslint-disable no-use-before-declare */
/* eslint-disable react/jsx-indent */
/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
/* eslint-disable react/jsx-closing-bracket-location */

import React from 'react';
import { connect } from 'react-redux';

import Modal from '@department-of-veterans-affairs/formation/Modal';

import recordEvent from '../../../../platform/monitoring/record-event';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

import '../sass/connected-acct.scss';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

class ConnectedAcctApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  render() {
    return (
      // Below are the styles for when they End User DOES NOT have connected accounts.
      //
      // <div className="row va-connected-acct-null">
      //   <div className="usa-width-two-thirds medium-8 small-12 columns">
      //     <h3>You do not have any connected accounts.</h3>
      //       <div className="feature">
      //       <h3>Have questions about signing in to {propertyName}?</h3>
      //        <p>
      //         Get answers to frequently asked questions about how to sign in,
      //         common issues with verifying your identity, and your privacy and
      //         security on {propertyName}.
      //       </p>
      //
      //       <a
      //         href="/faq"
      //         onClick={() =>
      //           recordEvent({
      //             event: 'account-navigation',
      //             'account-action': 'view-link',
      //             'account-section': 'vets-faqs',
      //           })
      //         }
      //       >
      //         Go to {propertyName} FAQs
      //       </a>
      //     </div>
      //   </div>
      // </div>
      // Below are the styles for when they End User DOES have connected accounts.
      <div className="row va-connected-acct">
        <div className="usa-width-two-thirds medium-8 small-12 columns">
          <h1>Your Connected Accounts</h1>
          <p className="va-introtext">
            You gave these sites and applications read only access to some of
            your {propertyName} account data.
          </p>

          <table className="va-table-connected-acct usa-table-borderless">
            <tbody>
             <tr>
               <th scope="row">
                 <a href="https://usajobs.gov">
                 <img
                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/USAJOBS.gov_logo.svg/2000px-USAJOBS.gov_logo.svg.png"
                   alt="VA logo"
                   width="100"
                   />
                </a>
               </th>
               <th>
                 <a href="https://usajobs.gov">USAJOBS Profile</a> <br />
                 Last used within the past 2 days
               </th>
               <th>
                 <button
                   className="usa-button-primary"
                   onClick={this.openModal}
                   >
                   Disconnect
                </button>
               </th>
             </tr>
            </tbody>
          </table>

          <div className="feature">
            <h3>Have questions about signing in to {propertyName}?</h3>
            <p>
              Get answers to frequently asked questions about how to sign in,
              common issues with verifying your identity, and your privacy and
              security on {propertyName}.
            </p>

            <a
              href="/faq"
              onClick={() =>
                recordEvent({
                  event: 'account-navigation',
                  'account-action': 'view-link',
                  'account-section': 'vets-faqs',
                })
              }
            >
              Go to {propertyName} FAQs
            </a>
          </div>
        </div>
        <Modal
          clickToClose
          cssClass="va-modal"
          id="disconnect-alert"
          onClose={this.closeModal}
          title="Are you sure you want to disconnect from USAJOBS?"
          visible={this.state.modalOpen}
        >
          <p>
            USAJOBS will no longer be able to access your {propertyName} account
            informaton. You cannot undo this action.
          </p>
            <a
              href="#"
              className="usa-button-primary"
            >
              Confirm
            </a>
            <button className="usa-button-secondary" onClick={this.closeModal}>
              Cancel
            </button>
        </Modal>
      </div>
    );
  }
}

export default connect()(ConnectedAcctApp);
export { ConnectedAcctApp };
