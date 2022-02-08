import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';

import { profileShowFaxNumber } from '@@profile/selectors';

import ProfileInfoTable from '../../ProfileInfoTable';

const PhoneNumbersTable = ({ className, shouldProfileShowFaxNumber }) => {
  const tableFields = [
    ...[
      {
        title: 'Home',
        id: FIELD_IDS[FIELD_NAMES.HOME_PHONE],
        value: (
          <ProfileInformationFieldController
            fieldName={FIELD_NAMES.HOME_PHONE}
          />
        ),
      },
      {
        title: 'Work',
        id: FIELD_IDS[FIELD_NAMES.WORK_PHONE],
        value: (
          <ProfileInformationFieldController
            fieldName={FIELD_NAMES.WORK_PHONE}
          />
        ),
      },
      {
        title: 'Mobile',
        id: FIELD_IDS[FIELD_NAMES.MOBILE_PHONE],
        value: (
          <ProfileInformationFieldController
            fieldName={FIELD_NAMES.MOBILE_PHONE}
          />
        ),
      },
    ],
    ...(shouldProfileShowFaxNumber
      ? [
          {
            title: 'Fax',
            id: FIELD_IDS[FIELD_NAMES.FAX_NUMBER],
            value: (
              <ProfileInformationFieldController
                fieldName={FIELD_NAMES.FAX_NUMBER}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <ProfileInfoTable
      title="Phone numbers"
      level={2}
      namedAnchor="phone-numbers"
      data={tableFields}
      className={className}
    />
  );
};

PhoneNumbersTable.propTypes = {
  className: PropTypes.string,
};

export const mapStateToProps = state => {
  return {
    shouldProfileShowFaxNumber: profileShowFaxNumber(state),
  };
};

export default connect(mapStateToProps)(PhoneNumbersTable);
