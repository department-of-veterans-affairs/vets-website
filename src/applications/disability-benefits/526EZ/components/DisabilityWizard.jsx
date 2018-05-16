import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import appendQuery from 'append-query';
import classNames from 'classnames';

import ErrorableCheckboxes from './ErrorableCheckboxes';
import ErrorableRadioButtons from '@department-of-veterans-affairs/formation/ErrorableRadioButtons';

import { toggleLoginModal } from '../../../../platform/site-wide/user-nav/actions';

import ButtonContainer from './ButtonContainer';
import { GetStartedMessage, disabilityStatusOptions, disabilityUpdateOptions, layouts } from '../helpers';

const { chooseStatus, chooseUpdate, applyGuidance } = layouts;

class DisabilityWizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLayout: chooseStatus
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

  getUpdates = () => {
    const { disabilityStatus } = this.state;
    const updates = { add: false, increase: false };
    const regexIncrease = RegExp(/increase/i);
    if (disabilityStatus && disabilityStatus.includes('add')) updates.add = true;
    if (disabilityStatus && regexIncrease.test(disabilityStatus)) updates.increase = true;
    return updates;
  }

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

  answerQuestion = (field, answer) => {
    if (field === 'disabilityStatus') {
      this.setState({ disabilityStatus: answer });
    } else {
      const disabilityStatus = this.getDisabilityUpdate(field, answer);
      this.setState({ disabilityStatus });
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
    const { isAddAndIncrease, isAddOnly, isIncreaseOnly } = this.checkDisabilityStatus();
    const updateProvided = !!(isAddAndIncrease || isAddOnly || isIncreaseOnly);
    if (atGuidance() && updateProvided) {
      nextLayout = chooseUpdate;
    }
    this.setState({ currentLayout: nextLayout, errorMessage: '' });
  };

  displayErrorMessage = () => {
    this.setState({ errorMessage: 'Please select an option' });
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
    const { isChoosingStatus, isChoosingUpdate, atGuidance } = this;
    const { errorMessage } = this.state;
    const { verified: isVerified } = this.props.user.profile;
    const labelText = 'Just answer a few questions, and we’ll show you where to find the form that’s right for you.';
    const buttonClasses = classNames('usa-button-primary', 'wizard-button', {
      'va-button-primary': !this.state.open
    });
    const contentClasses = classNames('form-expanding-group-open', 'va-nav-linkslist--related', 'wizard-content', {
      'wizard-content-closed': !this.state.open
    });

    return (
      <div className="disability-increase-wizard">
        <button
          aria-expanded={this.state.open ? 'true' : 'false'}
          aria-controls="wizardOptions"
          className={buttonClasses}
          onClick={() => this.setState({ open: !this.state.open })}>
          Find Your Disability Claim Form
        </button>
        <div className={contentClasses} id="wizardOptions">
          <div>
            {atGuidance() && <GetStartedMessage isVerified={isVerified} checkDisabilityStatus={this.checkDisabilityStatus}/>}
            {isChoosingStatus() &&
            <ErrorableRadioButtons
              name="disabilityStatus"
              label={labelText}
              id="disabilityStatus"
              options={disabilityStatusOptions}
              errorMessage={errorMessage}
              onValueChange={({ value }) => this.answerQuestion('disabilityStatus', value)}
              value={{ value: this.getDisabilityStatus() }}/>
            }
            {isChoosingUpdate() &&
            <ErrorableCheckboxes
              name="disabilityUpdate"
              label={labelText}
              id="disabilityUpdate"
              options={disabilityUpdateOptions}
              errorMessage={errorMessage}
              onValueChange={(option, checked) => this.answerQuestion(option.value, checked)}
              values={this.getUpdates()}/>
            }
            {<ButtonContainer
              {...this.props}
              isVerified={isVerified}
              checkGuidanceStatus={this.checkGuidanceStatus}
              isChoosingStatus={this.isChoosingStatus}
              atGuidance={this.atGuidance}
              goBack={this.goBack}
              goForward={this.goForward}
              authenticate={this.authenticate}/>}
          </div>
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

DisabilityWizard.propTypes = {
  toggleLoginModal: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(DisabilityWizard);

export { DisabilityWizard };
