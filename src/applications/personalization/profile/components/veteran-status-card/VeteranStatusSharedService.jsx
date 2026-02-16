import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePdf } from '~/platform/pdf';
import { captureError } from '~/platform/user/profile/vap-svc/util/analytics';
import { apiRequest } from '~/platform/utilities/api';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { datadogRum } from '@datadog/browser-rum';
import { getServiceBranchDisplayName } from '../../helpers';
import Headline from '../ProfileSectionHeadline';
import VeteranStatusCard from './VeteranStatusCard';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';
import { DynamicVeteranStatusAlert } from './VeteranStatusAlerts';
import LoadFail from '../alerts/LoadFail';
import '../../sass/veteran-status-card.scss';
import { useBrowserMonitoring } from './hooks/useBrowserMonitoring';

const VeteranStatusSharedService = ({
  totalDisabilityRating,
  edipi,
  mockUserAgent,
}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;

  const isMobile =
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
    /android/i.test(userAgent);

  useEffect(() => {
    document.title = `Veteran Status Card | Veterans Affairs`;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchVeteranStatusCard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const path = '/veteran_status_card';
        const response = await apiRequest(path);
        if (isMounted) {
          setData(response);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          captureError(err, {
            eventName: 'vet-status-shared-service-fetch',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchVeteranStatusCard();

    return () => {
      isMounted = false;
    };
  }, []);

  // Determine if we should show the card based on the new API response
  const isCardEligible =
    data?.type === 'veteran_status_card' &&
    data?.veteran_status === 'confirmed';

  // Get formatted full name from the new API response
  const formattedFullName = data?.attributes?.full_name || '';

  // Get latest service info from the new API response
  const getLatestService = () => {
    const latestServiceData = data?.attributes?.latest_service;
    if (latestServiceData) {
      const {
        branch,
        begin_date: beginDate,
        end_date: endDate,
      } = latestServiceData;
      const serviceStartYear = beginDate ? beginDate.substring(0, 4) : '';
      const serviceEndYear = endDate ? endDate.substring(0, 4) : '';
      const latestServiceDateRange =
        serviceStartYear.length || serviceEndYear.length
          ? `${serviceStartYear}–${serviceEndYear}`
          : '';
      return `${getServiceBranchDisplayName(
        branch,
      )} • ${latestServiceDateRange}`;
    }
    return null;
  };

  const latestService = getLatestService();

  // Get disability rating from API response or fall back to Redux state
  const disabilityRating =
    data?.attributes?.disability_rating ?? totalDisabilityRating;

  // Get EDIPI from API response or fall back to Redux state
  const cardEdipi = data?.attributes?.edipi ?? edipi;

  const pdfData = {
    title: `Veteran status card for ${formattedFullName}`,
    details: {
      fullName: formattedFullName,
      latestService,
      totalDisabilityRating: disabilityRating,
      edipi: cardEdipi,
      image: {
        title: 'VA logo',
        url: '/img/design/logo/logo-black-and-white.png',
      },
      seal: {
        title: 'VA Seal',
        url: '/img/design/logo/seal-black-and-white.png',
      },
      scissors: {
        title: 'Scissors icon',
        url: '/img/scissors-black.png',
      },
    },
  };

  useBrowserMonitoring();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  const monitorPdfGeneration = useToggleValue(TOGGLE_NAMES.vetStatusPdfLogging);
  const monitoringEnabled =
    isLoadingFeatureFlags === false && monitorPdfGeneration === true;

  const createPdf = async () => {
    try {
      await generatePdf(
        'veteranStatusNew',
        'Veteran status card',
        pdfData,
        !isMobile,
      );
    } catch (err) {
      setPdfError(true);
      if (monitoringEnabled) {
        datadogRum.addError(
          err,
          'Profile - Veteran Status Card - PDF generation error',
        );
      }
      captureError(err, { eventName: 'vet-status-pdf-download' });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <va-loading-indicator
          set-focus
          message="Checking your eligibility..."
          data-testid="veteran-status-loading-indicator"
        />
      );
    }

    // Handle fetch error
    if (error) {
      return <LoadFail />;
    }

    // Handle alert response type (ineligible or error scenarios)
    if (data?.type === 'veteran_status_alert') {
      return (
        <>
          <p>
            This card makes it easy to prove your service and access Veteran
            discounts, all while keeping your personal information secure.
          </p>
          <DynamicVeteranStatusAlert attributes={data.attributes} />
          <FrequentlyAskedQuestions createPdf={null} pdfError={pdfError} />
        </>
      );
    }

    // Handle card response type (eligible)
    return (
      <>
        <p>
          This card makes it easy to prove your service and access Veteran
          discounts, all while keeping your personal information secure.
        </p>
        {isCardEligible && (
          <div className="vads-l-grid-container--full">
            <div className="vads-l-row">
              <VeteranStatusCard
                edipi={cardEdipi}
                formattedFullName={formattedFullName}
                latestService={latestService}
                totalDisabilityRating={disabilityRating}
              />
            </div>
          </div>
        )}
        <FrequentlyAskedQuestions
          createPdf={isCardEligible ? createPdf : null}
          pdfError={pdfError}
        />
      </>
    );
  };

  return (
    <>
      <Headline>Veteran Status Card</Headline>
      <DowntimeNotification
        appTitle="Veteran Status Card page"
        dependencies={[externalServices.VAPRO_MILITARY_INFO]}
      >
        {renderContent()}
      </DowntimeNotification>
    </>
  );
};

VeteranStatusSharedService.propTypes = {
  edipi: PropTypes.number,
  mockUserAgent: PropTypes.string,
  totalDisabilityRating: PropTypes.number,
};

const mapStateToProps = state => ({
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  edipi: state.user?.profile?.edipi,
});

export default connect(mapStateToProps)(VeteranStatusSharedService);
