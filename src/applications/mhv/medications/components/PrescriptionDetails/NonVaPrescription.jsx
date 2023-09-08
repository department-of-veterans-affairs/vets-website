import React from 'react';
import PropTypes from 'prop-types';
import { validateField } from '../../util/helpers';

const NonVaPrescription = prescription => {
  const content = () => {
    const refillStatus = prescription?.refillStatus?.toString();
    return (
      <div className="medication-details-div vads-u-margin-top--2 vads-u-margin-bottom--3">
        <h2 className="vads-u-margin-y--2 no-print">About your prescription</h2>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Status
          </h3>
          <div>
            {prescription?.refillStatus === 'refillinprocess'
              ? 'Refill in process'
              : validateField(
                  refillStatus?.charAt(0).toUpperCase() +
                    refillStatus?.slice(1),
                )}
          </div>
          <div className="no-print">
            <va-additional-info trigger="What does this status mean?">
              <ul className="non-va-ul">
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
          <p>{validateField(prescription.reason)}</p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            When you started taking this medication
          </h3>
          <p>{validateField(prescription.dispensedDate, 'date')}</p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Information entered by
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
            Information entered at this facility
          </h3>
          <p>{validateField(prescription.facilityName)}</p>
        </section>
        <section>
          <h3 className="vads-u-font-size--base vads-u-font-family--sans">
            Provider notes
          </h3>
          <p>{validateField(prescription.remarks)}</p>
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
