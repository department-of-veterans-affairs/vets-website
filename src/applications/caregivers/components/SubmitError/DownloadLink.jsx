import React, { useState, useEffect } from 'react';
import moment from 'moment';

import formConfig from 'applications/caregivers/config/form';
import environment from 'platform/utilities/environment';
import { submitTransform } from 'applications/caregivers/helpers';
import { apiRequest } from 'platform/utilities/api';

const DownLoadLink = ({ form }) => {
  const [PDFLink, setPDFLink] = useState(null);
  const formData = submitTransform(formConfig, form);

  useEffect(
    () => {
      apiRequest(
        `${environment.API_URL}/v0/caregivers_assistance_claims/download_pdf`,
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
    },
    [formData],
  );

  return (
    <div className="vads-u-margin-top--2">
      <a href={PDFLink} target="_blank" rel="noreferrer noopener">
        <i
          aria-hidden="true"
          role="img"
          className="fas fa-download vads-u-padding-right--1"
        />
        Download your completed application
        <span className="sr-only">
          `dated ${moment(Date.now()).format('MMM D, YYYY')}`
        </span>{' '}
        <dfn>
          <abbr title="Portable Document Format">(PDF)</abbr>
        </dfn>
      </a>
    </div>
  );
};

export default DownLoadLink;
