import React from 'react';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';
import moment from '../../../../platform/startup/moment-setup';
import LoadFail from './LoadFail';
import LoadingSection from './LoadingSection';
import { handleDowntimeForSection } from './DowntimeBanner';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

class MilitaryInformationContent extends React.Component {
  componentDidMount() {
    this.props.fetchMilitaryInformation();
  }
  renderContent = () => {
    const {
      serviceHistory: {
        serviceHistory,
        error
      }
    } = this.props.militaryInformation;

    if (error || serviceHistory.length === 0) return <LoadFail information="military"/>;

    return (
      <div className="va-profile-servicehistory">
        {serviceHistory.map((service, index) => {
          return (
            <div key={index}>
              <h3>{service.branchOfService}</h3>
              <div>{moment(service.beginDate).format('MMM D, YYYY')} &ndash; {moment(service.endDate).format('MMM D, YYYY')}</div>
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    return (
      <div>
        <AdditionalInfo triggerText="How do I update my military service information?">
          <p>You'll need to file a request to change or correct your DD214 or other military records.<br/>
            <a href="https://iris.custhelp.va.gov/app/answers/detail/a_id/478/~/amend-or-change-dd-214-or-other-military-records">Find out how to request a change to your military records</a>
          </p>
        </AdditionalInfo>
        <LoadingSection
          isLoading={!this.props.militaryInformation}
          message="Loading military information..."
          render={this.renderContent}/>
      </div>
    );
  }
}

export default function MilitaryInformation(props) {
  return (
    <div>
      <h2 className="va-profile-heading">Military Service</h2>
      <DowntimeNotification render={handleDowntimeForSection('military service')} dependencies={[services.emis]}>
        <MilitaryInformationContent {...props}/>
      </DowntimeNotification>
    </div>
  );
}
