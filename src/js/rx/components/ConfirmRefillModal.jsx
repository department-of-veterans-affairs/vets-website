import React from 'react';
import Modal from '../../common/components/Modal';
import LoadingIndicator from '../../common/components/LoadingIndicator';
import { formatDate } from '../utils/helpers';

class ConfirmRefillModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleConfirmRefill = this.handleConfirmRefill.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleConfirmRefill(event) {
    event.preventDefault();
    this.props.refillPrescription(this.props.prescription);
  }

  handleCloseModal(event) {
    event.preventDefault();
    this.props.onCloseModal();
  }

  render() {
    // Initialize to prevent console errors
    let innerElement = '';

    if (this.props.isLoading) {
      innerElement = (
        <LoadingIndicator
            message="Submitting your refill request..."/>
      );
    } else if (this.props.prescription) {
      const prescription = this.props.prescription;
      innerElement = (
        <form onSubmit={this.handleConfirmRefill}>
          <div className="rx-modal-refillinfo">
            <div>
              <span className="rx-modal-drug">
                {prescription.prescriptionName}
              </span>
            </div>
            <div className="rx-modal-rxnumber">
              <strong>Prescription <abbr title="number">#</abbr>:</strong> {prescription.prescriptionNumber}
            </div>
            <div className="rx-modal-facility">
              <strong>Facility name:</strong> {prescription.facilityName}
            </div>
            <div className="rx-modal-lastrefilled">
              <strong>Last submit date:</strong> {formatDate(prescription.refillSubmitDate)}
            </div>
            <div className="va-modal-button-group cf">
              <button type="submit">Order refill</button>
              <button type="button" className="usa-button-outline"
                  onClick={this.handleCloseModal}>Cancel</button>
            </div>
          </div>
        </form>
        );
    }

    return (
      <Modal
          cssClass="va-modal rx-modal"
          contents={innerElement}
          hideCloseButton
          id="rx-confirm-refill"
          onClose={this.props.onCloseModal}
          title="Confirm refill"
          visible={this.props.isVisible}/>
      );
  }
}

ConfirmRefillModal.propTypes = {
  prescription: React.PropTypes.shape({
    prescriptionId: React.PropTypes.number.isRequired,
    prescriptionName: React.PropTypes.string.isRequired
  }),
  isLoading: React.PropTypes.bool,
  isVisible: React.PropTypes.bool,
  refillPrescription: React.PropTypes.func,
  onCloseModal: React.PropTypes.func
};

export default ConfirmRefillModal;
