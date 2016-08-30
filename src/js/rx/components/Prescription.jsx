import React from 'react';
import moment from 'moment';

import { Link } from 'react-router';

import MessageProviderLink from './MessageProviderLink';
import RefillsRemainingCounter from './RefillsRemainingCounter';
import TrackPackageLink from './TrackPackageLink';
import SubmitButton from './SubmitButton';

class Prescription extends React.Component {
  render() {
    const attrs = this.props.attributes;
    const id = this.props.id;
    const name = attrs['prescription-name'];
    const remaining = attrs['refill-remaining'];

    let action;
    let messageProvider;

    // TODO: Refillable is currently always false.
    // Switch to using refillable when it's working.
    if (remaining === 0) {
      messageProvider = <MessageProviderLink/>;
    } else {
      action = (
        <SubmitButton
            cssClass="usa-button-outline rx-prescription-button"
            text="Refill Prescription"/>
      );
    }

    if (attrs['is-trackable']) {
      action = (
        <TrackPackageLink
            className="usa-button"
            text="Track package"/>
      );
    } else {
      action = <div className="rx-prescription-refill-requested">Refill requested</div>;
    }

    const actionableContent = (
      <div className="rx-prescription-action">
        {action}
        {messageProvider}
      </div>
    );

    return (
      <div className="rx-prescription"
          key={id}
          id={`rx-${id}`}>
        <div className="rx-prescription-inner cf">
          <h3 className="rx-prescription-title" title={name}>
            <Link to={`/rx/prescription/${id}`}>
              {name}
            </Link>
          </h3>
          <div className="rx-prescription-number">
            Prescription <abbr title="number">#</abbr>: {attrs['prescription-id']}
          </div>
          <div className="rx-prescription-facility">
            Facility name: {attrs['facility-name']}
          </div>
          <div className="rx-prescription-refilled">
            Last refilled: {moment(attrs['refill-date']).format('ll')}
          </div>
          <div className="rx-prescription-countaction">
            <RefillsRemainingCounter
                remaining={attrs['refill-remaining']}/>
            {actionableContent}
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

export default Prescription;
