import React from 'react';
import PropTypes from 'prop-types';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import ProfileInfoTable from '../../ProfileInfoTable';
import { ProfileInfoCard } from '../../ProfileInfoCard';

import { Toggler } from '~/platform/utilities/feature-toggles';

const rows = [
  {
    title: 'Home',
    id: FIELD_IDS[FIELD_NAMES.HOME_PHONE],
    value: (
      <ProfileInformationFieldController fieldName={FIELD_NAMES.HOME_PHONE} />
    ),
  },
  {
    title: 'Work',
    id: FIELD_IDS[FIELD_NAMES.WORK_PHONE],
    value: (
      <ProfileInformationFieldController fieldName={FIELD_NAMES.WORK_PHONE} />
    ),
  },
  {
    title: 'Mobile',
    id: FIELD_IDS[FIELD_NAMES.MOBILE_PHONE],
    value: (
      <ProfileInformationFieldController fieldName={FIELD_NAMES.MOBILE_PHONE} />
    ),
  },
];

const PhoneNumbersTable = ({ className }) => {
  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.profileUseInfoCard}>
      <Toggler.Enabled>
        <ProfileInfoCard
          title="Phone numbers"
          level={2}
          namedAnchor="phone-numbers"
          data={rows}
          className={className}
        />
      </Toggler.Enabled>
      <Toggler.Disabled>
        <ProfileInfoTable
          title="Phone numbers"
          level={2}
          namedAnchor="phone-numbers"
          data={rows}
          className={className}
        />
      </Toggler.Disabled>
    </Toggler>
  );
};

PhoneNumbersTable.propTypes = {
  className: PropTypes.string,
};

export default PhoneNumbersTable;
