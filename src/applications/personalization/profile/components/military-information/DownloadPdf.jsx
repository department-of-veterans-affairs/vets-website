import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderDOB } from '@@vap-svc/util/personal-information/personalInformationUtils';
import { generatePdf } from '~/platform/pdf';
import { formatFullName } from '../../../common/helpers';

import recordEvent from '~/platform/monitoring/record-event';
import { PROFILE_PATHS } from '../../constants';

const DownloadPdf = ({
  dob,
  militaryInformation,
  totalDisabilityRating,
  userFullName = {
    first: '',
    middle: '',
    last: '',
    suffix: '',
  },
}) => {
  const { first, middle, last, suffix } = userFullName;

  const createPdf = () => {
    const pdfData = {
      title: `Veteran status card for ${formatFullName({
        first,
        middle,
        last,
        suffix,
      })}`,
      details: {
        fullName: formatFullName({ first, middle, last, suffix }),
        serviceHistory: militaryInformation.serviceHistory.serviceHistory,
        totalDisabilityRating,
        dob: renderDOB(dob),
        image: {
          title: 'V-A logo',
          url: 'https://www.va.gov/img/design/logo/logo-black-and-white.png',
        },
      },
    };

    recordEvent({
      event: 'file_download',
      'click-url': PROFILE_PATHS.MILITARY_INFORMATION,
      'file-name': 'Veteran status card',
      'file-extension': 'pdf',
    });

    generatePdf('veteranStatus', 'Veteran status card', pdfData, true);
  };

  return (
    <div className="vads-u-margin-top--4">
      <va-button
        onClick={() => createPdf()}
        text="Download Veteran status card"
      />
    </div>
  );
};

DownloadPdf.propTypes = {
  dob: PropTypes.string,
  militaryInformation: PropTypes.object,
  totalDisabilityRating: PropTypes.number,
  userFullName: PropTypes.object,
};

const mapStateToProps = state => ({
  dob: state.vaProfile?.personalInformation?.birthDate,
  militaryInformation: state.vaProfile?.militaryInformation,
  totalDisabilityRating: state.totalRating?.totalDisabilityRating,
  userFullName: state.vaProfile?.hero?.userFullName,
});

export default connect(mapStateToProps)(DownloadPdf);
