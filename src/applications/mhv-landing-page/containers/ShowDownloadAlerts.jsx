import React from 'react';
import { useSelector } from 'react-redux';
import {
  SEI_DOMAINS,
  MissingRecordsError,
} from '@department-of-veterans-affairs/mhv/exports';
import AccessTroubleAlertBox from '../components/nonPatientPage/AccessTroubleAlertBox';
import DownloadSuccessAlert from '../components/nonPatientPage/DownloadSuccessAlert';
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
  const userHasDoDHistoryPdf = useSelector(hasEdipi);
  const pdfSeiFailedDomains = useSelector(seiFailedDomains);
  const pdfSeiSuccessfulDownload = useSelector(seiSuccessfulDownload);
  const pdfSeiFailedDownload = useSelector(seiFailedDownload);
  const pdfMilitaryServiceSuccessfulDownload = useSelector(
    militaryServiceSuccessfulDownload,
  );
  const pdfMilitaryServiceFailedDownload = useSelector(
    militaryServiceFailedDownload,
  );

  if (!userHasMhvIdentifier && !userHasDoDHistoryPdf) return <></>;

  return (
    <>
      {pdfSeiFailedDomains?.length === SEI_DOMAINS.length ||
        (pdfSeiFailedDownload && (
          <AccessTroubleAlertBox
            documentType={documentTypes.SEI}
            className="vads-u-margin-bottom--1"
          />
        ))}
      {pdfSeiSuccessfulDownload && (
        <DownloadSuccessAlert
          documentType="Self-entered health information download"
          className="vads-u-margin-bottom--1"
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
        <DownloadSuccessAlert
          documentType="DOD military service information download"
          className="vads-u-margin-bottom--1"
        />
      )}
      {pdfMilitaryServiceFailedDownload && (
        <AccessTroubleAlertBox
          documentType={documentTypes.DOD}
          className="vads-u-margin-bottom--1"
        />
      )}
    </>
  );
};

export default ShowDownloadAlerts;
