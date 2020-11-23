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
    if (list.length > 0) {
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
    } else {
      return (
        <div className="vads-u-background-color--gray-lightest vads-u-padding--1 vads-u-margin-bottom--1 vads-u-border-left--7px vads-u-border-color--secondary">
          <p className="">We can't find any dependents for this award type</p>
        </div>
      );
    }
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
            To ensure your list of VA dependents is upt to date, please verify
            the information below.
          </p>
          <AdditionalInfo triggerText="Why am I seeing this?">
            <p>
              Keeping this data current allows the VA to more accurately adjust
              your compensation and benefits based on different life events that
              occur from time to time.
            </p>
          </AdditionalInfo>
          <p
            className="vads-u-font-family--serif vads-u-font-weight--bold
"
          >
            Dependents On Award
          </p>
          <dl>{this.renderList(this.state.onAward)}</dl>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={this.handleHideModal}
          >
            Yes, this list is correct
          </button>
          <button type="button" className="usa-button">
            No, I need to make a change
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
