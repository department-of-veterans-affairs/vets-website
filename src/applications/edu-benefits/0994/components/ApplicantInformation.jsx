import React from 'react';
import { DateWidget } from 'platform/forms-system/src/js/review/widgets';
import { genderLabels } from '../../../../platform/static-data/labels';
import { srSubstitute } from '../utils';

export class ApplicantInformation extends React.Component {
  displayName = applicantName => {
    const { first, middle, last } = applicantName;
    return (
      <strong>
        {first} {middle} {last}
      </strong>
    );
  };

  render() {
    const {
      applicantSocialSecurityNumber,
      dateOfBirth,
      applicantGender,
      applicantFullName,
    } = this.props.formData;
    const mask = srSubstitute('●●●–●●–', 'ending with');

    return (
      <div>
        <p>This is the personal information we have on file for you.</p>
        <div className="blue-bar-block">
          {applicantFullName && this.displayName(applicantFullName)}
          {dateOfBirth && (
            <p>
              Date of birth:{' '}
              <DateWidget value={dateOfBirth} options={{ monthYear: false }} />
            </p>
          )}
          {applicantSocialSecurityNumber && (
            <p>
              Social Security number: {mask}
              {applicantSocialSecurityNumber.slice(5)}
            </p>
          )}
          {applicantGender && <p>Gender: {genderLabels[applicantGender]}</p>}
        </div>
        <p>
          <strong>Note:</strong> If you need to update this information, please
          call Veterans Benefits Assistance at{' '}
          <a href="tel:1-800-827-1000">1-800-827-1000</a>, Monday through
          Friday, 8:00 a.m. to 9:00 p.m. (ET) or{' '}
          <a href="/profile">go to your Profile page</a>.
        </p>
      </div>
    );
  }
}
