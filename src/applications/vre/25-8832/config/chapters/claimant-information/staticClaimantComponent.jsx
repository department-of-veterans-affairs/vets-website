import React from 'react';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { generateGender } from '../../helpers';

export default function ClaimantInformationComponent() {
  const {
    gender,
    dob,
    userFullName: { first, last },
  } = useSelector(state => state.user.profile);
  const dateOfBirthFormatted = !dob
    ? '-'
    : format(new Date(dob), 'MMMM d, yyyy');
  const fullGender = generateGender(gender);

  return (
    <div>
      <p>This is the personal information we have on file for you.</p>
      <va-alert status="info" uswds={true}>
        <dl className="vads-u-margin--0">
          <dt className="vads-u-line-height--4 vads-u-padding-bottom--2 vads-u-font-size--base">
            <strong>
              {first} {last}
            </strong>
          </dt>
          <dd className="vads-u-line-height--4 vads-u-padding-bottom--2 vads-u-font-size--base">
            Date of birth: {dateOfBirthFormatted}
          </dd>
          <dd className="vads-u-line-height--4">Gender: {fullGender}</dd>
        </dl>
      </va-alert>
      <p>
        <strong>Note:</strong> If you need to update your personal information,
        Call Veterans Benefits Assistance at{' '}
        <va-telephone contact={CONTACTS.VA_BENEFITS} uswds={true} /> Monday through Friday,{' '}
        between 8:00 a.m. and 9:00 p.m. ET.
      </p>
    </div>
  );
}
