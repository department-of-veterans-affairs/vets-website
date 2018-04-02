import React from 'react';
import { connect } from 'react-redux';
import appendQuery from 'append-query';

import RequiredLoginView from '../../../common/components/RequiredLoginView';
import ErrorableCheckboxes from '../../../common/components/form-elements/ErrorableCheckboxes';
import ErrorableRadioButtons from '../../../common/components/form-elements/ErrorableRadioButtons';

import { toggleLoginModal } from '../../../login/actions';

import { disabilityStatusOptions, disabilityUpdateOptions, layouts } from '../helpers';

const { chooseStatus, chooseUpdate, applyGuidance } = layouts;

class DisabilityWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLayout: chooseStatus
    };
  }

    TitleContent = () => {
      const { currentLayout, disabilityStatus, add, increase } = this.state;
      let titleContent = 'You should file a disability claim on eBenefits';
      const atGuidance = currentLayout === applyGuidance;
      const isUpdate = disabilityStatus === 'update';
      if (!atGuidance) titleContent = 'What type of disability claim should I file?';
      if (atGuidance && disabilityStatus === 'appeal') titleContent = 'You should file an appeal';
      if (atGuidance && isUpdate && !add && increase) titleContent = 'You should make a claim for increase';
      return <h3>{titleContent}</h3>;
    }

    ButtonContainer = () => {
      const { currentLayout, disabilityStatus, add, increase } = this.state;
      const { profile, loginUrl, verifyUrl } = this.props;
      const appealingClaim = disabilityStatus === 'appeal';
      const notUpdatingStatus = disabilityStatus === 'first';
      const updatingStatus = disabilityStatus === 'update';
      const eligibleForIncrease = updatingStatus && !add && increase;
      const ineligibleForIncrease = updatingStatus && add;
      const atAppealGuidance = currentLayout === applyGuidance && appealingClaim;
      const atIncreaseGuidance = currentLayout === applyGuidance && eligibleForIncrease;
      const atEbenefitsGuidance = currentLayout === applyGuidance && (notUpdatingStatus || ineligibleForIncrease);

      return  (<div>
        {currentLayout !== chooseStatus &&
        <button type="button" className="usa-button-secondary" onClick={this.goBack}><span className="button-icon">« </span>Back</button>
        }
        {atIncreaseGuidance && !sessionStorage.userToken &&
        <a className="usa-button-primary" href="/disability-benefits/526/apply-for-increase/introduction/" onClick={this.authenticate}>Sign In or Create an Account<span className="button-icon"> »</span></a>
        }
        {atIncreaseGuidance && sessionStorage.userToken &&
        <RequiredLoginView
          containerClass="login-container"
          authRequired={1}
          serviceRequired={['disability-benefits']}
          userProfile={profile}
          loginUrl={loginUrl}
          verifyUrl={verifyUrl}>
          <a className="usa-button-primary" href="/disability-benefits/526/apply-for-increase/introduction/">Apply for Claim for Increase<span className="button-icon"> »</span></a>
        </RequiredLoginView>}
        {atEbenefitsGuidance &&
        <a className="usa-button-primary" href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation">Go to eBenefits<span className="button-icon"> »</span></a>
        }
        {atAppealGuidance &&
        <a className="usa-button-primary" href="/disability-benefits/claims-appeal/">Learn How to File an Appeal<span className="button-icon"> »</span></a>
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

  GetStartedMessage = () => {
    const { disabilityStatus, add, increase } = this.state;
    const signInMessage = sessionStorage.userToken ? '' : ' Sign in or create an account before starting the Claim for Increase application.';
    let getStartedMessage = `Based on your answers, you can file a claim for increase.${signInMessage}`;
    if (disabilityStatus === 'first') {
      getStartedMessage = 'We’re sorry. We’re unable to file original claims on Vets.gov at this time. Since you’re filing your first disability claim, you’ll need to file your claim on eBenefits.';
    }
    if (disabilityStatus === 'appeal') {
      getStartedMessage = 'Based on your answers, you should file an appeal.';
    }
    if (add && !increase) {
      getStartedMessage = 'Since you have a new condition to add to your rated disability claim, you’ll need to file your disability claim on eBenefits.';
    }
    if (add && increase) {
      getStartedMessage = 'Since you have both new and worsening conditions, you’ll need to file your disability claim on eBenefits.';
    }
    return <p>{getStartedMessage}</p>;
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
      return this.goToNextPage();
    }
    if (currentLayout === chooseUpdate && !increase) {
      this.goToNextPage();
      return this.setState({ errorMessage: '' });
    }
    return false;
  };

  authenticate = (e) => {
    e.preventDefault();
    const nextQuery = { next: e.target.getAttribute('href') };
    const nextPath = appendQuery('/', nextQuery);
    history.pushState({}, e.target.textContent, nextPath);
    this.props.toggleLoginModal(true);
  }

  render() {
    const { currentLayout, errorMessage, disabilityStatus } = this.state;
    const { TitleContent, GetStartedMessage, ButtonContainer } = this;


    return (
      <div className="va-nav-linkslist--related form-expanding-group-open">
        <TitleContent/>
        <div>
          {currentLayout === applyGuidance && <GetStartedMessage/>}
          {currentLayout === chooseStatus &&
          <ErrorableRadioButtons
            name="disabilityStatus"
            label="Please choose the option that describes you:"
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
              label="Please choose the option that describes you:"
              required
              id="disabilityUpdate"
              options={disabilityUpdateOptions}
              errorMessage={errorMessage}
              onValueChange={(option, checked) => this.setState({ [option.value]: checked })}
              values={this.state}/>
          }
          {<ButtonContainer/>}
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

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLoginModal: (update) => {
      dispatch(toggleLoginModal(update));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisabilityWizard);

export { DisabilityWizard };
