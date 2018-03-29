import React from 'react';
import { connect } from 'react-redux';

import RequiredLoginView from '../../../common/components/RequiredLoginView';
import ErrorableCheckboxes from '../../../common/components/form-elements/ErrorableCheckboxes';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { disabilityStatusOptions, disabilityUpdateOptions, layouts } from '../helpers';

const { chooseStatus, chooseUpdate, applyGuidance } = layouts;

class DisabilityWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLayout: chooseStatus
    };
  }

    getButtonContainer = () => {
      const { currentLayout, disabilityStatus, add, increase, signingIn } = this.state;
      const { profile, loginUrl, verifyUrl } = this.props;
      const notUpdatingStatus = disabilityStatus === 'first' || disabilityStatus === 'appeal';
      const updatingStatus = disabilityStatus === 'update';
      const eligibleForIncrease = updatingStatus && !add && increase;
      const ineligibleForIncrease = updatingStatus && add;
      const atIncreaseGuidance = currentLayout === applyGuidance && eligibleForIncrease;
      const atEbenefitsGuidance = currentLayout === applyGuidance && (notUpdatingStatus || ineligibleForIncrease);

      return  (<div>
        {/* TODO: Check with @goldenmeanie that users shouldn't be able to go back from third page */}
        {currentLayout !== chooseStatus &&
        <button type="button" className="usa-button-secondary" onClick={this.goBack}><span className="button-icon">« </span>Back</button>
        }
        {atIncreaseGuidance && !sessionStorage.userToken &&
        <button className="usa-button-primary" onClick={() => this.setState({ signingIn: true })}>Sign in<span className="button-icon"> »</span></button>
        }
        {atIncreaseGuidance && (sessionStorage.userToken || signingIn) &&
        <RequiredLoginView
          containerClass="login-container"
          authRequired={3}
          serviceRequired={['disability-benefits']}
          userProfile={profile}
          loginUrl={loginUrl}
          verifyUrl={verifyUrl}>
          <a className="usa-button-primary" href="/disability-benefits/526/apply-for-increase/introduction/">Apply now<span className="button-icon"> »</span></a>
        </RequiredLoginView>}
        {atEbenefitsGuidance &&
        <a className="usa-button-primary" href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation">Go to eBenefits to Apply<span className="button-icon"> »</span></a>
        }
        {currentLayout !== applyGuidance &&
        <a className="usa-button-primary" onClick={this.goForward}>Next<span className="button-icon"> »</span></a>
        }
      </div>);
    }

  answerQuestion = (field, answer) => {
    const newState = Object.assign({}, { [field]: answer });
    this.setState(newState);
  };

  goToNextPage = () => {
    let nextLayout = applyGuidance;
    if (this.state.currentLayout === chooseStatus && this.state.disabilityStatus === 'update') {
      nextLayout = chooseUpdate;
    }
    this.setState({ currentLayout: nextLayout, errorMessage: '' });
  }

  goBack = () => {
    let nextLayout = chooseStatus;
    if (this.state.currentLayout === applyGuidance && this.state.disabilityStatus === 'update') {
      nextLayout = chooseUpdate;
    }
    this.setState({ currentLayout: nextLayout, errorMessage: '' });
  };

  displayErrorMessage = () => {
    this.setState({ errorMessage: 'Please select an option' });
  }

  goForward = () => {
    const { currentLayout, disabilityStatus, increase, add } = this.state;
    const isUpdate = disabilityStatus === 'update';
    if (currentLayout === chooseStatus && !disabilityStatus) {
      return this.displayErrorMessage();
    }
    if (currentLayout === chooseUpdate && !add && !increase) {
      return this.displayErrorMessage();
    }
    if (currentLayout === chooseStatus && !isUpdate) {
      this.goToNextPage();
      return this.setState({ errorMessage: '', add: false, increase: false });
    }
    if (currentLayout === chooseStatus && isUpdate) {
      return this.goToNextPage();
    }
    if (currentLayout === chooseUpdate && increase) {
      //if (!add && this.props.onEligibilityUpdate) this.props.onEligibilityUpdate(true);
      return this.goToNextPage();
    }
    if (currentLayout === chooseUpdate && !increase) {
      //if (this.props.onEligibilityUpdate) this.props.onEligibilityUpdate(false);
      this.goToNextPage();
      return this.setState({ errorMessage: '' });
    }
    return false;
  };

  render() {
    const { currentLayout, errorMessage, disabilityStatus, add, increase } = this.state;
    const { profile } = this.props;
    let signInMessage = sessionStorage.userToken ? '' : ' Sign in to your account to get started.';
    if (profile.accountType === 1) signInMessage = ' Verify your account to get started.';
    let getStartedMessage = `Based on your answers, you can file a claim for increase.${signInMessage}`;
    if (disabilityStatus === 'first' || disabilityStatus === 'appeal') {
      getStartedMessage = 'We currently aren’t able to file an original claim on Vets.gov. Please go to eBenefits to apply.';
    }
    if (add && !increase) {
      getStartedMessage = 'Because you’re adding new conditions, you’ll need to apply using eBenefits.';
    }
    if (add && increase) {
      getStartedMessage = 'Because you have both new and worsening conditions, you’ll need to apply using eBenefits.';
    }
    const titleContent = currentLayout === applyGuidance ? 'You should make a claim for increase' : 'Find out what kind of claim to file';

    return (
      <div className="va-nav-linkslist--related form-expanding-group-open">
        <h3>{titleContent}</h3>
        <div>
          {/* Move title into own component */}
          {currentLayout === applyGuidance && <p>{getStartedMessage}</p>}
          {currentLayout === chooseStatus &&
          <ErrorableRadioButtons
            name="disabilityStatus"
            label="Please select the option that applies to you."
            required
            id="disabilityStatus"
            options={disabilityStatusOptions}
            errorMessage={errorMessage}
            onValueChange={({ value }) => this.answerQuestion('disabilityStatus', value)}
            value={{ value: disabilityStatus }}/>
          }
          {currentLayout === chooseUpdate &&
            <ErrorableCheckboxes
              name="disabilityUpdate"
              label="Please check all that apply to you."
              required
              id="disabilityUpdate"
              options={disabilityUpdateOptions}
              errorMessage={errorMessage}
              onValueChange={(option, checked) => this.setState({ [option.value]: checked })}
              values={this.state}/>
          }
          {this.getButtonContainer()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const userState = state.user;
  return {
    profile: userState.profile
  };
}

export default connect(mapStateToProps)(DisabilityWizard);

export { DisabilityWizard };
