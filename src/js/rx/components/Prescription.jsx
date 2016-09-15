import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';

import { rxStatuses } from '../config.js';
import RefillsRemainingCounter from './RefillsRemainingCounter';
import TrackPackageLink from './TrackPackageLink';
import SubmitRefill from './SubmitRefill';
import { openRefillModal } from '../actions/modal';


class Prescription extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(domEvent) {
    domEvent.preventDefault();
    const refillId = domEvent.target.refillId.value;
    const content = this.props.prescriptions.items.find((rx) => {
      return rx.id === refillId;
    });
    this.props.openRefillModal(content.attributes);
  }

  render() {
    const attrs = this.props.attributes;
    const id = this.props.id;
    const name = attrs['prescription-name'];
    const status = attrs['refill-status'];

    let action = [];

    if (attrs['is-refillable'] === true) {
      action.push(<SubmitRefill
          key={`rx-${id}-refill`}
          cssClass="rx-prescription-button"
          onSubmit={this.handleSubmit}
          refillId={id}
          text="Refill Prescription"/>);
    } else {
      const callProvider = <div key={`rx-${id}-call`}>Call Provider</div>;

      if (status !== 'active') {
        action.push((
          <div
              key={`rx-${id}-status`}
              className="rx-prescription-status">
            {rxStatuses[status]}
          </div>
        ));

        if (status !== 'submitted') {
          action.push(callProvider);
        }
      } else {
        if (attrs['is-trackable'] === true) {
          action.push(<TrackPackageLink
              key={`rx-${id}-track`}
              className="usa-button"
              text="Track package"/>);
        } else {
          action.push((
            <div
                key={`rx-${id}-requested`}
                className="rx-prescription-refill-requested">
              Refill requested
            </div>
          ));
        }

        if (attrs['refill-remaining'] === 0) {
          action.push(callProvider);
        }
      }
    }

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
            Prescription <abbr title="number">#</abbr>: {attrs['prescription-number']}
          </div>
          <div className="rx-prescription-facility">
            Facility name: {attrs['facility-name']}
          </div>
          <div className="rx-prescription-refilled">
            Last fill date: {moment(attrs['dispensed-date']).format('L')}
          </div>
          <div className="rx-prescription-countaction">
            <RefillsRemainingCounter
                remaining={attrs['refill-remaining']}/>
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
    'prescription-id': React.PropTypes.number.isRequired,
    'prescription-number': React.PropTypes.string.isRequired,
    'prescription-name': React.PropTypes.string.isRequired,
    'refill-submit-date': React.PropTypes.string,
    'refill-date': React.PropTypes.string.isRequired,
    'refill-remaining': React.PropTypes.number.isRequired,
    'facility-name': React.PropTypes.string.isRequired,
    'ordered-date': React.PropTypes.string.isRequired,
    quantity: React.PropTypes.number.isRequired,
    'expiration-date': React.PropTypes.string.isRequired,
    'dispensed-date': React.PropTypes.string,
    'station-number': React.PropTypes.string,
    'is-refillable': React.PropTypes.bool.isRequired,
    'is-trackable': React.PropTypes.bool.isRequired,
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
