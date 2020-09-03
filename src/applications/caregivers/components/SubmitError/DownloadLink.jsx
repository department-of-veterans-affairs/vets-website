import React, { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';
import moment from 'moment';

import formConfig from 'applications/caregivers/config/form';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { submitTransform } from 'applications/caregivers/helpers';
import { apiRequest } from 'platform/utilities/api';
import { isValidForm } from 'platform/forms-system/src/js/validation';
import { createFormPageList } from 'platform/forms-system/src/js/helpers';

const DownLoadLink = ({ form }) => {
  const [PDFLink, setPDFLink] = useState(null);
  const formData = submitTransform(formConfig, form);
  const veteranFullName = form.data.veteranFullName;
  const pageList = createFormPageList(formConfig);
  const isFormValid = isValidForm(form, pageList);

  useEffect(
    () => {
      try {
        if (isFormValid.isValid) {
          apiRequest(
            `${
              environment.API_URL
            }/v0/caregivers_assistance_claims/download_pdf`,
            {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'application/json',
                'Source-App-Name': 'caregivers-10-10cg-',
              },
            },
          )
            .then(response => {
              return response.blob();
            })
            .then(blob => {
              const url = URL.createObjectURL(blob);
              setPDFLink(url);
            });
          recordEvent({ event: 'caregivers-10-10cg-pdf-download-success' });
        }
      } catch (error) {
        Sentry.withScope(scope => {
          scope.setExtra('error', error);
          scope.setFingerprint(['{{default}}', scope._tags?.source]);
          Sentry.captureMessage(
            `caregivers-10-10cg-pdf-failure: ${error.message}`,
          );
        });
      }
      recordEvent({ event: 'caregivers-10-10cg-pdf-failure' });
    },
    [formData, isFormValid],
  );

  return (
    <div className="vads-u-margin-top--2">
      <a
        href={PDFLink}
        download={`10-10CG_${veteranFullName.first}_${veteranFullName.last}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Download 1010CG filled out PDF form"
      >
        <i
          aria-hidden="true"
          role="img"
          className="fas fa-download vads-u-padding-right--1"
        />
        Download your completed application
        <span className="sr-only vads-u-margin-right--0p5">
          `dated ${moment(Date.now()).format('MMM D, YYYY')}`
        </span>
        <dfn>
          <abbr title="Portable Document Format">(PDF)</abbr>
        </dfn>
      </a>
    </div>
  );
};

export default DownLoadLink;
