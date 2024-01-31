import React from 'react';
import MobileAppCallout from '@department-of-veterans-affairs/platform-site-wide/MobileAppCallout';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderDOB } from '@@vap-svc/util/personal-information/personalInformationUtils';
import { generatePdf } from '~/platform/pdf';
import { formatFullName } from '../../../common/helpers';
import { getServiceBranchDisplayName } from '../../helpers';
import recordEvent from '~/platform/monitoring/record-event';
import { PROFILE_PATHS } from '../../constants';
import { DISCHARGE_CODE_MAP } from './constants';

const ProofOfVeteranStatus = ({
  dob,
  militaryInformation,
  totalDisabilityRating,
  userFullName = {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
  mockUserAgent,
}) => {
  const { first, middle, last, suffix } = userFullName;

  const userAgent =
    mockUserAgent || navigator.userAgent || navigator.vendor || window.opera;

  const isMobile =
    (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) ||
    /android/i.test(userAgent);

  const eligibilityMap = militaryInformation.serviceHistory.serviceHistory.map(
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
      fullName: formatFullName({ first, middle, last, suffix }),
      serviceHistory: militaryInformation.serviceHistory.serviceHistory.map(
        item => {
          return {
            ...item,
            branchOfService: getServiceBranchDisplayName(item.branchOfService),
          };
        },
      ),
      totalDisabilityRating,
      dob: renderDOB(dob),
      image: {
        title: 'V-A logo',
        url: '/img/design/logo/logo-black-and-white.png',
      },
    },
  };

  const createPdf = () => {
    recordEvent({
      event: 'file_download',
      'click-url': PROFILE_PATHS.MILITARY_INFORMATION,
      'file-name': 'Veteran status card',
      'file-extension': 'pdf',
    });

    generatePdf('veteranStatus', 'Veteran status card', pdfData, !isMobile);
  };

  return (
    <>
      {militaryInformation.serviceHistory.serviceHistory.length > 0 &&
      eligibilityMap.includes('Y') ? (
        <div id="proof-of-veteran-status">
          <h2 className="vads-u-font-size--h3 vads-u-margin-top--4 vads-u-margin-bottom--1p5">
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
          <div className="vads-l-grid-container--full vads-u-padding-y--2">
            <div className="vads-l-row">
              <div className="vads-l-col--12 xsmall-screen:vads-l-col--12 small-screen:vads-l-col--7 medium-screen:vads-l-col--5 ">
                <img
                  width="100%"
                  src="/img/proof-of-veteran-status-card-example.png"
                  alt="sample proof of veteran status card featuring name, date of birth, disability rating and period of service"
                />
              </div>
            </div>
          </div>
          <div className="vads-u-font-size--md">
            <va-link
              download
              filetype="PDF"
              // exception to eslint: the url is a dynamically generated blob url
              // eslint-disable-next-line no-script-url
              href="javascript:void(0)"
              text="Download Veteran status card"
              onClick={createPdf}
            />
          </div>
          <div className="vads-u-margin-y--4">
            <MobileAppCallout
              headingText="Get proof of Veteran status on your mobile device"
              bodyText={
                <>
                  You can use our mobile app to get proof of Veteran status. To
                  get started, download the{' '}
                  <strong> VA: Health and Benefits </strong> mobile app.
                </>
              }
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

ProofOfVeteranStatus.propTypes = {
  dob: PropTypes.string,
  militaryInformation: PropTypes.object,
  mockUserAgent: PropTypes.string,
  totalDisabilityRating: PropTypes.number,
  userFullName: PropTypes.object,
};

const mapStateToProps = state => ({
  dob: state.vaProfile?.personalInformation?.birthDate,
  militaryInformation: state.vaProfile?.militaryInformation,
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  userFullName: state.vaProfile?.hero?.userFullName,
});

export default connect(mapStateToProps)(ProofOfVeteranStatus);
