import React from 'react';
import PropTypes from 'prop-types';
import { validateField, dateFormat } from '../../util/helpers';
import ExtraDetails from '../shared/ExtraDetails';

const NonVaPrescription = prescription => {
  const content = () => {
    const status = prescription?.dispStatus?.toString();
    return (
      <div className="medication-details-div vads-u-border-top--1px vads-u-border-color--gray-lighter vads-u-margin-top--2 vads-u-margin-bottom--3">
        <h2 className="vads-u-margin-y--2 no-print">
          About this medication or supply
        </h2>
        {prescription && <ExtraDetails {...prescription} />}
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Status
          </h3>
          <div data-testid="rx-status">{validateField(status)}</div>
          <div className="no-print">
            <va-additional-info
              trigger="What does this status mean?"
              data-testid="status-dropdown"
              uswds
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
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Instructions
          </h3>
          <p>{validateField(prescription.sig)}</p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Reason for use
          </h3>
          <p>{validateField(prescription.indicationForUse)}</p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            When you started taking this medication
          </h3>
          <p>{dateFormat(prescription.dispensedDate)}</p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Documented by
          </h3>
          <p>
            {validateField(
              `${prescription.providerLastName}, ${
                prescription.providerFirstName
              }`,
            )}
          </p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Documented at this facility
          </h3>
          <p>{validateField(prescription.facilityName)}</p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Provider notes
          </h3>
          <p>
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
