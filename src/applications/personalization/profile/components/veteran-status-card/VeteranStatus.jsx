import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePdf } from '~/platform/pdf';
import { captureError } from '~/platform/user/profile/vap-svc/util/analytics';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { apiRequest } from '~/platform/utilities/api';
import { focusElement } from '~/platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { formatFullName } from '../../../common/helpers';
import { getServiceBranchDisplayName } from '../../helpers';
import Headline from '../ProfileSectionHeadline';
import VeteranStatusCard from './VeteranStatusCard';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';

const VeteranStatus = ({
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
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [shouldFocusError, setShouldFocusError] = useState(false);
  const [systemError, setSystemError] = useState(false);
  const { first, middle, last, suffix } = userFullName;

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const vetStatusCardToggle = useToggleValue(TOGGLE_NAMES.vetStatusStage1);

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;

  const isMobile =
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
    /android/i.test(userAgent);

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
          setSystemError(true);
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
      if (pdfError && shouldFocusError) {
        focusElement('va-alert[status="error"]');
        setShouldFocusError(false);
      }
    },
    [pdfError, shouldFocusError],
  );

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

  const formattedFullName = formatFullName({
    first,
    middle,
    last,
    suffix,
  });

  const getLatestService = () => {
    if (serviceHistory.length) {
      const latestServiceItem = serviceHistory.reduce((latest, current) => {
        return new Date(current.endDate) > new Date(latest.endDate)
          ? current
          : latest;
      });
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
    vetStatusCardToggle,
  };

  const createPdf = async () => {
    try {
      await generatePdf(
        'veteranStatusNew',
        'Veteran status card',
        pdfData,
        !isMobile,
      );
    } catch (error) {
      setPdfError(true);
      setShouldFocusError(true);
      captureError(error, { eventName: 'vet-status-pdf-download' });
    }
  };

  const haveRequiredCardData =
    data?.attributes?.veteranStatus === 'confirmed' &&
    vetStatusEligibility?.confirmed === true &&
    serviceHistory.length > 0 &&
    formattedFullName &&
    !systemError;

  const renderAlert = () => {
    let headline;
    let messages;
    let status;

    if (pdfError) {
      // PDF download error
      headline = 'Something went wrong';
      messages = [
        'We’re sorry. Try to download your Veteran Status Card later.',
      ];
      status = 'error';
    } else if (!haveRequiredCardData) {
      if (
        formattedFullName &&
        data?.attributes?.veteranStatus === 'not confirmed' &&
        data?.message?.length > 0
      ) {
        // Lighthouse API error
        messages = data?.message?.map(item => {
          return buildContactElements(item);
        });
        status = 'warning';
      } else if (
        formattedFullName &&
        vetStatusEligibility?.confirmed === false &&
        vetStatusEligibility?.message?.length > 0
      ) {
        // Profile API error
        messages = vetStatusEligibility?.message.map(item => {
          return buildContactElements(item);
        });
        status = 'warning';
      } else {
        // System error
        headline = 'Something went wrong';
        messages = ['We’re sorry. Try to view your Veteran Status Card later.'];
        status = 'error';
      }
    }
    if (messages) {
      return (
        <va-alert
          class={pdfError ? 'vads-u-margin-bottom--3' : ''}
          close-btn-aria-label="Close notification"
          status={status}
          visible
        >
          {headline && <h2 slot="headline">{headline}</h2>}
          {messages?.map((message, i) => (
            <p
              key={i}
              className={`${i === 0 ? 'vads-u-margin-top--0' : ''} ${
                i === messages.length - 1 ? 'vads-u-margin-bottom--0' : ''
              }`}
            >
              {message}
            </p>
          ))}
        </va-alert>
      );
    }
    return null;
  };

  return (
    <>
      <Headline>Veteran Status Card</Headline>
      <p className="veteran-status-description">
        This card makes it easy to prove your service and access Veteran
        discounts, all while keeping your personal information secure.
      </p>
      <div id="veteran-status">
        {isLoading ? (
          <va-loading-indicator
            set-focus
            message="Checking your eligibility..."
            data-testid="veteran-status-loading-indicator"
          />
        ) : (
          <>
            {renderAlert()}
            {haveRequiredCardData && (
              <div className="vads-l-grid-container--full">
                <div className="vads-l-row">
                  <VeteranStatusCard
                    edipi={edipi}
                    formattedFullName={formattedFullName}
                    latestService={latestService}
                    totalDisabilityRating={totalDisabilityRating}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <FrequentlyAskedQuestions
        createPdf={!isLoading && haveRequiredCardData ? createPdf : null}
      />
    </>
  );
};

VeteranStatus.propTypes = {
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

export default connect(mapStateToProps)(VeteranStatus);
