import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { openRefillModal } from '../actions/modal';
import { rxStatuses } from '../config';
import RefillsRemainingCounter from './RefillsRemainingCounter';
import TrackPackageLink from './TrackPackageLink';
import SubmitRefill from './SubmitRefill';

class Prescription extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showTracking = this.showTracking.bind(this);
    this.showMessageProvider = this.showMessageProvider.bind(this);
    this.showRefillStatus = this.showRefillStatus.bind(this);
  }

  handleSubmit(domEvent) {
    domEvent.preventDefault();
    const refillId = domEvent.target.refillId.value;
    const content = this.props.prescriptions.items.find((rx) => {
      return rx.id === refillId;
    });
    this.props.openRefillModal(content.attributes);
  }

  showTracking() {
    let trackMessage;

    const trackable = this.props.attributes.isTrackable;
    const id = this.props.id;

    if (trackable) {
      trackMessage = (
        <TrackPackageLink
            key={`rx-${id}-track`}
            className="usa-button"
            text="Track package"
            url={`/rx/prescription/${id}#rx-order-history`}/>
      );
    } else {
      trackMessage = (
        <div
            key={`rx-${id}-requested`}
            className="rx-prescription-refill-requested">
          Refill requested
        </div>
      );
    }

    return trackMessage;
  }

  showMessageProvider() {
    let msgProvider;
    const id = this.props.id;
    const remaining = this.props.attributes.refillRemaining;

    if (remaining === 0) {
      msgProvider = (
        <div className="rx-call-provider">
          <Link
              key={`rx-${id}-call`}
              to="/messaging">Message Provider</Link>
        </div>
      );
    }
    return msgProvider;
  }

  showRefillStatus() {
    const refillable = this.props.attributes.isRefillable;
    const id = this.props.id;
    const status = this.props.attributes.refillStatus;

    let refillStatus;

    if (refillable === true) {
      refillStatus = (
        <SubmitRefill
            key={`rx-${id}-refill`}
            cssClass="rx-prescription-button"
            onSubmit={this.handleSubmit}
            refillId={id}
            text="Refill Prescription"/>
      );
    } else {
      refillStatus = (
        <div
            key={`rx-${id}-status`}
            className="rx-prescription-status">
            Refill status:
          <span> {rxStatuses[status]}</span>
        </div>
      );
    }

    return refillStatus;
  }

  render() {
    const attrs = this.props.attributes;
    const id = this.props.id;
    const name = attrs.prescriptionName;

    let action = [];

    // Show tracking if applicable
    action.push(this.showTracking());

    // Show Refill prescription button or refill status
    action.push(this.showRefillStatus());

    // Show 'Message Provider' link when refillsRemaining === 0
    action.push(this.showMessageProvider());

    return (
      <div className="rx-prescription">
        <div className="rx-prescription-inner cf">
          <input type="hidden" name="refillId" value={id}/>
          <h3 className="rx-prescription-title" title={name}>
            <Link to={`/rx/prescription/${id}`}>
              {name}
            </Link>
          </h3>
          <div className="rx-prescription-number">
            Prescription <abbr title="number">#</abbr>: {attrs.prescriptionNumber}
          </div>
          <div className="rx-prescription-facility">
            Facility name: {attrs.facilityName}
          </div>
          <div className="rx-prescription-refilled">
            Last fill date: {moment(attrs.dispensedDate).format('L')}
          </div>
          <div className="rx-prescription-countaction">
            <RefillsRemainingCounter
                remaining={attrs.refillRemaining}/>
            <div className="rx-prescription-action">
              {action}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Prescription.propTypes = {
  id: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  attributes: React.PropTypes.shape({
    prescriptionId: React.PropTypes.number.isRequired,
    prescriptionNumber: React.PropTypes.string.isRequired,
    prescriptionName: React.PropTypes.string.isRequired,
    refillSubmitDate: React.PropTypes.string,
    refillDate: React.PropTypes.string.isRequired,
    refillRemaining: React.PropTypes.number.isRequired,
    facilityName: React.PropTypes.string.isRequired,
    orderedDate: React.PropTypes.string.isRequired,
    quantity: React.PropTypes.number.isRequired,
    expirationDate: React.PropTypes.string.isRequired,
    dispensedDate: React.PropTypes.string,
    stationNumber: React.PropTypes.string,
    isRefillable: React.PropTypes.bool.isRequired,
    isTrackable: React.PropTypes.bool.isRequired,
  }).isRequired
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = {
  openRefillModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Prescription);
