import React from 'react';
import LoadingSection from './LoadingSection';

class Hero extends React.Component {
  renderName = () => {
    const {
      hero: {
        userFullName: {
          first,
          middle,
          last
        }
      }
    } = this.props;
    const fullName = [first, middle, last].join(' ');
    const ariaLabel = `Profile: ${fullName}`;
    return <h1 aria-label={ariaLabel} className="page-header">{fullName}</h1>;
  }
  renderService = () => {
    const {
      militaryInformation: {
        serviceHistory: {
          serviceHistory
        } = {}
      }
    } = this.props;
    const service = serviceHistory && serviceHistory[0];
    return service && <div className="service-branch">United States {service.branchOfService}</div>;
  }
  render() {
    return (
      <div className="va-profile-hero">
        <div className="row-padded">
          <LoadingSection
            isLoading={!this.props.hero}
            message="Loading full name..."
            render={this.renderName}/>
          <LoadingSection
            isLoading={!this.props.militaryInformation}
            message="Loading service information..."
            render={this.renderService}/>
          <p className="va-introtext">Review your contact, personal, and military service information—and find out how to make any needed updates or corrections.</p>
        </div>
      </div>
    );
  }
}

export default Hero;
