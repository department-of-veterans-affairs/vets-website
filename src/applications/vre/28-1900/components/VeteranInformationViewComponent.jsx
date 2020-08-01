import React, { useEffect } from 'react';
import merge from 'lodash/merge';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone, {
  CONTACTS,
} from '@department-of-veterans-affairs/formation-react/Telephone';
import moment from 'moment';

const NAME_PATH = 'veteranInformation.fullName';
const DOB_PATH = 'veteranInformation.dob';

export const VeteranInformationViewComponent = props => {
  const { profile, formData, setData } = props;
  const {
    gender,
    dob,
    userFullName: { first, last },
  } = profile;
  let dateOfBirthFormatted = '-';
  let genderFull = '-';
  if (dob) {
    dateOfBirthFormatted = moment(dob).format('MMMM Do YYYY');
  }
  if (gender === 'M') {
    genderFull = 'Male';
  } else if (gender === 'F') {
    genderFull = 'Female';
  }

  // Update the formData with values pulled from profile
  const veteranFormData = {
    veteranInformation: {
      fullName: profile?.userFullName,
      dob: profile?.dob,
    },
    veteranAddress: {},
  };
  const updatedFormData = { ...formData, ...veteranFormData };
  useEffect(
    () => {
      setData(updatedFormData);
    },
    [profile],
  );
  const alertContent = (
    <dl className="vads-u-margin--0 vads-u-padding-left--2">
      <dt className="vads-u-line-height--4 vads-u-padding-bottom--2">
        <strong>
          {first} {last}
        </strong>
      </dt>
      <dd className="vads-u-line-height--4 vads-u-padding-bottom--2">
        Date of birth: {dateOfBirthFormatted}
      </dd>
      <dd className="vads-u-line-height--4">Gender: {genderFull}</dd>
    </dl>
  );
  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <AlertBox
        className="vads-u-padding--0 vads-u-background-color--white vads-u-border-color--primary vads-u-border-left--5px"
        content={alertContent}
        status="info"
        isVisible
      />
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        please call Veterans Benefits Assistance at{' '}
        <Telephone contact={CONTACTS.VA_BENEFITS} /> between 8:00 a.m. and 9:00
        p.m. ET Monday through Friday.
      </p>
    </div>
  );
};
