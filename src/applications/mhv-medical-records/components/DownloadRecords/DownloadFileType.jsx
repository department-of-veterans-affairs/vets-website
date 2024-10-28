import React from 'react';
import { useHistory } from 'react-router-dom';
import NeedHelpSection from './NeedHelpSection';
import DownloadingRecordsInfo from '../shared/DownloadingRecordsInfo';

const DownloadFileType = () => {
  const history = useHistory();

  return (
    <div>
      <h1>Select records and download report</h1>
      <div
        style={{
          margin: '1.9rem 0',
        }}
      >
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
      <va-radio label="If you use assistive technology, a text file may work better for you.">
        <va-radio-option label="PDF" value="pdf" />
        <va-radio-option label="Text file" value="txt" />
      </va-radio>
      <div className="vads-u-margin-top--1">
        <DownloadingRecordsInfo />
      </div>
      <div>
        <button
          className="usa-button-secondary vads-u-margin-y--0p5"
          onClick={() => {
            history.push('/download/record-type');
          }}
        >
          <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-justify-content--center">
            <va-icon icon="navigate_far_before" size={2} />
            <span className="vads-u-margin-left--0p5">Back</span>
          </div>
        </button>
        <button
          className="vads-u-margin-y--0p5"
          onClick={() => {
            history.push('/download/record-type');
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
