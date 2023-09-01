import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';

const ExtraDetails = rx => {
  const { refillStatus } = rx;
  return (
    <div className="shipping-info no-print">
      {refillStatus === 'unknown' && (
        <div className="unknownIcon">
          <div>
            We’re sorry. There’s a problem with our system. You can’t manage
            this prescription online right now.
            <div className="vads-u-margin-top--1">
              Check back later. Or call your VA pharmacy at{' '}
              <va-telephone contact="3538675309" /> (
              <va-telephone contact="711" tty />
              ).
            </div>
          </div>
        </div>
      )}
      {refillStatus === 'refillinprocess' && (
        <div>
          <div
            className="refillProcessIcon"
            data-testid="rx-refillinprocess-info"
          >
            Refill in process. We expect to fill it on{' '}
            {dateFormat(rx.refillDate, 'MMMM D, YYYY')}
          </div>
          <div className="vads-u-margin-top--1 vads-u-padding-right--2">
            If you need it sooner. Or call your VA pharmacy at{' '}
            <va-telephone contact="3538675309" /> (
            <va-telephone contact="711" tty />
            ).
          </div>
        </div>
      )}
      {refillStatus === 'submitted' && (
        <div className="submittedIcon">
          We got your request on{' '}
          {dateFormat(rx.refillSubmitDate, 'MMMM D, YYYY')}. Check back for
          updates.
        </div>
      )}
      {refillStatus === 'expired' && (
        <div className="no-print">
          <p className="vads-u-margin-y--0">
            This prescription is too old to refill. If you need more, request a
            renewal.
          </p>
          <va-link href="/" text="Learn how to renew prescriptions." />
        </div>
      )}
      {refillStatus === 'discontinued' && (
        <div className="no-print">
          <p className="vads-u-margin-y--0">
            You can’t refill this prescription. if you need more, send a message
            to your care team.
          </p>
          <va-link href="/" text="Compose a message" />
        </div>
      )}
      {refillStatus === 'transferred' && (
        <div className="no-print">
          <p className="vads-u-margin-y--0">
            To manage this prescription, go to our My VA Health portal.
          </p>
          <va-link href="/" text="Go to your prescription in My VA Health" />
        </div>
      )}
      {refillStatus === 'non-va' && (
        <div className="no-print">
          <p className="vads-u-margin-y--0">
            This isn’t a prescription that you filled through a VA pharmacy. You
            can’t manage this medication in this online tool.
          </p>
        </div>
      )}
    </div>
  );
};

ExtraDetails.propTypes = {
  rx: PropTypes.shape({
    refillStatus: PropTypes.string,
  }),
};

export default ExtraDetails;
