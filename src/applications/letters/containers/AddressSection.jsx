import React from 'react';
import { connect } from 'react-redux';

import { focusElement } from '../../../platform/utilities/ui';

import { isAddressEmpty } from '../utils/helpers';
import noAddressBanner from '../components/NoAddressBanner';

import { TRANSACTION_CATEGORY_TYPES } from 'vet360/constants';

import Vet360InitializeID from 'vet360/containers/InitializeVet360ID';
import Vet360PendingTransactionCategory from 'vet360/containers/Vet360PendingTransactionCategory';
import MailingAddress from 'vet360/components/MailingAddress';

export class AddressSection extends React.Component {
  componentDidMount() {
    focusElement('#content');
  }

  navigateToLetterList = () => {
    this.props.router.push('/letter-list');
  };

  render() {
    const address = this.props.savedAddress;
    const emptyAddress = isAddressEmpty(address);
    const { location } = this.props;

    const addressContent = (
      <div className="step-content">
        <p>Downloaded documents will list your address as:</p>
        <div className="va-profile-wrapper">
          <Vet360InitializeID>
            <Vet360PendingTransactionCategory
              categoryType={TRANSACTION_CATEGORY_TYPES.ADDRESS}
            >
              <MailingAddress />
            </Vet360PendingTransactionCategory>
          </Vet360InitializeID>
        </div>
        <p>
          When you download a letter, it will show this address. If this address
          is incorrect you may want to update it, but your letter will still be
          valid even with the incorrect address.
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
            {emptyAddress ? noAddressBanner : addressContent}
          </div>
        </div>
        {viewLettersButton}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    savedAddress: state.user.profile.vet360.mailingAddress,
  };
}

export default connect(mapStateToProps)(AddressSection);
