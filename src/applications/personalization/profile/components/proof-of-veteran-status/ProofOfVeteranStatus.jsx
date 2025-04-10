import React, { useEffect, useState } from 'react';
import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePdf } from '~/platform/pdf';
import { focusElement } from '~/platform/utilities/ui';
import { captureError } from '~/platform/user/profile/vap-svc/util/analytics';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { apiRequest } from '~/platform/utilities/api';
import { formatFullName } from '../../../common/helpers';
import { getServiceBranchDisplayName } from '../../helpers';
import ProofOfVeteranStatusCard from './ProofOfVeteranStatusCard/ProofOfVeteranStatusCard';

const ProofOfVeteranStatus = ({
  serviceHistory = [],
  vetStatusEligibility = {},
  totalDisabilityRating,
  userFullName = {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  edipi,
  mockUserAgent,
}) => {
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState(null);
  const [shouldFocusError, setShouldFocusError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { first, middle, last, suffix } = userFullName;

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;

  const isMobile =
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
    /android/i.test(userAgent);

  const formattedFullName = formatFullName({
    first,
    middle,
    last,
    suffix,
  });

  const getLatestService = () => {
    if (serviceHistory.length) {
      const latestServiceItem = serviceHistory.length
        ? serviceHistory.reduce((latest, current) => {
            return new Date(current.endDate) > new Date(latest.endDate)
              ? current
              : latest;
          })
        : null;
      const serviceStartYear = latestServiceItem.beginDate
        ? latestServiceItem.beginDate.substring(0, 4)
        : '';
      const serviceEndYear = latestServiceItem.endDate
        ? latestServiceItem.endDate.substring(0, 4)
        : '';
      const latestServiceDateRange =
        serviceStartYear.length || serviceEndYear.length
          ? `${serviceStartYear}–${serviceEndYear}`
          : '';
      return `${getServiceBranchDisplayName(
        latestServiceItem.branchOfService,
      )} • ${latestServiceDateRange}`;
    }
    return null;
  };

  const latestService = getLatestService();

  const userHasRequiredCardData = !!(
    serviceHistory.length && formattedFullName
  );
  const hasConfirmationData = !!(data && data.attributes);
  const pdfData = {
    title: `Veteran status card for ${formattedFullName}`,
    details: {
      fullName: formattedFullName,
      latestService,
      totalDisabilityRating,
      edipi,
      image: {
        title: 'V-A logo',
        url: '/img/design/logo/logo-black-and-white.png',
      },
      seal: {
        title: 'V-A Seal',
        url: '/img/design/logo/seal-black-and-white.png',
      },
      scissors: {
        title: 'Scissors icon',
        url: '/img/scissors-black.png',
      },
    },
  };

  useEffect(() => {
    let isMounted = true;

    const fetchVerificationStatus = async () => {
      setIsLoading(true);

      try {
        const path = '/profile/vet_verification_status';
        const response = await apiRequest(path);
        if (isMounted) {
          setData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setErrors([
            "We're sorry. There's a problem with our system. We can't show your Veteran status card right now. Try again later.",
          ]);
          captureError(error, { eventName: 'vet-status-fetch-verification' });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchVerificationStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(
    () => {
      if (shouldFocusError && errors?.length > 0) {
        focusElement('.vet-status-pdf-download-error');
        setShouldFocusError(false);
      }
    },
    [shouldFocusError, errors],
  );

  const createPdf = async () => {
    setErrors(null);

    try {
      await generatePdf(
        'veteranStatusNew',
        'Veteran status card',
        pdfData,
        !isMobile,
      );
    } catch (error) {
      setErrors([
        "We're sorry. Something went wrong on our end. Please try to download your Veteran status card later.",
      ]);
      captureError(error, { eventName: 'vet-status-pdf-download' });
    }
  };

  const isVetStatusEligibilityPopulated =
    Object.keys(vetStatusEligibility).length !== 0;

  const buildContactElements = item => {
    const contactNumber = `${CONTACTS.DS_LOGON.slice(
      0,
      3,
    )}-${CONTACTS.DS_LOGON.slice(3, 6)}-${CONTACTS.DS_LOGON.slice(6)}`;
    const startIndex = item.indexOf(contactNumber);

    if (startIndex === -1) {
      return item;
    }

    const before = item.slice(0, startIndex);
    const telephone = item.slice(
      startIndex,
      startIndex + contactNumber.length + 11,
    );
    const after = item.slice(startIndex + telephone.length);

    return (
      <>
        {before}
        <va-telephone contact={contactNumber} /> (
        <va-telephone contact={CONTACTS[711]} tty />){after}
      </>
    );
  };

  const componentizedMessage = isVetStatusEligibilityPopulated
    ? vetStatusEligibility?.message.map(item => {
        return buildContactElements(item);
      })
    : null;

  const contactInfoElements = data?.message?.map(item => {
    return buildContactElements(item);
  });

  const systemErrrorAlert = (
    <va-alert close-btn-aria-label="Close notification" status="error" visible>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
        We’re sorry. There’s a problem with our system. We can’t show your
        Veteran status card right now. Try again later.
      </p>
    </va-alert>
  );

  const lighthouseApiErrorMessage = (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      {contactInfoElements?.map((message, i) => {
        if (i === 0) {
          return (
            <p key={i} className="vads-u-margin-top--0">
              {message}
            </p>
          );
        }
        return <p key={i}>{message}</p>;
      })}
    </va-alert>
  );

  const profileApiErrorMessage = (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      {componentizedMessage.map((message, i) => {
        if (i === 0) {
          return (
            <p key={i} className="vads-u-margin-top--0">
              {message}
            </p>
          );
        }
        return <p key={i}>{message}</p>;
      })}
    </va-alert>
  );

  return (
    <>
      <div id="proof-of-veteran-status">
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1p5">
          Proof of Veteran status
        </h2>
        <p className="va-introtext">
          This card identifies a Veteran of the U.S. Uniformed Services.
        </p>

        {isLoading ? (
          <va-loading-indicator
            set-focus
            message="Checking your eligibility..."
            data-testid="proof-of-status-loading-indicator"
          />
        ) : (
          <>
            {userHasRequiredCardData ? (
              <>
                {hasConfirmationData ? (
                  <>
                    {data?.attributes?.veteranStatus === 'confirmed' ? (
                      <>
                        {errors?.length > 0 ? (
                          <div className="vet-status-pdf-download-error vads-u-padding-y--2">
                            <va-alert status="error" uswds>
                              {errors[0]}
                            </va-alert>
                          </div>
                        ) : null}
                        <div className="vads-l-grid-container--full">
                          <div className="vads-l-row">
                            <ProofOfVeteranStatusCard
                              edipi={edipi}
                              formattedFullName={formattedFullName}
                              latestService={latestService}
                              totalDisabilityRating={totalDisabilityRating}
                            />
                          </div>
                        </div>
                        <div className="vads-u-font-size--md">
                          <va-link
                            active
                            filetype="PDF"
                            // exception to eslint: the url is a dynamically generated blob url
                            // eslint-disable-next-line no-script-url
                            href="javascript:void(0)"
                            text="Print your Proof of Veteran status (PDF)"
                            onClick={createPdf}
                          />
                        </div>
                        <div className="vads-u-margin-y--4">
                          <MobileAppCallout
                            headingText="Get proof of Veteran status on your mobile device"
                            bodyText={
                              <>
                                You can use our mobile app to get proof of
                                Veteran status. To get started, download the{' '}
                                <strong> VA: Health and Benefits </strong>{' '}
                                mobile app.
                              </>
                            }
                          />
                        </div>
                      </>
                    ) : null}

                    {isVetStatusEligibilityPopulated &&
                    data?.attributes?.veteranStatus === 'not confirmed' &&
                    data?.message?.length > 0 ? (
                      <>{lighthouseApiErrorMessage}</>
                    ) : null}
                  </>
                ) : null}

                {!hasConfirmationData ? <>{systemErrrorAlert}</> : null}
              </>
            ) : null}

            {!userHasRequiredCardData ? (
              <>
                {!formattedFullName ? (
                  <>{systemErrrorAlert}</>
                ) : (
                  <>
                    {errors?.length > 0 ? (
                      <>
                        <div className="vet-status-pdf-download-error vads-u-padding-y--2">
                          <va-alert status="error" uswds>
                            {errors[0]}
                          </va-alert>
                        </div>
                      </>
                    ) : null}

                    {data?.attributes?.veteranStatus === 'confirmed' ? (
                      <>{profileApiErrorMessage}</>
                    ) : null}
                    {data?.attributes?.veteranStatus === 'not confirmed' ? (
                      <>{lighthouseApiErrorMessage}</>
                    ) : null}
                  </>
                )}
              </>
            ) : null}
          </>
        )}
      </div>
    </>
  );
};

ProofOfVeteranStatus.propTypes = {
  edipi: PropTypes.number,
  mockUserAgent: PropTypes.string,
  serviceHistory: PropTypes.arrayOf(
    PropTypes.shape({
      branchOfService: PropTypes.string,
      beginDate: PropTypes.string,
      endDate: PropTypes.string,
    }).isRequired,
  ),
  totalDisabilityRating: PropTypes.number,
  userFullName: PropTypes.object,
  vetStatusEligibility: PropTypes.object,
};

const mapStateToProps = state => ({
  serviceHistory:
    state.vaProfile?.militaryInformation.serviceHistory.serviceHistory,
  vetStatusEligibility:
    state.vaProfile?.militaryInformation.serviceHistory.vetStatusEligibility,
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  userFullName: state.vaProfile?.hero?.userFullName,
  edipi: state.user?.profile?.edipi,
});

export default connect(mapStateToProps)(ProofOfVeteranStatus);
