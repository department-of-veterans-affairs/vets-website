import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { useSelector } from 'react-redux';
import content from '../../locales/en/content.json';
import ApplicationDownloadLink from '../ApplicationDownloadLink';

const SubmissionErrorAlert = () => {
  useEffect(() => {
    focusElement('.ezr-error-message');
  }, []);

  const { data: formData } = useSelector(state => state.form);

  return (
    <>
      {formData['view:isDownloadPdfEnabled'] ? (
        <div className="ezr-error-message vads-u-margin-top--5">
          <va-alert status="error" uswds>
            <h3 slot="headline">{content['alert-submission-title']}</h3>
            <div>
              <p>{content['alert-submission-primary-message']}</p>
            </div>
          </va-alert>
          <va-card background="true" class="vads-u-margin-top--2">
            <h3 className="vads-u-margin-top--0 vads-u-font-size--h4">
              Other ways to update
            </h3>
            <ul data-testid="hca-agreement-statements">
              <li>
                Call us at <va-telephone contact="8772228387" />, Monday through
                through Friday, 8:00 a.m. to 8:00 p.m. ET.,
                <strong>or</strong>
              </li>
              <li>
                Mail us a completed form <strong>or</strong>
              </li>
              <li>
                Bring your form in person to your nearest VA health facility
              </li>
            </ul>
            <p>
              <va-link
                href="/health-care/update-health-information/#how-do-i-update-my-information"
                text="Learn more about how to update your information by mail, phone, or in person"
              />
            </p>
            {formData['view:isDownloadPdfEnabled'] && (
              <div className="ezr-application--download">
                <ApplicationDownloadLink
                  linkText={content['button-pdf-download-error']}
                />
              </div>
            )}
          </va-card>
        </div>
      ) : (
        <div className="ezr-error-message vads-u-margin-top--5">
          <va-alert status="error" uswds>
            <h3 slot="headline">{content['alert-submission-title']}</h3>
            <div>
              <p>{content['alert-submission-primary-message']}</p>
              <p>{content['alert-submission-secondary-message']}</p>
            </div>
            <va-link
              href="/health-care/update-health-information/#how-do-i-update-my-information"
              text="Learn more about how to update your information by mail, phone, or in person"
            />
          </va-alert>
        </div>
      )}
    </>
  );
};

export default SubmissionErrorAlert;
