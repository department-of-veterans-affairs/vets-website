import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

import {
  VaProcessList,
  VaProcessListItem,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings';

const ProcessList = ({ isAccredited, id }) => {
  return (
    <div>
      {!isAccredited ? (
        <div>
          <VaProcessList>
            <VaProcessListItem header="Download and save both forms">
              <p>
                First, complete and save your VA Form 22-10216 as a PDF.
                <span className="vads-u-margin-y--2 vads-u-display--inline-block">
                  <VaLink
                    download
                    filetype="PDF"
                    href={`${environment.API_URL}/v0/education_benefits_claims/download_pdf/${id}`}
                    fileName="Name"
                    text="Download VA Form 22-10216"
                  />
                </span>
                <span className="vads-u-display--inline-block">
                  Then, navigate to{' '}
                  <VaLink
                    external
                    text="VA Form 22-10215"
                    href="/school-administrators/85-15-rule-enrollment-ratio"
                  />{' '}
                </span>{' '}
                to fill it out. Once completed, save it as a PDF on your device.
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Upload the forms to the Education File Upload Portal">
              <p>
                Visit the{' '}
                <va-link
                  external
                  text="Education File Upload Portal"
                  href="https://www.my.va.gov/EducationFileUploads/s/"
                />
                , and upload both your saved VA Form 22-10216 and VA Form
                22-10215.
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Submit your forms">
              <p>Once uploaded, click submit to finalize your request.</p>
            </VaProcessListItem>
          </VaProcessList>
        </div>
      ) : (
        <div>
          <VaProcessList>
            <VaProcessListItem header="Download and save your form">
              <p>
                Make sure that your completed form is saved as a PDF on your
                device.
                <span className="vads-u-margin-y--2 vads-u-display--inline-block">
                  <va-link
                    download
                    filetype="PDF"
                    href={`${environment.API_URL}/v0/education_benefits_claims/download_pdf/${id}`}
                    // fileName={''}
                    text="Download VA Form 22-10216"
                  />
                </span>
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Upload the form to the Education File Upload Portal">
              <p>
                Visit the{' '}
                <va-link
                  external
                  text="Education File Upload Portal"
                  href="https://www.my.va.gov/EducationFileUploads/s/"
                />
                , and upload your saved VA Form 22-10216.
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Submit your form">
              <p>Once uploaded, click submit to finalize your request.</p>
            </VaProcessListItem>
          </VaProcessList>
        </div>
      )}
    </div>
  );
};

ProcessList.propTypes = {
  id: PropTypes.string,
  isAccredited: PropTypes.bool,
};

export default ProcessList;
