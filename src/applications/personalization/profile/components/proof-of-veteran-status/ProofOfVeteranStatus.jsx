import React, { useEffect, useState } from 'react';
import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePdf } from '~/platform/pdf';
import { focusElement } from '~/platform/utilities/ui';
import { captureError } from '~/platform/user/profile/vap-svc/util/analytics';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { formatFullName } from '../../../common/helpers';
import { getServiceBranchDisplayName } from '../../helpers';

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

  const pdfData = {
    title: `Veteran status card for ${formatFullName({
      first,
      middle,
      last,
      suffix,
    })}`,
    details: {
      fullName: formatFullName({
        first,
        middle,
        last,
        suffix,
      }),
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
        'veteranStatus',
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

  return (
    <>
      <div id="proof-of-veteran-status">
        <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--1p5">
          Proof of Veteran status
        </h2>
        <p>
          You can use your Veteran status card to get discounts offered to
          Veterans at many restaurants, hotels, stores, and other businesses.
        </p>
        <p>
          <strong>Note: </strong>
          This card doesn’t entitle you to any VA benefits.
        </p>

        {vetStatusEligibility.confirmed ? (
          <>
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

            {errors?.length > 0 ? (
              <div className="vet-status-pdf-download-error vads-u-padding-y--2">
                <va-alert status="error" uswds>
                  {errors[0]}
                </va-alert>
              </div>
            ) : null}

            <div className="vads-l-grid-container--full vads-u-padding-y--2">
              <div className="vads-l-row">
                <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--7 medium-screen:vads-l-col--5 ">
                  <img
                    width="100%"
                    src="/img/proof-of-veteran-status-card-sample.png"
                    alt="sample proof of veteran status card featuring name, date of birth, disability rating and period of service"
                  />
                </div>
              </div>
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
