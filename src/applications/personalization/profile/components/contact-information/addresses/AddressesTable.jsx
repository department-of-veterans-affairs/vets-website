import React from 'react';
import PropTypes from 'prop-types';

import {
  FIELD_IDS,
  FIELD_NAMES,
  FIELD_TITLE_DESCRIPTIONS,
  FIELD_TITLES,
} from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { formatAddressTitle } from '@@profile/util/contact-information/addressUtils';

import CopyAddressModalController from './CopyAddressModalController';

import ProfileInfoTable from '../../ProfileInfoTable';
import BadAddressAlert from '../../alerts/bad-address/FormAlert';

const AddressesTable = ({ className, showBadAddress }) => (
  <>
    <CopyAddressModalController />
    <ProfileInfoTable
      title="Addresses"
      level={2}
      namedAnchor="addresses"
      data={[
        {
          title: formatAddressTitle(FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS]),
          description: FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.MAILING_ADDRESS],
          id: FIELD_IDS[FIELD_NAMES.MAILING_ADDRESS],
          value: (
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.MAILING_ADDRESS}
              ariaDescribedBy={`described-by-${FIELD_NAMES.MAILING_ADDRESS}`}
            />
          ),
          alertMessage: showBadAddress ? <BadAddressAlert /> : null,
        },
        {
          title: formatAddressTitle(
            FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS],
          ),
          description:
            FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.RESIDENTIAL_ADDRESS],
          id: FIELD_IDS[FIELD_NAMES.RESIDENTIAL_ADDRESS],
          value: (
            <ProfileInformationFieldController
              fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
            />
          ),
        },
      ]}
      className={className}
      list
    />
  </>
);

AddressesTable.propTypes = {
  className: PropTypes.string,
  showBadAddress: PropTypes.bool,
};

export default AddressesTable;
