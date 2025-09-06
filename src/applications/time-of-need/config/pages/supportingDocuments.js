import React from 'react';
import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

// Wrapper (still named fileUploadUi so existing call sites stay the same)
export const fileUploadUi = (options = {}) =>
  fileInputMultipleUI({
    required: Object.prototype.hasOwnProperty.call(options, 'required')
      ? options.required
      : false,
    title: 'Upload file',
    addAnotherLabel: 'Upload another file',
    accept:
      '.pdf,.jpg,.jpeg,.png,.gif,.tif,.tiff,.bmp,.txt,application/pdf,image/jpeg,image/png,image/gif,image/tiff,text/plain',
    maxSize: 50 * 1024 * 1024,
    maxTotalSize: 150 * 1024 * 1024,
    hint: 'You can select multiple files at once or upload them one at a time.',
    errorMessages: {
      maxSize:
        'Each file must be smaller than 50MB. Remove files that are too large and try again.',
      maxTotalSize:
        'Total size of PDF files can’t exceed 150MB. Remove some files and try again.',
      accept:
        'One or more files is in an unsupported format. Remove them and try again.',
    },
    fileUploadUrl: '/v0/mock-upload',
    ...options,
  });

// Schema
export const timeOfNeedAttachments = fileInputMultipleSchema();

// Description component (updated to reference VA Form 40-xxxx)
export const SupportingFilesDescription = () => (
  <>
    <AutoSaveNotice />
    <h3 className="vads-u-margin-top--0">Upload supporting files</h3>
    <p className="vads-u-margin-top--1">
      If you have supporting files readily available for your VA Form 40-xxxx
      application, you can upload them to help us make a determination.
    </p>
    <p>
      You can upload your files from the device you’re using to submit this
      application, such as your computer, tablet, or mobile phone.
    </p>

    <va-accordion bordered>
      <va-accordion-item header="What types of files can I upload?">
        <p className="vads-u-font-weight--bold">
          You can upload a copy of the Veteran’s or their sponsor’s DD214 or
          other separation papers. This helps us determine eligibility for
          burial in a VA national cemetery.
        </p>
        <p className="vads-u-margin-top--1">
          You can also upload an affidavit (a written statement of facts
          confirmed by an oath or affirmation) showing that you are:
        </p>
        <ul>
          <li>The applicant’s court‑appointed representative</li>
          <li>
            The applicant’s caregiver (including a spouse or other relative)
          </li>
          <li>An attorney or agent acting under a durable power of attorney</li>
          <li>
            The manager or principal officer of an institution where the
            applicant is being cared for
          </li>
        </ul>
        <p className="vads-u-margin-top--2">
          To show authority to prepare the application, you may upload one of
          these forms:
        </p>
        <ul>
          <li>
            Appointment of Veterans Service Organization as Claimant’s
            Representative (VA Form 40-xxxx)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-22/"
              text="Download VA Form 40-xxxx (PDF, 4 pages)"
              filetype
            />
          </li>
          <li className="vads-u-margin-top--1">
            Appointment of Individual as Claimant’s Representative (VA Form
            40-xxxx)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-40-xxxx/" // TODO: replace with correct 40-xxxx resource if available
              text="Download VA Form 40-xxxx (PDF, 3 pages)"
              filetype
            />
          </li>
        </ul>
        <p className="vads-u-margin-top--2">
          For an unmarried adult child of a Veteran or service member, you may
          also upload medical evidence about the child’s disability. These files
          should include:
        </p>
        <ul>
          <li>The date the disability began</li>
          <li>A description of the physical or mental disability</li>
          <li>How dependent the child with a disability is on the Veteran</li>
          <li>The child’s mental status</li>
        </ul>
      </va-accordion-item>

      <va-accordion-item header="Can I mail or fax files?">
        <p>
          We can process your request faster if you upload files here. If you
          can’t upload:
        </p>
        <ol>
          <li>Make copies of the files.</li>
          <li>
            Write your name and confirmation number on every page. (You’ll
            receive a confirmation number after you submit this application.)
          </li>
          <li>
            Mail them to:
            <address className="vads-u-margin-y--1">
              NCA Intake Center
              <br />
              P.O. Box 5237
              <br />
              Janesville, WI 53547
            </address>
            Or fax them to the National Cemetery Scheduling Office:{' '}
            <va-telephone contact="8554808294" />
          </li>
        </ol>
      </va-accordion-item>
    </va-accordion>

    <div className="vads-u-margin-top--2">
      <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
        Guidelines for uploading a file:
      </p>
      <ul className="vads-u-margin-top--0">
        <li>
          File types: .pdf, .jpg, .jpeg, .png, .gif, .tiff, .bmp, .txt (max 50MB
          each)
        </li>
        <li>Maximum total PDF file size: 150MB</li>
      </ul>
    </div>
  </>
);
