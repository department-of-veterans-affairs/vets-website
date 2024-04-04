import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { dateFormat } from '../../util/helpers';
import { dispStatusObj } from '../../util/constants';
import CallPharmacyPhone from './CallPharmacyPhone';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

const ExtraDetails = rx => {
  const ssoe = useSelector(isAuthenticatedWithSSOe);
  const { dispStatus, cmopDivisionPhone, refillRemaining } = rx;
  let noRefillRemaining = false;
  if (refillRemaining === 0 && dispStatus === 'Active') {
    noRefillRemaining = true;
  }
  return (
    <div className="shipping-info" id="status-description">
      {dispStatus === dispStatusObj.unknown && (
        <div className="statusIcon unknownIcon" data-testid="unknown">
          <div>
            We’re sorry. There’s a problem with our system. You can’t manage
            this prescription online right now.
            <p className="vads-u-margin-top--1">
              Call your VA pharmacy
              <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
            </p>
          </div>
        </div>
      )}
      {dispStatus === dispStatusObj.refillinprocess && (
        <div className="statusIcon refillProcessIcon">
          <p data-testid="rx-refillinprocess-info">
            We expect to fill it on {dateFormat(rx.refillDate, 'MMMM D, YYYY')}.
          </p>
          <p className="vads-u-margin-top--1 vads-u-padding-right--2">
            If you need it sooner, call your VA pharmacy
            <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
          </p>
        </div>
      )}
      {dispStatus === dispStatusObj.submitted && (
        <p
          className="statusIcon submittedIcon"
          data-testid="submitted-refill-request"
        >
          We got your request on{' '}
          {dateFormat(rx.refillSubmitDate, 'MMMM D, YYYY')}. Check back for
          updates.
        </p>
      )}
      {dispStatus === dispStatusObj.activeParked && (
        <div>
          <p className="vads-u-margin-y--0" data-testid="VA-prescription">
            You can request this prescription when you need it.
          </p>
        </div>
      )}
      {dispStatus === dispStatusObj.expired && (
        <div>
          <p className="vads-u-margin-y--0" data-testid="expired">
            You have no refills left. If you need more, request a renewal.
          </p>
          <va-link
            href="/my-health/medications/about/accordion-renew-rx"
            text="Learn how to renew prescriptions"
            data-testid="learn-to-renew-precsriptions-link"
          />
        </div>
      )}
      {dispStatus === dispStatusObj.discontinued && (
        <div>
          <p className="vads-u-margin-y--0" data-testid="discontinued">
            You can’t refill this prescription. If you need more, send a message
            to your care team.
          </p>
          <va-link
            href={mhvUrl(ssoe, 'secure-messaging')}
            text="Compose a message on the My HealtheVet website"
            data-testid="discontinued-compose-message-link"
          />
        </div>
      )}
      {dispStatus === dispStatusObj.transferred && (
        <div>
          <p className="vads-u-margin-y--0" data-testid="transferred">
            To manage this prescription, go to our My VA Health portal.
          </p>
          <va-link
            href="/"
            text="Go to your prescription in My VA Health"
            data-testid="prescription-VA-health-link"
          />
        </div>
      )}
      {dispStatus === dispStatusObj.nonVA && (
        <div>
          <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
            This isn’t a prescription that you filled through a VA pharmacy. You
            can’t manage this medication in this online tool.
          </p>
        </div>
      )}
      {dispStatus === dispStatusObj.onHold && (
        <div className="no-print">
          <p className="vads-u-margin-y--0" data-testid="active-onHold">
            We put a hold on this prescription. If you need it now, call your VA
            pharmacy
            <CallPharmacyPhone cmopDivisionPhone={cmopDivisionPhone} />
          </p>
        </div>
      )}
      {dispStatus === dispStatusObj.active &&
        noRefillRemaining && (
          <div className="no-print">
            <p
              className="vads-u-margin-y--0"
              data-testid="active-no-refill-left"
            >
              You have no refills left. If you need more, request a renewal.
            </p>
            <va-link
              href="/my-health/medications/about/accordion-renew-rx"
              text="Learn how to renew prescriptions"
              data-testid="learn-to-renew-prescriptions-link"
            />
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
