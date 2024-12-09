import React, { useEffect, useState } from 'react';
import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePdf } from '~/platform/pdf';
import { focusElement } from '~/platform/utilities/ui';
import { captureError } from '~/platform/user/profile/vap-svc/util/analytics';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
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

  const latestServiceItem = serviceHistory[0];
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
  const latestService = `${getServiceBranchDisplayName(
    serviceHistory[0].branchOfService,
  )} • ${latestServiceDateRange}`;

  const pdfDataOld = {
    title: `Veteran status card for ${formattedFullName}`,
    details: {
      fullName: formattedFullName,
      serviceHistory: serviceHistory.map(item => {
        return {
          ...item,
          branchOfService: getServiceBranchDisplayName(item.branchOfService),
        };
      }),
      totalDisabilityRating,
      edipi,
      image: {
        title: 'V-A logo',
        url: '/img/design/logo/logo-black-and-white.png',
      },
    },
  };
  const pdfDataNew = {
    title: `Veteran status card for ${formattedFullName}`,
    details: {
      fullName: formattedFullName,
      serviceHistory: serviceHistory.map(item => {
        return {
          ...item,
          branchOfService: getServiceBranchDisplayName(item.branchOfService),
        };
      }),
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

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  const showNewPdf = useToggleValue(
    TOGGLE_NAMES.veteranStatusCardUseLighthouse,
  );

  useEffect(
    () => {
      if (errors?.length > 0) {
        focusElement('.vet-status-pdf-download-error');
      }
    },
    [errors],
  );

  const createPdf = async () => {
    setErrors(null);

    try {
      await generatePdf(
        isLoadingFeatureFlags || !showNewPdf
          ? 'veteranStatus'
          : 'veteranStatusNew',
        'Veteran status card',
        isLoadingFeatureFlags || !showNewPdf ? pdfDataOld : pdfDataNew,
        !isMobile,
      );
    } catch (error) {
      setErrors([
        "We're sorry. Something went wrong on our end. Please try to download your Veteran status card later.",
      ]);
      captureError(error, { eventName: 'vet-status-pdf-download' });
    }
  };

  const componentizedMessage = vetStatusEligibility.message.map(item => {
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
  });

  if (isLoadingFeatureFlags) {
    return null;
  }

  return (
    <>
      <div id="proof-of-veteran-status">
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1p5">
          Proof of Veteran status
        </h2>
        <p className="va-introtext">
          This card identifies a Veteran of the U.S. Uniformed Services.
        </p>
        {vetStatusEligibility.confirmed ? (
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
                download
                filetype="PDF"
                // exception to eslint: the url is a dynamically generated blob url
                // eslint-disable-next-line no-script-url
                href="javascript:void(0)"
                text="Download and print your Veteran status card"
                onClick={createPdf}
              />
            </div>
            <div className="vads-u-margin-y--4">
              <MobileAppCallout
                headingText="Get proof of Veteran status on your mobile device"
                bodyText={
                  <>
                    You can use our mobile app to get proof of Veteran status.
                    To get started, download the{' '}
                    <strong> VA: Health and Benefits </strong> mobile app.
                  </>
                }
              />
            </div>
          </>
        ) : null}

        {!vetStatusEligibility.confirmed &&
        vetStatusEligibility.message.length > 0 ? (
          <>
            <div>
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
            </div>
          </>
        ) : null}
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
