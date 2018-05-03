/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  loadPrescriptions
} from '../../../rx/actions/prescriptions';

import LoadingIndicator from '@department-of-veterans-affairs/jean-pants/LoadingIndicator';

import PrescriptionCard from '../components/PrescriptionCard';

class PrescriptionsWidget extends React.Component {
  componentDidMount() {
    if (!this.props.loading) {
      this.props.loadPrescriptions({ active: true, sort: '-refill_submit_date' });
    }
  }

  render() {
    let content;

    if (this.props.loading) {
      content = <LoadingIndicator message="Loading your prescriptions..."/>;
    } else if (this.props.prescriptions) {
      content = this.props.prescriptions.map(p => <PrescriptionCard key={p.id} prescription={p}/>);
    } else {
      content = (
        <p className="rx-tab-explainer rx-loading-error">
          We couldn’t retrieve your prescriptions.
          Please refresh this page or try again later. If this problem persists, please call the Vets.gov Help Desk
          at <a href="tel:855-574-7286">1-855-574-7286</a>, TTY: <a href="tel:18008778339">1-800-877-8339</a>, Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET).
        </p>
      );
    }

    if (this.props.prescriptions) {
      if (this.props.prescriptions.length === 0) {
        content = <p>No recent prescriptions updates</p>;
      }

      return (
        <div>
          <h2>Prescription Refills</h2>
          <div>
            {content}
          </div>
          <p><Link href="/health-care/prescriptions">View all prescriptions</Link></p>
        </div>
      );
    }

    return null;
  }
}

const mapStateToProps = (state) => {
  const rxState = state.health.rx;

  let prescriptions = rxState.prescriptions.items;

  if (prescriptions) {
    prescriptions = prescriptions.filter(p => {
      const thirtyDaysAgo = moment().endOf('day').subtract(30, 'days');
      return moment(p.attributes.refillSubmitDate).isAfter(thirtyDaysAgo) || moment(p.attributes.refillDate).isAfter(thirtyDaysAgo);
    });
  }

  return {
    ...rxState.prescriptions.active,
    prescriptions,
  };
};

const mapDispatchToProps = {
  loadPrescriptions,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionsWidget);
