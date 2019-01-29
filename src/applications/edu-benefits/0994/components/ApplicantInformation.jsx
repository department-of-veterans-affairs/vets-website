import React from 'react';
import { DateWidget } from 'us-forms-system/lib/js/review/widgets';
import { genderLabels } from '../../../../platform/static-data/labels';
import { srSubstitute } from '../utils';
import { EditNote } from './EditNote';

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
        <p>This is your personal information we have on file.</p>
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
        {EditNote('personal information')}
        <p>
          <a href="/profile">Go to my profile page</a>.
        </p>
      </div>
    );
  }
}
