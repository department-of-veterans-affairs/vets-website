import React from 'react';
import PropTypes from 'prop-types';
import { applicantWording } from '../../helpers/wordingCustomization';
import { getFileSize } from '../../helpers/utilities';

// Review page component for the FileUpload custompage.
export default function FileViewField(data, title = 'Supporting Documents') {
  return (
    <div>
      <h4 className="form-review-panel-page-header vads-u-font-size--h5">
        {title}
      </h4>
      {data?.length > 0 ? (
        <ul>
          {data.map(file => {
            return (
              <li key={file.name + file.size}>
                <strong>{file.attachmentId}</strong>
                <br />
                {file.name} - {getFileSize(file.size)}
              </li>
            );
          })}
        </ul>
      ) : (
        'No supporting docs to show'
      )}
    </div>
  );
}

FileViewField.propTypes = {
  data: { supportingDocuments: PropTypes.array },
};

export function AppBirthCertReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} birth certificate`;
  const data = app?.applicantBirthCertOrSocialSecCard || [];
  return FileViewField(data, title);
}

export function AppSchoolDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} school certification`;
  const data = app?.applicantSchoolCert || [];
  return FileViewField(data, title);
}

export function AppAdoptionDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} adoption documents`;
  const data = app?.applicantAdoptionPapers || [];
  return FileViewField(data, title);
}

export function AppStepDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} parental marriage documents`;
  const data = app?.applicantStepMarriageCert || [];
  return FileViewField(data, title);
}

export function AppMarriageDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} marriage documents`;
  const data = app?.applicantMarriageCert || [];
  return FileViewField(data, title);
}

export function AppMedicareABDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} medicare card (parts A/B)`;
  const data = app?.applicantMedicarePartAPartBCard || [];
  return FileViewField(data, title);
}

export function AppMedicareDDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} medicare card (part D)`;
  const data = app?.applicantMedicarePartDCard || [];
  return FileViewField(data, title);
}

export function AppOhiDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} other health insurance`;
  const data = app?.applicantOhiCard || [];
  return FileViewField(data, title);
}

export function App107959cDocReviewField(props) {
  const app = props?.data?.applicants?.[props?.pagePerItemIndex];
  const title = `${applicantWording(app)} 10-7959c upload`;
  const data = app?.applicant107959c || [];
  return FileViewField(data, title);
}
