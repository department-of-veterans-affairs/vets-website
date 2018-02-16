import React from 'react';
import { connect } from 'react-redux';
import { getVerifyUrl } from '../../common/helpers/login-helpers.js';
import { updateVerifyUrl } from '../../login/actions';
import { removeSavedForm } from '../actions';
import RequiredLoginView from '../../common/components/RequiredLoginView';
import DowntimeNotification, { services } from '../../common/containers/DowntimeNotification';
import Accordion, { AccordionTab } from '../../common/components/Accordion';

class ProfileAccordion extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeAccordionId: 'veteran-information' };
  }
  onAccordionTabClick = (accordionId) => {
    const activeAccordionId = this.state.activeAccordionId === accordionId ? '' : accordionId;
    this.setState({ activeAccordionId });
  }
  render() {
    return (
      <Accordion>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="veteran-information" title="Veteran Information">
          <h3>Veteran Information</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="military-service" title="Military Service">
          <h3>Military Service</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="va-benefits" title="VA Benefits">
          <h3>VA Benefits</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="household-information" title="Household Information">
          <h3>Household Information</h3>
        </AccordionTab>
        <AccordionTab onClick={this.onAccordionTabClick} activeAccordionId={this.state.activeAccordionId} id="insurance-information" title="Insurance Information">
          <h3>Insurance Information</h3>
        </AccordionTab>
      </Accordion>
    );
  }
}

class UserProfileApp extends React.Component {
  constructor() {
    super();
    this.state = {
      activeAccordionId: 'veteranInformation'
    };
  }

  componentDidMount() {
    if (!this.props.verifyUrl) {
      getVerifyUrl(this.props.updateVerifyUrl);
    }
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
                <ProfileAccordion/>
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
