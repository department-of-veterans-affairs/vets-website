import React, { Component } from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import TestData from './testData.json';

class DependencyVerification extends Component {
  state = {
    showDefault: false,
    onAward: TestData.dependentsOnAward,
    notOnAward: TestData.dependentsNotOnAward,
  };

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

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ showDefault: true })}>
          Show Default Modal
        </button>
        <Modal
          title="Your current dependents"
          id="default"
          status="info"
          visible={this.state.showDefault}
          onClose={() => this.setState({ showDefault: false })}
        >
          <p className="vads-u-font-size--md">
            Below is a list of dependents we have on file for you at the VA. If
            this list is correct, please choose the button to say it is correct.
          </p>
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
          <button type="button" className="usa-button">
            Yes this list is correct
          </button>
          <button
            type="button"
            className="usa-button-primary va-button-primary"
          >
            No I need to make a change
          </button>
        </Modal>
      </div>
    );
  }
}

export default DependencyVerification;
