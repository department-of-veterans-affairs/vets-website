import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add, format, compareAsc } from 'date-fns';
import NeedHelpSection from '../components/DownloadRecords/NeedHelpSection';
import { genAndDownloadCCD } from '../actions/downloads';

const { utcToZonedTime } = require('date-fns-tz');

const DownloadReportPage = () => {
  const dispatch = useDispatch();

  const generatingCCD = useSelector(state => state.mr.downloads.generatingCCD);
  const ccdError = useSelector(state => state.mr.downloads.error);
  const userName = useSelector(state => state.user.profile.userFullName);

  const CCDRetryTimestamp = useMemo(
    () => {
      const errorTimestamp = localStorage.getItem('lastCCDError');

      if (errorTimestamp !== null) {
        const retryDate = add(new Date(errorTimestamp), { hours: 24 });
        if (compareAsc(retryDate, new Date()) >= 0) {
          return format(
            utcToZonedTime(retryDate, 'America/New_York'),
            "MMMM dd, yyyy 'at' K:mm aaaa",
          );
        }
      }
      return null;
    },
    [ccdError],
  );

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
      {CCDRetryTimestamp ? (
        <va-alert
          close-btn-aria-label="Close notification"
          status="error"
          visible
        >
          <h2 slot="headline">
            We can’t download your Continuity of Care Document right now
          </h2>
          <p>
            We’re sorry. There’s a problem with our system.{' '}
            <strong>Try again after 24 hours ({CCDRetryTimestamp} ET).</strong>
          </p>
          <p className="vads-u-margin-bottom--0">
            If it still doesn’t work, call us at{' '}
            <va-telephone contact="8773270022" /> (
            <va-telephone tty contact="711" />
            ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
          </p>
        </va-alert>
      ) : (
        <></>
      )}
      <va-accordion bordered>
        <va-accordion-item
          bordered="true"
          header="Continuity of care document (VA Health Summary)"
          data-testid="ccdAccordionItem"
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
          {generatingCCD ? (
            <div id="generating-ccd-indicator">
              <va-loading-indicator
                label="Loading"
                message="Preparing your download..."
              />
            </div>
          ) : (
            <button
              className="link-button"
              onClick={() =>
                dispatch(genAndDownloadCCD(userName.first, userName.last))
              }
              data-testid="generateCcdButton"
            >
              <va-icon icon="file_download" size={3} /> Download .xml file
            </button>
          )}
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
