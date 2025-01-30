import React from 'react';
import PropTypes from 'prop-types';
import {
  VaProcessList,
  VaProcessListItem,
  VaLink,
} from '@department-of-veterans-affairs/web-components/react-bindings';

const ProcessList = ({ isAccredited }) => {
  return (
    <div>
      {!isAccredited ? (
        <div>
          <VaProcessList>
            <VaProcessListItem header="Download and save both forms">
              <p>
                First, complete and save your VA Form 22-10216 as a PDF.
                <div className="vads-u-margin-y--2">
                  <VaLink
                    download
                    filetype="PDF"
                    href=""
                    // fileName={''}
                    text="Download VA Form 22-10216"
                  />
                </div>
                Then, navigate to{' '}
                <VaLink
                  external
                  text="VA Form 22-10215"
                  href="/education/apply-for-education-benefits/application/10215"
                />{' '}
                to fill it out. Once completed, save it as a PDF on your device.
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Upload the forms to the VA education portal">
              <p>
                Visit the{' '}
                <va-link
                  external
                  text="VA Education File Upload Portal"
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
                <div className="vads-u-margin-y--2">
                  <va-link
                    download
                    filetype="PDF"
                    href=""
                    // fileName={''}
                    text="Download VA Form 22-10216"
                  />
                </div>
              </p>
            </VaProcessListItem>
            <VaProcessListItem header="Upload the form to the VA education portal">
              <p>
                Visit the{' '}
                <va-link
                  external
                  text="VA Education File Upload Portal"
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
  isAccredited: PropTypes.bool,
};

export default ProcessList;
