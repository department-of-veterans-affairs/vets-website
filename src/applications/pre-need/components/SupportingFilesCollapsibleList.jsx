import React from 'react';
import CollapsiblePanel from './CollapsiblePanel';

const SupportingFilesOrAffidavitInfo = () => {
  return (
    <>
      <p>
        You can also upload supporting files or an affidavit (a written
        statement of facts confirmed by an oath or affirmation) showing that
        you’re:
      </p>
      <ul>
        <li>
          The applicant’s court-appointed representative, <strong>or</strong>
        </li>
        <li>
          The applicant’s caregiver (including a spouse or other relative),{' '}
          <strong>or</strong>
        </li>
        <li>
          An attorney or agent acting on behalf of the applicant under a durable
          power of attorney, <strong>or</strong>
        </li>
        <li>
          The manager or principal officer of an institution in which the
          applicant is being cared for{' '}
        </li>
      </ul>
    </>
  );
};

const BehalfOfSomeoneElseContent = () => {
  return (
    <>
      <p>
        You’ll need a copy of their sponsor’s DD214 or other separation papers.
        If the applicant is a service member or Veteran, you will need to
        provide a copy of their DD214 or other separation papers.
      </p>
      <SupportingFilesOrAffidavitInfo />
      <p>
        <strong>
          If you’re applying for an unmarried adult child of a Veteran or
          service member,{' '}
        </strong>
        you can upload supporting files with information about the adult child’s
        disability. The Veteran or guardian of the child should also ask the
        child’s current doctor to verify the files. These files should include
        the following details:
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
          A description of how dependent the disabled child is on the Veteran,{' '}
          <strong>and</strong>
        </li>
        <li>The marital status of the child</li>
      </ul>
    </>
  );
};

const MailOrFaxFilesContent = () => {
  return (
    <>
      <p>
        We can process your request more quickly if you upload your files here.
        If you can’t upload your files:
      </p>
      <ol>
        <li>Make copies of the files.</li>
        <li>
          Make sure you write your name and confirmation number on every page.
          You will receive a confirmation number once you submit this
          application.
        </li>
        <li>
          Submit application and supporting files to the VA by mail:
          <p>
            <div className="mail-fax-address">
              <div>NCA Intake Center</div>
              <div>P.O. Box 5237</div>
              <div>Janesville, WI 53547</div>
            </div>
          </p>
          <strong>Or</strong>
          <p>
            Fax them to the National Cemetery Scheduling Office:{' '}
            <va-telephone contact="8558408299" />.
          </p>
        </li>
      </ol>
    </>
  );
};

const CollapsibleList = () => {
  return (
    <div id="SupportingFiles-collapsiblePanel">
      <div className="input-section">
        <div
          id="3-collapsiblePanel"
          className="usa-accordion-bordered form-review-panel"
          data-chapter="applicantInformation"
        >
          <div name="chapterapplicantInformationScrollElement" />
          <h4 className="vads-u-font-size--h5">
            What kinds of files can I upload?
          </h4>
          <ul className="usa-unstyled-list">
            <li>
              <CollapsiblePanel
                header="If you're applying for yourself"
                pageContent={
                  <p>
                    You can upload a copy of your or your sponsor’s DD214 or
                    other separation papers. This will help us figure out if you
                    qualify for burial in a VA national cemetery based on you or
                    your sponsor’s military status and service history.
                  </p>
                }
              />
            </li>
            <li>
              <CollapsiblePanel
                header="If you're applying on behalf of someone else"
                pageContent={<BehalfOfSomeoneElseContent />}
              />
            </li>
            <li>
              <CollapsiblePanel
                header="Can I mail or fax files?"
                pageContent={<MailOrFaxFilesContent />}
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleList;
