import React from 'react';
import PropTypes from 'prop-types';

import {
  FIELD_IDS,
  FIELD_NAMES,
  FIELD_TITLE_DESCRIPTIONS,
  FIELD_TITLES,
} from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { formatAddressTitle } from '@@vap-svc/util/contact-information/addressUtils';

import { NavLink } from 'react-router-dom';
import CopyAddressModalController from './CopyAddressModalController';
import { ProfileInfoCard } from '../../ProfileInfoCard';
import BadAddressAlert from '../../alerts/bad-address/FormAlert';

const generateRows = (showBadAddress, toggleValue) => [
  {
    title: formatAddressTitle(FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS]),
    description: FIELD_TITLE_DESCRIPTIONS[FIELD_NAMES.MAILING_ADDRESS],
    id: FIELD_IDS[FIELD_NAMES.MAILING_ADDRESS],
    value: (
      <>
        <ProfileInformationFieldController
          fieldName={FIELD_NAMES.MAILING_ADDRESS}
          ariaDescribedBy={`described-by-${FIELD_NAMES.MAILING_ADDRESS}`}
        />
        {toggleValue && (
          <NavLink
            activeClassName="is-active"
            exact
            to="/profile/direct-deposit"
          >
            Go to direct deposit to manage your Montgomery Gl Bill benefit
            payment address.
          </NavLink>
        )}
      </>
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

const AddressesTable = ({ className, showBadAddress }) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(
    TOGGLE_NAMES.toggleVyeAddressDirectDepositFormsInProfile,
  );
  return (
    <>
      <CopyAddressModalController />

      <ProfileInfoCard
        title="Addresses"
        level={2}
        namedAnchor="addresses"
        data={generateRows(showBadAddress, toggleValue)}
        className={className}
      />
    </>
  );
};

AddressesTable.propTypes = {
  className: PropTypes.string,
  showBadAddress: PropTypes.bool,
};

export default AddressesTable;
