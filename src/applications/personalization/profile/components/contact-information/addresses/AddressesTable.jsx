import React from 'react';
import PropTypes from 'prop-types';

import {
  FIELD_IDS,
  FIELD_NAMES,
  FIELD_TITLE_DESCRIPTIONS,
  FIELD_TITLES,
} from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { formatAddressTitle } from '@@vap-svc/util/contact-information/addressUtils';

import CopyAddressModalController from './CopyAddressModalController';

import { ProfileInfoCard } from '../../ProfileInfoCard';
import BadAddressAlert from '../../alerts/bad-address/FormAlert';

const generateRows = showBadAddress => [
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
    title: formatAddressTitle(FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS]),
    description: FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.RESIDENTIAL_ADDRESS],
    id: FIELD_IDS[FIELD_NAMES.RESIDENTIAL_ADDRESS],
    value: (
      <ProfileInformationFieldController
        fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
      />
    ),
  },
];

const AddressesTable = ({ className, showBadAddress }) => (
  <>
    <CopyAddressModalController />

    <ProfileInfoCard
      title="Addresses"
      level={2}
      namedAnchor="addresses"
      data={generateRows(showBadAddress)}
      className={className}
    />
  </>
);

AddressesTable.propTypes = {
  className: PropTypes.string,
  showBadAddress: PropTypes.bool,
};

export default AddressesTable;
