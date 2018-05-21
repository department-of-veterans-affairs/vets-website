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
          serviceHistory,
          error: serviceHistoryError
        } = {}
      }
    } = this.props;
    if (!serviceHistoryError && serviceHistory && serviceHistory.length > 0) {
      return <div className="service-branch">United States {serviceHistory[0].branchOfService}</div>;
    }
    return null;
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
