import React from 'react';
import { connect } from 'react-redux';

import {
  FIELD_NAMES,
  FIELD_TITLES,
  TRANSACTION_CATEGORY_TYPES,
} from '@@vap-svc/constants';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
import VAPServicePendingTransactionCategory from '@@vap-svc/containers/VAPServicePendingTransactionCategory';
import AddressField from '@@vap-svc/components/AddressField/AddressField';
import { focusElement } from '~/platform/utilities/ui';
import { selectVAPContactInfo } from '~/platform/user/selectors';

import { isAddressEmpty } from '../utils/helpers';
import noAddressBanner from '../components/NoAddressBanner';

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
          <InitializeVAPServiceID>
            <VAPServicePendingTransactionCategory
              categoryType={TRANSACTION_CATEGORY_TYPES.VAP_ADDRESS}
            >
              <AddressField
                fieldName={FIELD_NAMES.MAILING_ADDRESS}
                title={FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS]}
              />
            </VAPServicePendingTransactionCategory>
          </InitializeVAPServiceID>
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
    savedAddress: selectVAPContactInfo(state)?.mailingAddress,
  };
}

export default connect(mapStateToProps)(AddressSection);
