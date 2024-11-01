import React from 'react';
import NeedHelpSection from '../components/DownloadRecords/NeedHelpSection';

const DownloadReportPage = () => {
  return (
    <div>
      <h1>Download your medical records reports</h1>
      <p className="vads-u-margin--0">
        Download your VA medical records as a single report (called your VA Blue
        Button® report). Or find other reports to download.
      </p>
      <div className="vads-u-background-color--gray-lightest vads-u-padding-y--1 vads-u-padding-x--4 vads-u-margin-top--1">
        <p className="vads-u-margin--0">
          Records in these reports last updated at 1:47 p.m. [time zone] on June
          23, 2024
        </p>
      </div>
      <h2>Download your VA Blue Button report</h2>
      <p className="vads-u-margin--0 vads-u-margin-bottom--1">
        First, select the types of records you want in your report. Then
        download.
      </p>
      <va-link-action
        href="/my-health/medical-records/download/date-range"
        label="Select records and download"
        text="Select records and download"
      />
      <h2>Other reports you can download</h2>
      <va-accordion bordered>
        <va-accordion-item
          bordered="true"
          header="Continuity of care document (VA Health Summary)"
        >
          <p className="vads-u-margin--0">
            This Continuity of Care Document (CCD) is a summary of your VA
            medical records that you can share with non-VA providers in your
            community. It includes your allergies, medications, recent lab
            results, and more.
          </p>
          <p>
            You can download this report in .xml format, a standard file format
            that works with other providers’ medical records systems.
          </p>
          <button className="link-button">
            <va-icon icon="file_download" size={3} /> Download .xml file
          </button>
        </va-accordion-item>
        <va-accordion-item
          bordered="true"
          header="Self-entered health information"
        >
          <p className="vads-u-margin--0">
            This report includes all the health information you entered yourself
            in the previous version of My HealtheVet.
          </p>
          <p>
            Your VA health care team can’t access this self-entered information
            directly. If you want to share this information with your care team,
            print this report and bring it to your next appointment.
          </p>
          <button className="link-button">
            <va-icon icon="file_download" size={3} /> Download PDF
          </button>
        </va-accordion-item>
      </va-accordion>
      <p className="vads-u-margin--0 vads-u-margin-top--2">
        <strong>Note:</strong> Blue Button and the Blue Button logo are
        registered service marks owned by the U.S. Department of Health and
        Human Services.
      </p>
      <NeedHelpSection />
    </div>
  );
};

export default DownloadReportPage;
