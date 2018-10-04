import React from 'react';
import DowntimeNotification, {
  externalServices,
} from '../../../../platform/monitoring/DowntimeNotification';
import moment from 'moment';
import LoadFail from './LoadFail';
import LoadingSection from './LoadingSection';
import { handleDowntimeForSection } from './DowntimeBanner';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

import recordEvent from '../../../../platform/monitoring/record-event';

function Gender({ gender }) {
  let content = 'This information is not available right now.';
  if (gender === 'M') content = 'Male';
  else if (gender === 'F') content = 'Female';
  return (
    <div data-field-name="gender">
      <h3>Gender</h3>
      <div>{content}</div>
    </div>
  );
}

function BirthDate({ birthDate }) {
  return (
    <div data-field-name="birthDate">
      <h3>Birth date</h3>
      <div>{moment(birthDate).format('MMM D, YYYY')}</div>
    </div>
  );
}

class PersonalInformationContent extends React.Component {
  componentDidMount() {
    this.props.fetchPersonalInformation();
  }
  renderContent = () => {
    const { gender, birthDate, error } = this.props.personalInformation;

    if (error) return <LoadFail information="personal" />;

    return (
      <div>
        <Gender gender={gender} />
        <BirthDate birthDate={birthDate} />
      </div>
    );
  };
  render() {
    return (
      <div>
        <AdditionalInfo
          triggerText="How do I update my personal information?"
          onClick={() => {
            recordEvent({
              event: 'profile-navigation',
              'profile-action': 'view-link',
              'profile-section': 'update-personal-information',
            });
          }}
        >
          <p>
            <strong>If you're enrolled in the VA health care program</strong>
            <br />
            Please contact your nearest VA medical center to update your
            personal information.
            <br />
            <a href="/facilities/?facilityType=health">
              Find your nearest VA medical center
            </a>
          </p>
          <p>
            <strong>
              If you receive VA benefits, but aren't enrolled in VA health care
            </strong>
            <br />
            Please contact your nearest VA regional benefit office to update
            your personal information.
            <br />
            <a href="/facilities/?facilityType=benefits">
              Find your nearest VA regional benefit office
            </a>
          </p>
        </AdditionalInfo>
        <LoadingSection
          isLoading={!this.props.personalInformation}
          message="Loading personal information..."
          render={this.renderContent}
        />
      </div>
    );
  }
}

export default function PersonalInformation(props) {
  return (
    <div>
      <h2 className="va-profile-heading">Personal Information</h2>
      <DowntimeNotification
        render={handleDowntimeForSection('personal')}
        dependencies={[externalServices.mvi]}
      >
        <PersonalInformationContent {...props} />
      </DowntimeNotification>
    </div>
  );
}
