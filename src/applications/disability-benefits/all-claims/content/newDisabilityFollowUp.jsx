import React from 'react';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import { capitalizeEachWord } from '../utils';

export class CauseTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false };
  }

  openModal = () => this.setState({ modalVisible: true });

  closeModal = () => this.setState({ modalVisible: false });

  render() {
    return (
      <div>
        What caused this{' '}
        <button
          type="button"
          className="va-button-link"
          onClick={this.openModal}
        >
          service-connected
        </button>{' '}
        disability?
        <Modal
          title="Service-connected disability"
          onClose={this.closeModal}
          visible={this.state.modalVisible}
          id="service-connected-modal"
        >
          <p>
            To be eligible for disability benefits, you’ll need to show that
            your condition was caused by an illness or injury connected to your
            military service. You’ll need to show your condition is linked to
            your service by submitting evidence, such as medical reports or lay
            statements, with your claim. We may ask you to have a claim exam if
            you don’t submit evidence or if we need more information to decide
            your claim.
          </p>
        </Modal>
      </div>
    );
  }
}

export const disabilityNameTitle = ({ formData }) => (
  <legend className="schemaform-block-title schemaform-title-underline">
    {capitalizeEachWord(formData.condition)}
  </legend>
);
