import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  validateField,
  dateFormat,
  displayProviderName,
} from '../../util/helpers';
import { selectCernerPilotFlag } from '../../util/selectors';
import ExtraDetails from '../shared/ExtraDetails';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';
import { ACTIVE_NON_VA } from '../../util/constants';

const NonVaPrescription = prescription => {
  const isCernerPilot = useSelector(selectCernerPilotFlag);

  const content = () => {
    return (
      <div className="medication-details-div vads-u-margin-bottom--3">
        <h2 className="vads-u-margin-bottom--2 no-print vads-u-margin-top--neg2">
          About this medication or supply
        </h2>
        {prescription && (
          <ExtraDetails
            {...prescription}
            page={pageType.DETAILS}
            renewalLinkShownAbove
          />
        )}
        <section>
          <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
            Status
          </h3>
          <p data-testid="rx-status" data-dd-privacy="mask">
            {ACTIVE_NON_VA}
          </p>
          <div className="no-print">
            <va-additional-info
              trigger="What does this status mean?"
              data-testid="status-dropdown"
              uswds
              data-dd-action-name={
                dataDogActionNames.detailsPage.STATUS_INFO_DROPDOWN
              }
            >
              <ul className="non-va-ul" data-testid="nonVA-status-definition">
                <li>
                  A VA provider added this medication record in your VA medical
                  records. But this isn’t a prescription you filled through a VA
                  pharmacy. You can’t request refills or manage this medication
                  through this online tool.
                </li>
                <li>
                  Non-VA medications include these types:
                  <ul>
                    <li>Prescriptions you filled through a non-VA pharmacy</li>
                    <li>
                      Over-the-counter medications, supplements, and herbal
                      remedies
                    </li>
                    <li>Sample medications a provider gave you</li>
                    <li>
                      Other drugs you’re taking that you don’t have a
                      prescription for, including recreational drugs
                    </li>
                  </ul>
                </li>
              </ul>
            </va-additional-info>
          </div>
        </section>
        <section>
          <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
            Instructions
          </h3>
          <p data-testid="rx-instructions">
            {prescription.sig || 'Instructions not available'}
          </p>
        </section>
        {!isCernerPilot && (
          <section>
            <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
              Reason for use
            </h3>
            <p data-testid="rx-reason-for-use">
              {prescription.indicationForUse || 'Reason for use not available'}
            </p>
          </section>
        )}
        <section>
          <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
            When you started taking this medication
          </h3>
          <p data-testid="rx-dispensed-date">
            {dateFormat(prescription.dispensedDate, null, 'Date not available')}
          </p>
        </section>
        <section>
          <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
            Documented by
          </h3>
          <p data-testid="rx-documented-by" data-dd-privacy="mask">
            {displayProviderName(
              prescription?.providerFirstName,
              prescription?.providerLastName,
            )}
          </p>
        </section>
        <section>
          <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
            Documented at this facility
          </h3>
          <p data-testid="rx-documented-at" data-dd-privacy="mask">
            {prescription.facilityName || 'VA facility name not available'}
          </p>
        </section>
        <section>
          <h3 className="vads-u-font-size--source-sans-normalized vads-u-font-family--sans">
            Provider notes
          </h3>
          <p data-dd-privacy="mask">
            {validateField(
              (prescription.remarks ?? '') +
                (prescription.disclaimer ? ` ${prescription.disclaimer}` : ''),
            )}
          </p>
        </section>
      </div>
    );
  };
  return <div>{content()}</div>;
};

NonVaPrescription.propTypes = {
  prescription: PropTypes.object,
};

export default NonVaPrescription;
