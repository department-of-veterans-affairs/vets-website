import React from 'react';

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
    this.props.onCloseModal();
  }

  handleCloseModal(event) {
    event.preventDefault();
    this.props.onCloseModal();
  }

  render() {
    const prescription = this.props.prescription;
    let element;

    if (this.props.isVisible) {
      element = (
        <section className="va-modal rx-modal" id="rx-confirm-refill">
          <form className="va-modal-inner" onSubmit={this.handleConfirmRefill}>
            <div>
              <h3 className="rx-modal-title">Confirm refill</h3>
              <div className="rx-modal-refillinfo va-modal-body">
                <div>
                  <span className="rx-modal-drug">{prescription.prescriptionName}</span>
                </div>
                <div className="rx-modal-rxnumber">
                  Prescription <abbr title="number">#</abbr>: {prescription.prescriptionNumber}
                </div>
                <div className="rx-modal-facility">
                  Facility name: {prescription.facilityName}
                </div>
                <div className="rx-modal-lastrefilled">
                  Last submit date: {formatDate(prescription.refillSubmitDate)}
                </div>
                <div className="va-modal-button-group cf">
                  <button type="submit">Order refill</button>
                  <button type="button" className="usa-button-outline"
                      onClick={this.handleCloseModal}>Cancel</button>
                </div>
              </div>
            </div>
          </form>
        </section>
      );
    } else {
      element = (<div/>);
    }

    return element;
  }
}

ConfirmRefillModal.propTypes = {
  prescription: React.PropTypes.shape({
    prescriptionId: React.PropTypes.number.isRequired,
    prescriptionName: React.PropTypes.string.isRequired
  }),
  isVisible: React.PropTypes.bool,
  refillPrescription: React.PropTypes.func,
  onCloseModal: React.PropTypes.func
};

export default ConfirmRefillModal;
