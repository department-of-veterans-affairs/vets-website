import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import { hasSession } from 'platform/user/profile/utilities';
import TestData from './testData.json';

class DependencyVerification extends Component {
  state = {
    showDefault: false,
    onAward: TestData.dependentsOnAward,
    notOnAward: TestData.dependentsNotOnAward,
  };

  componentDidMount() {
    const hasUserDismissed = localStorage.getItem(
      'dismissedDependencyVerification',
    );
    if (hasSession() && hasUserDismissed !== 'true') {
      this.setState({ showDefault: hasSession() });
    }
  }

  renderList(list) {
    return list.map(item => {
      return (
        <div
          key={item.id}
          className="vads-u-background-color--gray-lightest vads-u-padding--1 vads-u-margin-bottom--1"
        >
          <dt>
            <strong>Name: </strong>
            {item.name}
          </dt>
          <dd>
            <strong>Age: </strong> 31
          </dd>
        </div>
      );
    });
  }

  handleCookieUser = () => {
    localStorage.setItem('dismissedDependencyVerification', 'true');
    this.justHideModal();
  };

  justHideModal = () => {
    this.setState({ showDefault: false });
  };

  render() {
    return (
      <div>
        <Modal
          title="Your current dependents"
          id="default"
          status="info"
          visible={this.state.showDefault}
          onClose={() => this.handleHideModal}
          hideCloseButton
        >
          <p className="vads-u-font-size--md">
            Below is a list of dependents we have on file for you at the VA. If
            this list is correct, please choose the button to say it is correct.
          </p>
          <AdditionalInfo triggerText="Why am I seeing this?">
            <p>
              We want to ensure that we have the most accurate information for
              you and your dependents.
            </p>
          </AdditionalInfo>
          <p
            className="vads-u-font-family--serif vads-u-font-weight--bold
"
          >
            Dependents On Award
          </p>
          <dl>{this.renderList(this.state.onAward)}</dl>
          <p
            className="vads-u-font-family--serif vads-u-font-weight--bold
"
          >
            Dependents Not On Award
          </p>
          <dl>{this.renderList(this.state.notOnAward)}</dl>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={this.handleHideModal}
          >
            Yes this list is correct
          </button>
          <button type="button" className="usa-button">
            No I need to make a change
          </button>
          <a onClick={this.justHideModal} className="vads-u-display--block">
            Skip for now
          </a>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  loggedIn: store.user.login.currentlyLoggedIn,
});

export default connect(mapStateToProps)(DependencyVerification);
