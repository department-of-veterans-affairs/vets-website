import React from 'react';

import { focusElement } from '../../../platform/utilities/ui';

import { isAddressEmpty } from '../utils/helpers';
import noAddressBanner from '../components/NoAddressBanner';

import MailingAddress from 'vet360/components/MailingAddress';

export class AddressSection extends React.Component {
  componentDidMount() {
    focusElement('#content');
  }

  navigateToLetterList = () => {
    this.props.router.push('/letter-list');
  };

  render() {
    const address = {};
    const emptyAddress = isAddressEmpty(address);
    const { location } = this.props;

    let addressContent = (
      <div className="step-content">
        <p>Downloaded documents will list your address as:</p>
        <div className="address-block">
          <MailingAddress />
        </div>
        <p>
          When you download a letter, it will show this address. If this address is
          incorrect you may want to update it, but your letter will still be valid
          even with the incorrect address.
        </p>
      </div>
    );

    let viewLettersButton;
    if (location.pathname === '/confirm-address') {
      viewLettersButton = (
        <div className="step-content">
          <button
            onClick={this.navigateToLetterList}
            className="usa-button-primary view-letters-button"
            disabled={emptyAddress}
          >
            View Letters
          </button>
        </div>
      );
    }

    return (
      <div>
        <div>
          <div aria-live="polite" aria-relevant="additions">
            {emptyAddress && noAddressBanner}
            {addressContent}
          </div>
        </div>
        {viewLettersButton}
      </div>
    );
  }
}

export default AddressSection;
