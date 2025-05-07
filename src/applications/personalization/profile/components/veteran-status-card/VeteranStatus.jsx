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

  const userHasRequiredCardData = !!(
    data?.attributes?.veteranStatus === 'confirmed' &&
    serviceHistory.length &&
    formattedFullName
  );

  const renderAlert = () => {
    const notConfirmedReason = data?.attributes?.notConfirmedReason;
    if (pdfError) {
      return (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          class="vads-u-margin-bottom--3"
          visible
        >
          <h2 slot="headline">Something went wrong</h2>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            We’re sorry. Try to download your Veteran Status Card later.
          </p>
        </va-alert>
      );
    }
    if (!formattedFullName || systemError || notConfirmedReason === 'ERROR') {
      return (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">Something went wrong</h2>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            We’re sorry. Try to view your Veteran Status Card later.
          </p>
        </va-alert>
      );
    }
    if (!userHasRequiredCardData) {
      if (notConfirmedReason === 'NOT_TITLE_38') {
        return (
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
          >
            <h2 slot="headline">
              You’re not eligible for a Veteran Status Card
            </h2>
            <p className="vads-u-margin-top--0">
              To get a Veteran Status Card, you must have received an honorable
              discharge for at least one period of service.
            </p>
            <p className="vads-u-margin-bottom--0">
              If you think your discharge status is incorrect, call the Defense
              Manpower Data Center at{' '}
              <va-telephone contact={CONTACTS.DS_LOGON} /> (
              <va-telephone contact={CONTACTS[711]} tty />
              ). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
            </p>
          </va-alert>
        );
      }
      return (
        <va-alert
          close-btn-aria-label="Close notification"
          status="warning"
          visible
        >
          <h2 slot="headline">
            There’s a problem with your discharge status records
          </h2>
          <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
            We’re sorry. To fix the problem with your records, call the Defense
            Manpower Data Center at <va-telephone contact={CONTACTS.DS_LOGON} />{' '}
            (<va-telephone contact={CONTACTS[711]} tty />
            ). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
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
            {userHasRequiredCardData && (
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
        createPdf={!isLoading && userHasRequiredCardData ? createPdf : null}
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
};

const mapStateToProps = state => ({
  serviceHistory:
    state.vaProfile?.militaryInformation.serviceHistory.serviceHistory,
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  userFullName: state.vaProfile?.hero?.userFullName,
  edipi: state.user?.profile?.edipi,
});

export default connect(mapStateToProps)(VeteranStatus);
