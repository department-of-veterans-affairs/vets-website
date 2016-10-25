import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

class ConfirmRefillModal extends React.Component {
  constructor(props) {
    super(props);
    this.handlerConfirmRefill = this.handlerConfirmRefill.bind(this);
    this.handlerCloseModal = this.handlerCloseModal.bind(this);
  }

  handlerConfirmRefill(event) {
    event.preventDefault();

    const rxId = this.props.prescriptionId;
    const alertContent = (
      <b>
        Refill for <Link to={`/${rxId}`}>{this.props.prescriptionName}</Link> has been requested.
      </b>
    );

    this.props.refillPrescription(rxId);
    this.props.openAlert('success', alertContent);
    this.props.onCloseModal();
  }

  handlerCloseModal(event) {
    event.preventDefault();
    this.props.onCloseModal();
  }

  render() {
    let element;
    if (this.props.isVisible) {
      element = (
        <section className="va-modal rx-modal" id="rx-confirm-refill">
          <form className="va-modal-inner" onSubmit={this.handlerConfirmRefill}>
            <div>
              <h3 className="rx-modal-title">Confirm refill</h3>
              <div className="rx-modal-refillinfo va-modal-body">
                <div>
                  <span className="rx-modal-drug">{this.props.prescriptionName}</span>
                </div>
                <div className="rx-modal-rxnumber">
                  Prescription <abbr title="number">#</abbr>: {this.props.prescriptionNumber}
                </div>
                <div className="rx-modal-facility">
                  Facility name: {this.props.facilityName}
                </div>
                <div className="rx-modal-lastrefilled">
                  Last requested: {moment(this.props.refillDate).format('MMM D, YYYY')}
                </div>
                <div className="va-modal-button-group cf">
                  <button type="submit" value={this.props.prescriptionId}>Order refill</button>
                  <button type="button" className="usa-button-outline"
                      onClick={this.handlerCloseModal}>Cancel</button>
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
  drug: React.PropTypes.string,
  dosage: React.PropTypes.string,
  facilityName: React.PropTypes.string,
  lastRefilled: React.PropTypes.string
};

export default ConfirmRefillModal;
