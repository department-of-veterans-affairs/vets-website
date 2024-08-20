import React from 'react';
import PropTypes from 'prop-types';
import { environment } from '@department-of-veterans-affairs/platform-utilities/exports';
import { dateFormat, pharmacyPhoneNumber } from '../../util/helpers';
import { dispStatusObj, medicationsUrls } from '../../util/constants';
import CallPharmacyPhone from './CallPharmacyPhone';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';

const ExtraDetails = rx => {
  const { dispStatus, refillRemaining } = rx;
  const pharmacyPhone = pharmacyPhoneNumber(rx);
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
          <va-icon icon="warning" size={4} aria-hidden="true" />
          <div className="vads-u-padding-left--2" data-testid="unknown-rx">
            <p className="vads-u-margin-y--0">
              We’re sorry. There’s a problem with our system. You can’t manage
              this prescription online right now.
            </p>
            <p className="vads-u-margin-y--0">
              Call your VA pharmacy
              <CallPharmacyPhone
                cmopDivisionPhone={pharmacyPhone}
                page={pageType.DETAILS}
              />
            </p>
          </div>
        </div>
      )}
      {dispStatus === dispStatusObj.refillinprocess && (
        <div
          className="statusIcon refillProcessIcon"
          data-testid="refill-in-process"
        >
          <va-icon icon="acute" size={3} aria-hidden="true" />
          <div className="vads-u-padding-left--2" data-testid="rx-process">
            <p
              data-testid="rx-refillinprocess-info"
              className="vads-u-margin-y--0"
            >
              We expect to fill it on{' '}
              {dateFormat(rx.refillDate, 'MMMM D, YYYY')}.
            </p>
            <p className="vads-u-margin-y--0" data-testid="pharmacy-phone-info">
              If you need it sooner, call your VA pharmacy
              <CallPharmacyPhone
                cmopDivisionPhone={pharmacyPhone}
                page={pageType.DETAILS}
              />
            </p>
          </div>
        </div>
      )}
      {dispStatus === dispStatusObj.submitted && (
        <p
          className="statusIcon submittedIcon"
          data-testid="submitted-refill-request"
        >
          <va-icon icon="fact_check" size={3} aria-hidden="true" />
          <div className="vads-u-padding-left--2">
            We got your request on{' '}
            {dateFormat(rx.refillSubmitDate, 'MMMM D, YYYY')}. Check back for
            updates.
          </div>
        </p>
      )}
      {dispStatus === dispStatusObj.activeParked && (
        <p className="vads-u-margin-y--0" data-testid="active-parked">
          You can request this prescription when you need it.
        </p>
      )}
      {dispStatus === dispStatusObj.expired && (
        <div>
          <p className="vads-u-margin-y--0" data-testid="expired">
            This prescription is too old to refill. If you need more, request a
            renewal.
          </p>
          <va-link
            href={medicationsUrls.MEDICATIONS_ABOUT_ACCORDION_RENEW}
            text="Learn how to renew prescriptions"
            data-testid="learn-to-renew-precsriptions-link"
            data-dd-action-name={
              dataDogActionNames.detailsPage
                .LEARN_TO_RENEW_PRESCRIPTIONS_ACTION_LINK
            }
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
            data-dd-action-name={
              dataDogActionNames.detailsPage.COMPOSE_A_MESSAGE_LINK
            }
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
          You can’t refill this prescription online right now. If you need a
          refill, call your VA pharmacy
          <CallPharmacyPhone
            cmopDivisionPhone={pharmacyPhone}
            page={pageType.DETAILS}
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
  }),
};

export default ExtraDetails;
