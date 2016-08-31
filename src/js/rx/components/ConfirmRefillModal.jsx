import React from 'react';

class ConfirmRefillModal extends React.Component {

  constructor(props) {
    super(props);
    this.handlerConfirmRefill = this.handlerConfirmRefill.bind(this);
    this.handlerCloseModal = this.handlerCloseModal.bind(this);
  }

  handlerConfirmRefill(event) {
    // This should also trigger a state update
    // and possibly a server request.
    event.preventDefault();
    const alertContent = (
      <span>
        Refill for {this.props.drug} has been requested.
      </span>
    );
    this.props.openAlert('info', alertContent);
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
        <section className="rx-modal" id="rx-confirm-refill">
          <form className="rx-modal-inner" onSubmit={this.handlerConfirmRefill}>
            <div>
              <h3 className="rx-modal-title">Confirm refill</h3>
              <div className="rx-modal-refillinfo">
                <div>
                  <span className="rx-modal-drug">{this.props.drug}</span>
                  <span className="rx-modal-dosage"> {this.props.dosage}</span>
                </div>
                <div className="rx-modal-facility">
                  Facility name: {this.props.facilityName}
                </div>
                <div className="rx-modal-lastrefilled">
                  Last requested: {this.props.lastRefilled}
                </div>
                <div className="rx-button-group cf">
                  <button type="submit">Order refill</button>
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
