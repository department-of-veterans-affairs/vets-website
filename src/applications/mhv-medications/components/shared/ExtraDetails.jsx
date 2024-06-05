import React from 'react';
import PropTypes from 'prop-types';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import { dateFormat } from '../../util/helpers';
import {
  dispStatusObj,
  medicationsUrls,
  DD_ACTIONS_PAGE_TYPE,
} from '../../util/constants';
import CallPharmacyPhone from './CallPharmacyPhone';

const ExtraDetails = rx => {
  const { dispStatus, cmopDivisionPhone, refillRemaining } = rx;
  let noRefillRemaining = false;
  if (refillRemaining === 0 && dispStatus === 'Active') {
    noRefillRemaining = true;
  }
  return (
    <div
      className="shipping-info"
      id={`status-description-${rx.prescriptionId}`}
    >
      {dispStatus === dispStatusObj.unknown && (
        <div className="statusIcon unknownIcon" data-testid="unknown">
          <p>
            We’re sorry. There’s a problem with our system. You can’t manage
            this prescription online right now.
          </p>
          <p className="vads-u-margin-top--1">
            Call your VA pharmacy
            <CallPharmacyPhone
              cmopDivisionPhone={cmopDivisionPhone}
              page={DD_ACTIONS_PAGE_TYPE.DETAILS}
            />
          </p>
        </div>
      )}
      {dispStatus === dispStatusObj.refillinprocess && (
        <div className="statusIcon refillProcessIcon">
          <p data-testid="rx-refillinprocess-info">
            We expect to fill it on {dateFormat(rx.refillDate, 'MMMM D, YYYY')}.
          </p>
          <p className="vads-u-margin-top--1 vads-u-padding-right--2">
            If you need it sooner, call your VA pharmacy
            <CallPharmacyPhone
              cmopDivisionPhone={cmopDivisionPhone}
              page={DD_ACTIONS_PAGE_TYPE.DETAILS}
            />
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
        <p className="vads-u-margin-y--0" data-testid="VA-prescription">
          You can request this prescription when you need it.
        </p>
      )}
      {dispStatus === dispStatusObj.expired && (
        <div>
          <p className="vads-u-margin-y--0" data-testid="expired">
            You have no refills left. If you need more, request a renewal.
          </p>
          <va-link
            href={medicationsUrls.MEDICATIONS_ABOUT_ACCORDION_RENEW}
            text="Learn how to renew prescriptions"
            data-testid="learn-to-renew-precsriptions-link"
            data-dd-action-name={`Learn How To Renew Prescriptions Action Link - ${
              DD_ACTIONS_PAGE_TYPE.DETAILS
            }`}
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
            href={`${
              environment.BASE_URL
            }/my-health/secure-messages/new-message/`}
            text="Start a new message"
            data-testid="discontinued-compose-message-link"
            data-dd-action-name={`Compose A Message Link - ${
              DD_ACTIONS_PAGE_TYPE.DETAILS
            }`}
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
        <p className="vads-u-margin-y--0" data-testid="non-VA-prescription">
          This isn’t a prescription that you filled through a VA pharmacy. You
          can’t manage this medication in this online tool.
        </p>
      )}
      {dispStatus === dispStatusObj.onHold && (
        <p className="vads-u-margin-y--0 no-print" data-testid="active-onHold">
          We put a hold on this prescription. If you need it now, call your VA
          pharmacy
          <CallPharmacyPhone
            cmopDivisionPhone={cmopDivisionPhone}
            page={DD_ACTIONS_PAGE_TYPE.DETAILS}
          />
        </p>
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
              href={medicationsUrls.MEDICATIONS_ABOUT_ACCORDION_RENEW}
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
