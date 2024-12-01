import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  generatePdfScaffold,
  crisisLineHeader,
  reportGeneratedBy,
  txtLine,
} from '@department-of-veterans-affairs/mhv/exports';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import PropTypes from 'prop-types';
import NeedHelpSection from './NeedHelpSection';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';
import {
  getNameDateAndTime,
  makePdf,
  processList,
  getLastUpdatedText,
  generateTextFile,
  formatNameFirstLast,
} from '../../util/helpers';
import DownloadSuccessAlert from '../shared/DownloadSuccessAlert';
import { refreshExtractTypes } from '../../util/constants';
import {
  generateDownloadIntro,
  generateDownloadContent,
} from '../../util/pdfHelpers/download';

const DownloadFileType = props => {
  const history = useHistory();
  const { runningUnitTest } = props;
  const user = useSelector(state => state.user.profile);
  const download = useSelector(state => state.mr.download.downloadList);
  const refresh = useSelector(state => state.mr.refresh);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [fileType, setFileType] = useState(null);

  const lastUpdatedText = getLastUpdatedText(
    refresh.status,
    refreshExtractTypes.VPR,
  );

  const generateDownloadPdf = async () => {
    setDownloadStarted(true);
    const { title, subject, preface } = generateDownloadIntro(
      download,
      lastUpdatedText,
    );
    const scaffold = generatePdfScaffold(user, title, subject, preface);
    const pdfData = { ...scaffold, ...generateDownloadContent(download) };
    const pdfName = `VA-Download-list-${getNameDateAndTime(user)}`;
    makePdf(pdfName, pdfData, 'Download', runningUnitTest);
  };

  const generateDownloadListItemTxt = item => {
    setDownloadStarted(true);
    return `
${txtLine}\n\n
${item.name}\n
Date received: ${item.date}\n
Location: ${item.location}\n
Reaction: ${processList(item.reactions)}\n`;
  };

  const generateDownloadTxt = async () => {
    const content = `
${crisisLineHeader}\n\n
Download\n
${formatNameFirstLast(user.userFullName)}\n
Date of birth: ${formatDateLong(user.dob)}\n
${reportGeneratedBy}\n
This list includes download you got at VA health facilities and from providers or pharmacies in our community care network. It may not include vaccines you got outside our network.\n
For complete records of your allergies and reactions to vaccines, review your allergy records.\n
Showing ${download.length} records from newest to oldest
${download.map(entry => generateDownloadListItemTxt(entry)).join('')}`;

    const fileName = `VA-download-list-${getNameDateAndTime(user)}`;

    generateTextFile(content, fileName);
  };

  const handleDownload = () => {
    if (fileType === 'pdf') {
      // Create and generate the PDF
      generateDownloadPdf();
    } else if (fileType === 'txt') {
      // Create and download a text file
      generateDownloadTxt();
    }
  };

  return (
    <div>
      <h1>Select records and download report</h1>
      <div style={{ margin: '1.9rem 0' }}>
        <va-segmented-progress-bar
          current={3}
          heading-text="Select file type"
          total={3}
        />
      </div>
      <h2>Select file type</h2>
      <div className="vads-u-border-top--1px vads-u-border-bottom--1px vads-u-border-color--gray-light">
        <p>
          You’re downloading <strong>2,782 total records</strong>
        </p>
      </div>
      <va-radio
        label="If you use assistive technology, a text file may work better for you."
        onValueChange={event => setFileType(event.detail.value)}
      >
        <va-radio-option label="PDF" value="pdf" />
        <va-radio-option label="Text file" value="txt" />
      </va-radio>
      {downloadStarted && <DownloadSuccessAlert />}
      <div className="vads-u-margin-top--1">
        <DownloadingRecordsInfo />
      </div>
      <div className="medium-screen:vads-u-display--flex medium-screen:vads-u-flex-direction--row vads-u-align-items--center">
        <button
          className="usa-button-secondary vads-u-margin-y--0p5"
          onClick={handleDownload}
        >
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center">
            <va-icon icon="navigate_far_before" size={2} />
            <span className="vads-u-margin-left--0p5">Back</span>
          </div>
        </button>
        <button
          className="vads-u-margin-y--0p5"
          onClick={() => {
            history.push('/download');
          }}
        >
          Download report
        </button>
      </div>
      <NeedHelpSection />
    </div>
  );
};

export default DownloadFileType;

DownloadFileType.propTypes = {
  runningUnitTest: PropTypes.bool,
};
