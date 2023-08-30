import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat } from '../../util/helpers';
import FillRefillButton from '../shared/FillRefillButton';

const MedicationsListCard = props => {
  const { rx } = props;
  let history = false;
  let isExpired = false;
  if (rx.refillStatus === 'expired') {
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

  return (
    <div className="rx-card-container vads-u-background-color--white vads-u-margin-y--1 vads-u-border--1px vads-u-border-color--gray-medium no-break">
      <div className="rx-card-detials vads-u-padding--2">
        <h3 className="vads-u-font-weight--bold">
          <Link
            className="vads-u-margin-y--0p5 vads-u-font-size--h4"
            to={`/${rx.prescriptionId}`}
            data-testid="medications-history-details-link"
          >
            {rx.prescriptionName}
          </Link>
        </h3>
        {rx.dispensedDate ? (
          <div>
            Last filled on {dateFormat(rx.dispensedDate, 'MMMM D, YYYY')}
          </div>
        ) : (
          <div>You haven’t filled this prescription yet.</div>
        )}
        <div>Refills left: {rx.refillRemaining}</div>
        <div className="link-to-details vads-u-font-weight--bold no-print" />
        {history === true && extraDetails()}
        {rx && <FillRefillButton {...rx} />}
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
