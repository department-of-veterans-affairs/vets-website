import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import CallPharmacyPhone from './CallPharmacyPhone';

const ExtraDetails = rx => {
  const { dispStatus, cmopDivisionPhone } = rx;
  return (
    <div className="shipping-info">
      {dispStatus === 'Unknown' && (
        <div className="unknownIcon">
          <div>
            We’re sorry. There’s a problem with our system. You can’t manage
            this prescription online right now.
            <p className="vads-u-margin-top--1">
              Check back later. Or call your VA pharmacy
              <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
            </p>
          </div>
        </div>
      )}
      {dispStatus === 'Active: Refill in Process' && (
        <div>
          <p
            className="refillProcessIcon"
            data-testid="rx-refillinprocess-info"
          >
            Refill in process. We expect to fill it on{' '}
            {dateFormat(rx.refillDate, 'MMMM D, YYYY')}.
          </p>
          <p className="vads-u-margin-top--1 vads-u-padding-right--2">
            If you need it sooner, or call your VA pharmacy
            <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
          </p>
        </div>
      )}
      {dispStatus === 'Active: Submitted' && (
        <p className="submittedIcon">
          We got your request on{' '}
          {dateFormat(rx.refillSubmitDate, 'MMMM D, YYYY')}. Check back for
          updates.
        </p>
      )}
      {dispStatus === 'Expired' && (
        <div>
          <p className="vads-u-margin-y--0">
            This prescription is too old to refill. If you need more, request a
            renewal.
          </p>
          <va-link
            href="/my-health/about-medications/accordion-renew-rx"
            text="Learn how to renew prescriptions"
          />
        </div>
      )}
      {dispStatus === 'Discontinued' && (
        <div>
          <p className="vads-u-margin-y--0">
            You can’t refill this prescription. If you need more, send a message
            to your care team.
          </p>
          <va-link href="/" text="Compose a message" />
        </div>
      )}
      {dispStatus === 'Transferred' && (
        <div>
          <p className="vads-u-margin-y--0">
            To manage this prescription, go to our My VA Health portal.
          </p>
          <va-link href="/" text="Go to your prescription in My VA Health" />
        </div>
      )}
      {dispStatus === 'Active: Non-VA' && (
        <div>
          <p className="vads-u-margin-y--0">
            This isn’t a prescription that you filled through a VA pharmacy. You
            can’t manage this medication in this online tool.
          </p>
        </div>
      )}
      {dispStatus === 'Active: On Hold' && (
        <div className="no-print">
          <p className="vads-u-margin-y--0">
            We put a hold on this prescription. If you need it now, call your VA
            pharmacy at
            <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
          </p>
        </div>
      )}
    </div>
  );
};

ExtraDetails.propTypes = {
  rx: PropTypes.shape({
    dispStatus: PropTypes.string,
    cmopDivisionPhone: PropTypes.string,
  }),
};

export default ExtraDetails;
