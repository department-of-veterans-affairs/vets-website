import PropTypes from 'prop-types';
import React from 'react';

import ProgressButton from '@department-of-veterans-affairs/formation-react/ProgressButton';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import recordEvent from '../../../../platform/monitoring/record-event';

import FormItem from './FormItem';
import { isSIPEnabledForm } from '../helpers';

class FormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      formId: undefined,
    };
  }

  removeForm = () => {
    this.toggleModal();
    recordEvent({
      event: 'dashboard-navigation',
      'dashboard-action': 'delete-link',
      'dashboard-product': this.state.formId,
    });
    this.props.removeSavedForm(this.state.formId);
  };

  toggleModal = formId => {
    this.setState({ formId, modalOpen: !this.state.modalOpen });
  };

  render() {
    const { savedForms: forms } = this.props;
    const verifiedSavedForms = forms.filter(isSIPEnabledForm);
    const hasVerifiedSavedForms = !!verifiedSavedForms.length;

    return !hasVerifiedSavedForms ? null : (
      <div className="profile-section medium-12 columns">
        <h2 className="section-header">Continue Applications</h2>
        {forms.map(form => (
          <FormItem
            key={form.form}
            savedFormData={form}
            toggleModal={this.toggleModal}
          />
        ))}
        <Modal
          cssClass="va-modal-large"
          id="start-over-modal"
          onClose={this.toggleModal}
          visible={this.state.modalOpen}
        >
          <h4>Are you sure?</h4>
          <p>
            If you delete this application, the information you entered will be
            lost.
          </p>
          <ProgressButton
            onButtonClick={this.removeForm}
            buttonText="Yes, Delete It"
            buttonClass="usa-button-primary"
          />
          <ProgressButton
            onButtonClick={this.toggleModal}
            buttonText="No, keep it"
            buttonClass="usa-button-secondary"
          />
        </Modal>
      </div>
    );
  }
}

FormList.propTypes = {
  savedForms: PropTypes.array,
};

export default FormList;
