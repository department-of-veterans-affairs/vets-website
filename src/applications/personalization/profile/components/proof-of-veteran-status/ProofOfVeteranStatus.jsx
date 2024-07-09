import React from 'react';
import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { generatePdf } from '~/platform/pdf';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { formatFullName } from '../../../common/helpers';
import { getServiceBranchDisplayName } from '../../helpers';
import { DISCHARGE_CODE_MAP } from './constants';

const ProofOfVeteranStatus = ({
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
  const { first, middle, last, suffix } = userFullName;

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;

  const isMobile =
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
    /android/i.test(userAgent);

  const eligibilityMap = serviceHistory.map(
    service =>
      service.characterOfDischargeCode
        ? DISCHARGE_CODE_MAP[service.characterOfDischargeCode].indicator
        : 'N',
  );

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
    },
  };

  const createPdf = () => {
    generatePdf('veteranStatus', 'Veteran status card', pdfData, !isMobile);
  };

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

        {serviceHistory.length > 0 && eligibilityMap.includes('Y') ? (
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

        {serviceHistory.length > 0 &&
        !eligibilityMap.includes('Y') &&
        eligibilityMap.includes('N') ? (
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
          >
            <>
              <p className="vads-u-margin-top--0">
                Our records show that you’re not eligible for a Veteran status
                card. To get a Veteran status card, you must have received an
                honorable discharge for at least one period of service.
              </p>
              <p>
                If you think your discharge status is incorrect, call the
                Defense Manpower Data Center at{' '}
                <va-telephone contact={CONTACTS.DS_LOGON} /> (
                <va-telephone contact={CONTACTS[711]} tty />
                ). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m.
                ET.
              </p>
            </>
          </va-alert>
        ) : null}

        {serviceHistory.length === 0 ||
        (!eligibilityMap.includes('Y') && !eligibilityMap.includes('N')) ? (
          <va-alert
            close-btn-aria-label="Close notification"
            status="warning"
            visible
          >
            <>
              <p className="vads-u-margin-top--0">
                We’re sorry. There’s a problem with your discharge status
                records. We can’t provide a Veteran status card for you right
                now.
              </p>
              <p>
                To fix the problem with your records, call the Defense Manpower
                Data Center at <va-telephone contact={CONTACTS.DS_LOGON} /> (
                <va-telephone contact={CONTACTS[711]} tty />
                ). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m.
                ET.
              </p>
            </>
          </va-alert>
        ) : null}
      </div>
    </>
  );
};

ProofOfVeteranStatus.propTypes = {
  edipi: PropTypes.string,
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

export default connect(mapStateToProps)(ProofOfVeteranStatus);
