import React from 'react';
import { connect } from 'react-redux';
import { DateWidget } from 'us-forms-system/lib/js/review/widgets';
import { genderLabels } from '../../../../platform/static-data/labels';
import { srSubstitute } from '../utils';
import { EditNote } from '../components/EditNote';

export class ApplicantInformation extends React.Component {
  render() {
    const { formData } = this.props;
    const {
      applicantSocialSecurityNumber,
      dateOfBirth,
      applicantGender,
    } = formData;
    const { first, middle, last, suffix } = formData.applicantFullName;
    const mask = srSubstitute('●●●–●●–', 'ending with');

    return (
      <div>
        <p>This is your personal information we have on file.</p>
        <div className="blue-bar-block">
          <strong>
            {first} {middle} {last} {suffix}
          </strong>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(ApplicantInformation);
