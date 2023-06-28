import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat } from '../../util/helpers';

const MedicationsListCard = props => {
  const { rx } = props;
  let history = false;
  let isExpired = false;
  if (rx.refillStatus === 'expired' || rx.refillStatus === 'discontinued') {
    isExpired = true;
  }
  if (rx.refillStatus === 'refillinprocess') {
    history = true;
  }
  const extraDetails = () => {
    return (
      <>
        <div className="shipping-info vads-u-background-color--gray-light no-print">
          <div className="shipping-icon" />
          <div className="shipping-body">
            {/* TODO: dont have a way to diferentiate if a refill has been submitted vs is in process vs shipped. change logic once that has been sorted out by backend */}
            <div>Refill in process.</div>
            <div>
              {/* TODO: dont have an 'expected' value coming in from backend, add expected date once that value starts coming in.  */}
              {/* Expected delivery date is{' '}
              <span className="vads-u-font-weight--bold">
                {dateFormat(rx.orderedDate, 'MMMM D, YYYY')}
              </span> */}
            </div>
          </div>
        </div>
        <div className="print-only">Refill in process.</div>
      </>
    );
  };

  const fillRefillButton = () => {
    if (rx.isRefillable) {
      return (
        <button className="no-print" type="button">
          Refill medication
        </button>
      );
    }
    if (rx.dispensedDate && rx.isRefillable === false) {
      return (
        <button className="no-print" type="button">
          Fill medication
        </button>
      );
    }
    return null;
  };

  return (
    <div className="rx-card-container vads-u-background-color--gray-lightest vads-u-margin-y--1 no-break">
      <div className="rx-card-detials vads-u-padding--2">
        <h4 className="vads-u-font-weight--bold">{rx.prescriptionName}</h4>
        <div>Prescription number: {rx.prescriptionId}</div>
        <div>Refills left: {rx.refillRemaining}</div>
        {rx.dispensedDate && (
          <>Dispensed on {dateFormat(rx.dispensedDate, 'MMMM D, YYYY')}</>
        )}
        <div className="link-to-details vads-u-font-weight--bold no-print">
          <Link
            className="vads-u-margin-y--0p5"
            to={`/prescriptions/${rx.prescriptionId}`}
          >
            Medication history and details
            <span className="righ-angle">
              {' '}
              <i aria-hidden="true" className="fas fa-angle-right" />
            </span>
          </Link>
        </div>
        {history === true && extraDetails()}
        {!isExpired && fillRefillButton()}
        {isExpired && (
          <>
            <div className="no-print">
              <p className="vads-u-margin-y--0">this medication is expired.</p>
              <va-link href="/" text="Learn how to renew medications." />
            </div>
            <div className="print-only">this medication is expired.</div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicationsListCard;

MedicationsListCard.propTypes = {
  rx: PropTypes.object,
};
