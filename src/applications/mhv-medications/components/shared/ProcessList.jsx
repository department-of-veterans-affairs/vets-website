import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import { trackingConfig } from './TrackingInfo';

const ProcessList = ({ stepGuideProps }) => {
  const {
    dispensedDate,
    prescriptionName,
    processSteps,
    title,
    refillSubmitDate,
    status,
    trackingList,
  } = stepGuideProps;

  const trackingInfo = trackingList?.length > 0 ? trackingList[0] : {};
  const { trackingNumber, carrier, completeDateTime } = trackingInfo;
  const carrierConfig = trackingConfig[carrier?.toLowerCase()];

  const orderedMoreThanFifteenDaysAgo = () => {
    const today = new Date();
    const fifteenDaysAgo = new Date(completeDateTime);
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() + 15);

    return today > fifteenDaysAgo;
  };

  const url = carrierConfig
    ? carrierConfig.url + trackingNumber
    : trackingNumber;
  const label = carrierConfig ? carrierConfig.label : carrier;

  const renderStaticProcessSteps = () => {
    return (
      <va-process-list>
        {processSteps.map((step, index) => (
          <va-process-list-item key={index} header={step.header}>
            {step.content}
          </va-process-list-item>
        ))}
      </va-process-list>
    );
  };

  const renderProcessList = () => {
    switch (status) {
      case 'Shipped':
        return (
          <>
            <va-process-list>
              <va-process-list-item
                checkmark
                header="We received your refill request"
                status-text={`Step 1: Completed on ${dateFormat(
                  refillSubmitDate,
                )}`}
              />
              <va-process-list-item
                checkmark
                header="We processed your refill"
                status-text={`Step 2: Completed on ${dateFormat(
                  dispensedDate,
                )}`}
              />
              <va-process-list-item
                checkmark
                header="We shipped your refill"
                status-text={`Step 3: Completed on ${dateFormat(
                  completeDateTime,
                )}`}
              >
                {!orderedMoreThanFifteenDaysAgo() && (
                  <>
                    <section className="vads-u-margin-bottom--3">
                      <p className="vads-u-margin-bottom--0">
                        <strong>Tracking number:</strong>
                      </p>

                      <p
                        className="vads-u-margin--0"
                        data-testid="tracking-number"
                      >
                        {trackingNumber}
                      </p>

                      <a href={url} rel="noreferrer">
                        Track your package with {label}
                      </a>
                    </section>

                    <section>
                      <h4 className="vads-u-font-size--base vads-u-line-height--4 vads-u-font-family--sans vads-u-margin-top--0p5 vads-u-margin-bottom--0 vads-u-margin-right--0p5">
                        Prescriptions in this package:
                      </h4>
                      <ul className="vads-u-margin--0">
                        <li
                          className="vads-u-line-height--4"
                          data-testid="rx-name"
                          data-dd-privacy="mask"
                        >
                          {prescriptionName}
                        </li>
                      </ul>
                    </section>
                  </>
                )}
              </va-process-list-item>
            </va-process-list>
          </>
        );

      case 'Active: Submitted':
        return (
          <>
            <va-process-list>
              <va-process-list-item
                checkmark
                header="We received your refill request"
                status-text={`Step 1: Completed on ${dateFormat(
                  refillSubmitDate,
                )}`}
              >
                <p>Check back for updates.</p>
              </va-process-list-item>
              <va-process-list-item
                pending
                header="We will process your refill request"
                status-text="Step 2: Not started"
              />
              <va-process-list-item
                pending
                header="We will ship your refill"
                status-text="Step 3: Not started"
              />
            </va-process-list>
          </>
        );

      case 'Active: Refill in process':
        return (
          <>
            <va-process-list>
              <va-process-list-item
                checkmark
                header="We received your refill request"
                status-text={`Step 1: Completed on ${dateFormat(
                  refillSubmitDate,
                )}`}
              />
              <va-process-list-item
                active
                header="We’re processing your refill request"
                status-text="Step 2: In process"
              >
                <p>
                  We expect to fill it on Month DD, YYYY. If you need it sooner,
                  call your VA pharmacy at 123-456-7890.
                </p>
              </va-process-list-item>
              <va-process-list-item
                pending
                header="We will ship your refill"
                status-text="Step 3: Not started"
              />
            </va-process-list>
          </>
        );

      case 'Active':
        return (
          <>
            <va-process-list>
              <va-process-list-item
                checkmark
                header="We received your refill request"
                status-text={`Step 1: Completed on ${dateFormat(
                  refillSubmitDate,
                )}`}
              />
              <va-process-list-item
                checkmark
                header="We processed your refill"
                status-text={`Step 2: Completed on ${dateFormat(
                  dispensedDate,
                )}`}
              />
              <va-process-list-item
                pending
                header="We will ship your refill"
                status-text="Step 3: Not started"
              />
            </va-process-list>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section>
      <div className="no-print vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4 vads-u-border-bottom--2px vads-u-border-color--gray-light" />
      <h2
        className="vads-u-margin-top--0 vads-u-margin-bottom--3"
        data-testid="progress-list-header"
      >
        {title}
      </h2>
      {processSteps ? renderStaticProcessSteps() : renderProcessList()}
    </section>
  );
};

ProcessList.propTypes = {
  dispensedDate: PropTypes.string,
  title: PropTypes.string.isRequired,
  processSteps: PropTypes.array,
  refillSubmitDate: PropTypes.string,
  status: PropTypes.string,
  trackingList: PropTypes.array,
};

export default ProcessList;
