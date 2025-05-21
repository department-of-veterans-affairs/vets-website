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
import { formatFullName } from '../../../common/helpers';
import { getServiceBranchDisplayName } from '../../helpers';
import Headline from '../ProfileSectionHeadline';
import VeteranStatusCard from './VeteranStatusCard';
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions';
import {
  NotConfirmedAlert,
  NoServiceHistoryAlert,
  SystemErrorAlert,
} from './VeteranStatusAlerts';
import LoadFail from '../alerts/LoadFail';

const VeteranStatus = ({
  militaryInformation = {},
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
  const [isLoading, setIsLoading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const { first, middle, last, suffix } = userFullName;

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const vetStatusCardToggle = useToggleValue(TOGGLE_NAMES.vetStatusStage1);

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

  const {
    serviceHistory: {
      error: serviceError,
      serviceHistory,
      vetStatusEligibility,
    },
  } = militaryInformation;

  const isServiceHistory403Error = !!serviceError?.errors?.some(
    err => err.code === '403',
  );

  const isServiceHistoryNon403Error = !!serviceError?.errors?.every(
    err => err.code !== '403',
  );

  const isServiceHistoryValid = serviceHistory?.length;

  const isCardDataValid = !!(
    !isLoading &&
    data?.attributes?.veteranStatus === 'confirmed' &&
    vetStatusEligibility?.confirmed === true &&
    isServiceHistoryValid &&
    formattedFullName
  );

  useEffect(
    () => {
      let isMounted = true;
      if (formattedFullName && isServiceHistoryValid) {
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
              captureError(error, {
                eventName: 'vet-status-fetch-verification',
              });
            }
          } finally {
            if (isMounted) {
              setIsLoading(false);
            }
          }
        };
        fetchVerificationStatus();
      }

      return () => {
        isMounted = false;
      };
    },
    [formattedFullName, isServiceHistoryValid],
  );

  const getLatestService = () => {
    if (serviceHistory?.length) {
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
      captureError(error, { eventName: 'vet-status-pdf-download' });
    }
  };

  const renderAlert = () => {
    if (isServiceHistoryNon403Error) {
      // Service history non-403 error
      return <LoadFail />;
    }
    if (isServiceHistory403Error || !isServiceHistoryValid) {
      // Service history 403 error or no service history
      return <NoServiceHistoryAlert />;
    }
    if (formattedFullName) {
      if (
        data?.attributes?.veteranStatus === 'not confirmed' &&
        data?.message?.length > 0
      ) {
        // Vet verification status warning
        return (
          <NotConfirmedAlert
            headline={data.title}
            message={data.message}
            status={data.status}
          />
        );
      }
      if (
        vetStatusEligibility?.confirmed === false &&
        vetStatusEligibility?.message?.length > 0
      ) {
        // Vet status eligibility warning
        return (
          <NotConfirmedAlert
            headline={vetStatusEligibility.title}
            message={vetStatusEligibility.message}
            status={vetStatusEligibility.status}
          />
        );
      }
    }
    if (!isCardDataValid) {
      // System error
      return <SystemErrorAlert />;
    }
    return null;
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
    if (isCardDataValid) {
      return (
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
      );
    }
    return renderAlert();
  };

  return (
    <>
      <Headline>Veteran Status Card</Headline>
      <p className="veteran-status-description">
        This card makes it easy to prove your service and access Veteran
        discounts, all while keeping your personal information secure.
      </p>
      <DowntimeNotification
        appTitle="Veteran Status Card page"
        dependencies={[externalServices.VAPRO_MILITARY_INFO]}
      >
        <div id="veteran-status">{renderContent()}</div>
        <FrequentlyAskedQuestions
          createPdf={isCardDataValid ? createPdf : null}
          pdfError={pdfError}
        />
      </DowntimeNotification>
    </>
  );
};

VeteranStatus.propTypes = {
  edipi: PropTypes.number,
  militaryInformation: PropTypes.shape({
    serviceHistory: PropTypes.shape({
      error: PropTypes.shape({
        errors: PropTypes.arrayOf(
          PropTypes.shape({
            code: PropTypes.string,
          }),
        ),
      }),
      serviceHistory: PropTypes.arrayOf(
        PropTypes.shape({
          branchOfService: PropTypes.string,
          beginDate: PropTypes.string,
          endDate: PropTypes.string,
        }),
      ),
      vetStatusEligibility: PropTypes.shape({
        confirmed: PropTypes.bool,
        title: PropTypes.string,
        message: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
  mockUserAgent: PropTypes.string,
  totalDisabilityRating: PropTypes.number,
  userFullName: PropTypes.object,
};

const mapStateToProps = state => ({
  militaryInformation: state.vaProfile?.militaryInformation,
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  userFullName: state.vaProfile?.hero?.userFullName,
  edipi: state.user?.profile?.edipi,
});

export default connect(mapStateToProps)(VeteranStatus);
