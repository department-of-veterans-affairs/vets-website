import React from 'react';
import environment from 'platform/utilities/environment';
import { isVeteran } from '../utils/helpers';
import SupportingFilesCollapsibleSection from './SupportingFilesCollapsibleSection';

export default function SupportingFilesDescription(props) {
  const sponsorOrVet = isVeteran(props.formData) ? '' : "sponsor's";

  return (
    <div>
      <div>
        {environment.isProduction() ? (
          <h3 className="vads-u-font-size--h5">
            Upload your supporting documents{' '}
          </h3>
        ) : (
          <h3 className="vads-u-font-size--h5">
            Upload your supporting files{' '}
          </h3>
        )}
        {environment.isProduction() ? (
          <p>
            If you have supporting documents readily available, you can upload
            them to help us make a determination quickly.{' '}
          </p>
        ) : (
          <p>
            If you have supporting files readily available, you can upload them
            to help us make a determination. If you don't have service history
            files, you can still apply and we'll request them for you.{' '}
          </p>
        )}
        {environment.isProduction() ? (
          <p>
            You'll need to scan your documents onto the device you're using to
            submit this application, such as your computer, tablet, or mobile
            phone. You can upload your document from there.{' '}
          </p>
        ) : (
          <p>
            You can upload your files from the device you're using to submit
            this application, such as your computer, tablet, or mobile phone.{' '}
          </p>
        )}
        {!environment.isProduction() ? (
          <SupportingFilesCollapsibleSection />
        ) : (
          <>
            <div>
              <va-additional-info trigger="What kinds of documents should I provide?">
                <h4 className="vads-u-font-size--h6">
                  If you're applying for yourself:
                </h4>
                <br />
                <p>
                  You'll need a copy of your {sponsorOrVet} DD214 or other
                  separation papers. This will help us figure out if you qualify
                  for burial in a VA national cemetery based on your{' '}
                  {sponsorOrVet} military status and service history. If you
                  don't have these documents, you can still apply—and we'll
                  request the documents for you.
                </p>
                <br />
                <h4 className="vads-u-font-size--h6">
                  If you're applying on behalf of someone else:
                </h4>
                <br />
                <p>
                  You'll need to provide supporting documents or an affidavit (a
                  written statement of facts confirmed by an oath or
                  affirmation) showing that you're:
                </p>
                <ul>
                  <li>
                    The applicant's court-appointed representative,{' '}
                    <strong>or</strong>
                  </li>
                  <li>
                    The applicant's caregiver (including a spouse or other
                    relative), <strong>or</strong>
                  </li>
                  <li>
                    An attorney or agent acting on behalf of the applicant under
                    a durable power of attorney, <strong>or</strong>
                  </li>
                  <li>
                    The manager or principal officer of an institution in which
                    the applicant is being cared for
                  </li>
                </ul>

                <br />
                <h4 className="vads-u-font-size--h6">
                  If you’re applying for an unmarried adult child of a Veteran
                  or service member:
                </h4>
                <br />
                <p>
                  You’ll need to provide supporting documents with information
                  about the adult child’s disability. The Veteran or guardian of
                  the child should also ask the child’s current doctor to verify
                  the documents. These documents should include all of the
                  following information:
                </p>
                <ul>
                  <li>
                    The date of the disability’s onset, <strong>and</strong>
                  </li>
                  <li>
                    A description of the disability, mental or physical,{' '}
                    <strong>and</strong>
                  </li>
                  <li>
                    A description of how dependent the disabled child is on the
                    Veteran, <strong>and</strong>
                  </li>
                  <li>The marital status of the child</li>
                  <br />
                  <br />
                </ul>
              </va-additional-info>
            </div>
            <va-additional-info trigger="Can I mail or fax documents?">
              <p>
                We can process your request more quickly if you upload your
                documents here. If you can't upload your documents:
              </p>
              <ol>
                <li>Make copies of the documents.</li>
                <li>
                  Make sure you write your name and confirmation number on every
                  page. You will receive a confirmation number once you submit
                  this application.
                </li>
                <li>
                  Submit application and supporting documents to the VA by mail:
                </li>
              </ol>
              <br />
              <p>
                <div className="mail-fax-address">
                  <div>NCA Intake Center</div>
                  <div>P.O. Box 5237</div>
                  <div>Janesville, WI 53547</div>
                </div>
              </p>
              <br />
              <strong>Or</strong>
              <br />
              <br />
              <p>
                Fax documents to the National Cemetery Scheduling Office:{' '}
                <va-telephone contact="8558408299" />
              </p>
              <br />
            </va-additional-info>
          </>
        )}
      </div>
      Guidelines for uploading a file:
      {environment.isProduction() ? (
        <ul>
          <li>You can upload a .pdf file</li>
          <li>Your file should be no larger than 15MB</li>
        </ul>
      ) : (
        <ul>
          <li>You can only upload .pdf files.</li>
          <li>Your file should be no larger than 15MB.</li>
        </ul>
      )}
    </div>
  );
}
