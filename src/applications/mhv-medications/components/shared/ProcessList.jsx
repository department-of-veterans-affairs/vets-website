import React from 'react';
import PropTypes from 'prop-types';
import { dateFormat } from '../../util/helpers';
import { trackingConfig } from '../../util/constants';
import { pageType } from '../../util/dataDogConstants';
import CallPharmacyPhone from './CallPharmacyPhone';

const ProcessList = ({ stepGuideProps }) => {
  const {
    dispensedDate,
    prescriptionName,
    pharmacyPhone,
    processSteps,
    title,
    refillDate,
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
    let dispStatus;
    if (status === 'Active' && completeDateTime) {
      dispStatus = 'Shipped';
    } else {
      dispStatus = status;
    }

    switch (dispStatus) {
      case 'Shipped':
        return (
          <>
            <va-process-list>
              <va-process-list-item
                data-testid="progress-step-one"
                checkmark
                header="We received your refill request"
                status-text={`Step 1: Completed on ${dateFormat(
                  refillSubmitDate,
                )}`}
              />
              <va-process-list-item
                data-testid="progress-step-two"
                checkmark
                header="We processed your refill"
                status-text={`Step 2: Completed on ${dateFormat(
                  dispensedDate,
                )}`}
              />
              <va-process-list-item
                data-testid="progress-step-three"
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
                data-testid="submitted-step-one"
                checkmark
                header="We received your refill request"
                status-text={`Step 1: Completed on ${dateFormat(
                  refillSubmitDate,
                )}`}
              >
                <p>Check back for updates.</p>
              </va-process-list-item>
              <va-process-list-item
                data-testid="submitted-step-two"
                pending
                header="We will process your refill request"
                status-text="Step 2: Not started"
              />
              <va-process-list-item
                data-testid="submitted-step-three"
                pending
                header="We will ship your refill"
                status-text="Step 3: Not started"
              />
            </va-process-list>
          </>
        );

      case 'Active: Refill in Process':
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
                  We expect to fill it on {dateFormat(refillDate)}. If you need
                  it sooner, call your VA pharmacy
                  <CallPharmacyPhone
                    cmopDivisionPhone={pharmacyPhone}
                    page={pageType.REFILL}
                  />
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
                data-testid="active-step-two"
                checkmark
                header="We processed your refill"
                status-text={`Step 2: Completed on ${dateFormat(
                  dispensedDate,
                )}`}
              />
              <va-process-list-item
                data-testid="active-step-three"
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
      <div className="no-print vads-u-margin-y--3 mobile-lg:vads-u-margin-y--4 vads-u-border-bottom--1px vads-u-border-color--gray-light" />
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
  stepGuideProps: PropTypes.object.isRequired,
};

export default ProcessList;
