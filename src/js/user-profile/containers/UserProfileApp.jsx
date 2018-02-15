import React from 'react';
import { connect } from 'react-redux';
import { getVerifyUrl } from '../../common/helpers/login-helpers.js';
import { updateVerifyUrl } from '../../login/actions';
import { removeSavedForm } from '../actions';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';

const accordionIds = {
  veteranInformation: 'veteranInformation',
  militaryService: 'militaryService'
};

class UserProfileApp extends React.Component {
  constructor() {
    super();
    this.state = {
      activeAccordionId: accordionIds.veteranInformation
    };
  }

  componentDidMount() {
    if (!this.props.verifyUrl) {
      getVerifyUrl(this.props.updateVerifyUrl);
    }
  }

  getAccordionToggle(accordionId) {
    return () => {
      const activeAccordionId = this.state.activeAccordionId === accordionId ? '' : accordionId;
      this.setState({ activeAccordionId });
    };
  }

  accordionButton(buttonText, accordionId) {
    return (
      <div className="accordion-header">
        <button className="usa-accordion-button usa-button-unstyled"
          onClick={this.getAccordionToggle(accordionId)}
          aria-expanded={this.state.activeAccordionId === accordionId}
          aria-controls={accordionId}>
          {buttonText}
        </button>
      </div>
    );
  }

  accordionSection(accordionId, title, content) {
    return (
      <li>
        <div className="accordion-header">
          <button className="usa-accordion-button usa-button-unstyled"
            onClick={this.getAccordionToggle(accordionId)}
            aria-expanded={this.state.activeAccordionId === accordionId}
            aria-controls={accordionId}>
            {title}
          </button>
        </div>
        <div className="usa-accordion-content"
          id={accordionId}
          aria-hidden={this.state.activeAccordionId !== accordionId}>
          {content}
        </div>
      </li>
    );
  }

  renderAccordion() {
    return (
      <ul className="usa-accordion usa-accordion-bordered form-review-panel">
        { this.accordionSection('veteranInformation', 'Veteran Information', 'My veteran information') }
        { this.accordionSection('militaryService', 'Military Service', 'My military service') }
        { this.accordionSection('vaBenefits', 'VA Benefits', 'My va benefits') }
        { this.accordionSection('householdInformation', 'Household Information', 'My household information') }
        { this.accordionSection('insuranceInformation', 'Insurance Information', 'My insurance information') }
      </ul>
    );
  }

  render() {
    return (
      <div>
        <RequiredLoginView
          authRequired={1}
          serviceRequired="user-profile"
          userProfile={this.props.profile}
          loginUrl={this.props.loginUrl}
          verifyUrl={this.props.verifyUrl}>
          <DowntimeNotification appTitle="user profile page" dependencies={[services.mvi, services.emis]}>
            <div className="row user-profile-row">
              <div className="usa-width-two-thirds medium-8 small-12 columns">
                <h1>Your Profile</h1>
                <div>
                  {this.renderAccordion()}
                </div>
              </div>
            </div>
          </DowntimeNotification>
        </RequiredLoginView>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const userState = state.user;

  return {
    profile: userState.profile,
    loginUrl: userState.login.loginUrl,
    verifyUrl: userState.login.verifyUrl
  };
};

const mapDispatchToProps = {
  removeSavedForm,
  updateVerifyUrl
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileApp);
export { UserProfileApp };
