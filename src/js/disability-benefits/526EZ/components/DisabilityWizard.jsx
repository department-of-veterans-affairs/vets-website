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
      currentLayout: chooseStatus,
      updates: {
        add: false,
        increase: false
      }
    };
  }

  getDisabilityStatus = () => {
    const { isAppeal, isFirst, isUndefined } = this.checkDisabilityStatus();
    if (isAppeal) return 'appeal';
    if (isFirst) return 'first';
    if (isUndefined) return undefined;
    return 'update';
  }

  getDisabilityUpdate = (option, checked) => {
    const { isUpdate, isAddAndIncrease } = this.checkDisabilityStatus();
    if (checked) {
      if (isUpdate) {
        return option;
      }
      return 'addAndIncrease';
    }
    if (!checked) {
      if (isAddAndIncrease) {
        if (option === 'add') {
          return 'increase';
        }
        if (option === 'increase') {
          return 'add';
        }
      }
      return 'update';
    }
    return false;
  };

  isChoosingStatus = () => this.state.currentLayout === chooseStatus;

  isChoosingUpdate = () => this.state.currentLayout === chooseUpdate;

  atGuidance = () => this.state.currentLayout === applyGuidance;

  checkGuidanceStatus = () => {
    const { isAppeal, isIncreaseOnly, containsAdd, isFirst } = this.checkDisabilityStatus();
    return {
      atAppealGuidance: (this.atGuidance() && isAppeal),
      atIncreaseGuidance: (this.atGuidance() && isIncreaseOnly),
      atEbenefitsGuidance: (this.atGuidance() && (containsAdd || isFirst))
    };
  };

  checkDisabilityStatus = () => {
    const { disabilityStatus } = this.state;
    return {
      isUpdate: (disabilityStatus === 'update'),
      isAppeal: (disabilityStatus === 'appeal'),
      isFirst: (disabilityStatus === 'first'),
      isAddOnly: (disabilityStatus === 'add'),
      containsAdd: (disabilityStatus === 'add' || disabilityStatus === 'addAndIncrease'),
      isIncreaseOnly: (disabilityStatus === 'increase'),
      isAddAndIncrease: (disabilityStatus === 'addAndIncrease'),
      isUndefined: (!disabilityStatus)
    };
  }

  TitleContent = () => {
    const atGuidance = this.atGuidance();
    const { atAppealGuidance, atIncreaseGuidance } = this.checkGuidanceStatus();
    let titleContent = 'You need to file a disability claim on eBenefits';
    if (!atGuidance) titleContent = 'What type of disability claim should I file?';
    if (atAppealGuidance) titleContent = 'You need to file an appeal';
    if (atIncreaseGuidance) titleContent = 'You need to file a claim for increase';
    return <h3>{titleContent}</h3>;
  }

  ButtonContainer = () => {
    const { atIncreaseGuidance, atEbenefitsGuidance } = this.checkGuidanceStatus();
    const { user, loginUrl, verifyUrl } = this.props;

    return  (<div>
      {!this.isChoosingStatus() &&
        <button type="button" className="usa-button-secondary" onClick={this.goBack}><span className="button-icon">« </span>Back</button>
      }
      {atIncreaseGuidance && !sessionStorage.userToken &&
        <a className="usa-button-primary" href="/disability-benefits/526/apply-for-increase/introduction/" onClick={this.authenticate}>Sign In or Create an Account<span className="button-icon"> »</span></a>
      }
      {atIncreaseGuidance && sessionStorage.userToken &&
        <RequiredLoginView
          containerClass="login-container"
          serviceRequired={['disability-benefits']}
          user={user}
          loginUrl={loginUrl}
          verifyUrl={verifyUrl}>
          <a className="usa-button-primary" href="/disability-benefits/526/apply-for-increase/introduction/">Apply for Claim for Increase<span className="button-icon"> »</span></a>
        </RequiredLoginView>}
      {atEbenefitsGuidance &&
        <a className="usa-button-primary" href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation">Go to eBenefits<span className="button-icon"> »</span></a>
      }
      {!this.atGuidance() &&
        <a className="usa-button-primary" onClick={this.goForward}>Next<span className="button-icon"> »</span></a>
      }
    </div>);
  }

  answerQuestion = (field, answer) => {
    if (field === 'disabilityStatus') {
      this.setState({ [field]: answer });
    } else {
      const disabilityStatus = this.getDisabilityUpdate(field, answer);
      this.setState({ disabilityStatus, updates: { ...this.state.updates, [field]: answer } });
    }
  };

  goToNextPage = () => {
    const { isUpdate } = this.checkDisabilityStatus();
    let nextLayout = applyGuidance;
    if (this.isChoosingStatus() && isUpdate) {
      nextLayout = chooseUpdate;
    }
    this.setState({ currentLayout: nextLayout, errorMessage: '' });
  }

  goBack = () => {
    let nextLayout = chooseStatus;
    const { atGuidance } = this;
    const isUpdate = this.getDisabilityStatus() === 'update';
    if (atGuidance() && isUpdate) {
      nextLayout = chooseUpdate;
    }
    this.setState({ currentLayout: nextLayout, errorMessage: '' });
  };

  displayErrorMessage = () => {
    this.setState({ errorMessage: 'Please select an option' });
  }

  GetStartedMessage = () => {
    const { isFirst, isAppeal, isAddOnly, isAddAndIncrease } = this.checkDisabilityStatus();
    const signInMessage = sessionStorage.userToken ? '' : ' Please sign in or create an account before starting the application.';
    let getStartedMessage = `Since you have a worsening condition to add to your claim, you’ll need to file a claim for increased disability.${signInMessage}`;
    if (isFirst) {
      getStartedMessage = 'We’re sorry. We’re unable to file original claims on Vets.gov at this time. Since you’re filing your first disability claim, you’ll need to file your claim on eBenefits.';
    }
    if (isAppeal) {
      getStartedMessage = (<span>If you disagree with our decision on your disability claim, you can appeal it. <br/>
        <a href="/disability-benefits/claims-appeal/">Learn how to file an appeal.</a>
      </span>);
    }
    if (isAddOnly) {
      getStartedMessage = 'Since you have a new condition to add to your rated disability claim, you’ll need to file your disability claim on eBenefits.';
    }
    if (isAddAndIncrease) {
      getStartedMessage = 'Since you have both new and worsening conditions, you’ll need to file your disability claim on eBenefits.';
    }
    return <p>{getStartedMessage}</p>;
  }

  goForward = () => {
    const { isUpdate, isUndefined } = this.checkDisabilityStatus();
    const isChoosingStatus = this.isChoosingStatus();
    const isChoosingUpdate = this.isChoosingUpdate();
    if (isChoosingStatus && isUndefined) {
      return this.displayErrorMessage();
    }
    if (isChoosingUpdate && isUpdate) {
      return this.displayErrorMessage();
    }
    if (isChoosingStatus && !isUpdate) {
      this.setState({ updates: { add: false, increase: false } });
    }
    return this.goToNextPage();
  };

  authenticate = (e) => {
    e.preventDefault();
    const nextQuery = { next: e.target.getAttribute('href') };
    const nextPath = appendQuery('/', nextQuery);
    history.pushState({}, e.target.textContent, nextPath);
    this.props.toggleLoginModal(true);
  }

  render() {
    const { isChoosingStatus, isChoosingUpdate, atGuidance,
      TitleContent, GetStartedMessage, ButtonContainer } = this;
    const { errorMessage, updates } = this.state;

    return (
      <div className="va-nav-linkslist--related form-expanding-group-open">
        <TitleContent/>
        <div>
          {atGuidance() && <GetStartedMessage/>}
          {isChoosingStatus() &&
          <ErrorableRadioButtons
            name="disabilityStatus"
            label="Please choose the option that describes you:"
            id="disabilityStatus"
            options={disabilityStatusOptions}
            errorMessage={errorMessage}
            onValueChange={({ value }) => this.answerQuestion('disabilityStatus', value)}
            value={{ value: this.getDisabilityStatus() }}/>
          }
          {isChoosingUpdate() &&
            <ErrorableCheckboxes
              name="disabilityUpdate"
              label="Please choose the option that describes you:"
              id="disabilityUpdate"
              options={disabilityUpdateOptions}
              errorMessage={errorMessage}
              onValueChange={(option, checked) => this.answerQuestion(option.value, checked)}
              values={updates}/>
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
    user: userState
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
