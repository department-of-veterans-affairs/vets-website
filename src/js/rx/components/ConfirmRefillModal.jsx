import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { refillPrescription } from '../actions/prescriptions.js';

class ConfirmRefillModal extends React.Component {
  constructor(props) {
    super(props);
    this.handlerConfirmRefill = this.handlerConfirmRefill.bind(this);
    this.handlerCloseModal = this.handlerCloseModal.bind(this);
  }

  handlerConfirmRefill(event) {
    event.preventDefault();

    const rxId = this.props['prescription-id'];
    const alertContent = (
      <b>
        Refill for <a href={`/rx/prescription/${rxId}`}>{this.props['prescription-name']}</a> has been requested.
      </b>
    );

    this.props.dispatch(refillPrescription(rxId));
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
        <section className="rx-modal" id="rx-confirm-refill">
          <form className="rx-modal-inner" onSubmit={this.handlerConfirmRefill}>
            <div>
              <h3 className="rx-modal-title">Confirm refill</h3>
              <div className="rx-modal-refillinfo rx-modal-body">
                <div>
                  <span className="rx-modal-drug">{this.props['prescription-name']}</span>
                </div>
                <div className="rx-modal-rxnumber">
                  Prescription <abbr title="number">#</abbr>: {this.props['prescription-number']}
                </div>
                <div className="rx-modal-facility">
                  Facility name: {this.props['facility-name']}
                </div>
                <div className="rx-modal-lastrefilled">
                  Last requested: {moment(this.props['refill-date']).format('MMM D, YYYY')}
                </div>
                <div className="rx-button-group cf">
                  <button type="submit" value={this.props['prescription-id']}>Order refill</button>
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

// TODO: fill this out so that we're not sending
// the entire state object.
// Only need dispatch to be available in this component
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ConfirmRefillModal);
