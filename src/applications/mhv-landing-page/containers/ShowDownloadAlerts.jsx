import React from 'react';
import { useSelector } from 'react-redux';
import {
  SEI_DOMAINS,
  MissingRecordsError,
} from '@department-of-veterans-affairs/mhv/exports';

import {
  AlertDownloadAccessTrouble,
  AlertDownloadSuccess,
} from '../components/alerts';

import {
  hasEdipi,
  hasMhvAccount,
  seiFailedDomains,
  seiSuccessfulDownload,
  seiFailedDownload,
  militaryServiceSuccessfulDownload,
  militaryServiceFailedDownload,
} from '../selectors';

const documentTypes = {
  SEI: 'self-entered information report',
  DOD: 'DOD military service information report',
};

const ShowDownloadAlerts = () => {
  const userHasMhvIdentifier = useSelector(hasMhvAccount);
  const userHasEdipi = useSelector(hasEdipi);
  const pdfSeiFailedDomains = useSelector(seiFailedDomains);
  const pdfSeiSuccessfulDownload = useSelector(seiSuccessfulDownload);
  const pdfSeiFailedDownload = useSelector(seiFailedDownload);
  const pdfMilitaryServiceSuccessfulDownload = useSelector(
    militaryServiceSuccessfulDownload,
  );
  const pdfMilitaryServiceFailedDownload = useSelector(
    militaryServiceFailedDownload,
  );

  if (!userHasMhvIdentifier && !userHasEdipi) return <></>;

  return (
    <>
      {pdfSeiFailedDomains?.length === SEI_DOMAINS.length ||
        (pdfSeiFailedDownload && (
          <AlertDownloadAccessTrouble
            headline={`We can’t download your ${documentTypes.SEI} right now`}
            className="vads-u-margin-bottom--1"
            testId="mhv-alert--sei-download-failed"
          />
        ))}
      {pdfSeiSuccessfulDownload && (
        <AlertDownloadSuccess
          headline="Self-entered health information download started"
          className="vads-u-margin-bottom--1"
          testId="mhv-alert--sei-download-started"
        />
      )}
      {pdfSeiSuccessfulDownload &&
        pdfSeiFailedDomains?.length !== SEI_DOMAINS.length && (
          <MissingRecordsError
            documentType={documentTypes.SEI}
            recordTypes={pdfSeiFailedDomains}
          />
        )}
      {pdfMilitaryServiceSuccessfulDownload && (
        <AlertDownloadSuccess
          headline="DOD military service information download started"
          className="vads-u-margin-bottom--1"
          testId="mhv-alert--dod-download-started"
        />
      )}
      {pdfMilitaryServiceFailedDownload && (
        <AlertDownloadAccessTrouble
          headline={`We can’t download your ${documentTypes.DOD} right now`}
          className="vads-u-margin-bottom--1"
          testId="mhv-alert--dod-download-failed"
        />
      )}
    </>
  );
};

export default ShowDownloadAlerts;
