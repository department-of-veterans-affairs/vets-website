import React from 'react';

export const evidenceChoiceIntroTitle =
  'Supporting documents and additional forms for your disability claim';

export const evidenceChoiceIntroQuestion =
  'Are there any supporting documents or additional forms that you want us to review with your claim?';

const evidenceChoiceIntroDescription = (
  <p>Support your claim by providing documents from any of these sources</p>
);

const receivingCareHeader = <h4>Records of receiving care</h4>;

const receivingCareList = (
  <ul>
    <li>Civilian physicians or caregivers</li>
    <li>Counseling facilities or health clinics</li>
    <li>Sexual trauma crisis centers or centers for domestic abuse</li>
  </ul>
);

const writtenTestimonialHeader = (
  <h4>Buddy or lay statements, also called written testimonials</h4>
);

const writtenTestimonialList = (
  <ul>
    <li>Family members or roommates</li>
    <li>Faculty members</li>
    <li>Fellow service members</li>
    <li>Chaplains or clergy members</li>
  </ul>
);

const civilPoliceReportHeader = <h4>Civilian police reports</h4>;

const civilPoliceReportList = (
  <ul>
    <li>Police headquarters</li>
    <li>Local precincts</li>
  </ul>
);

const personalAccAndOtherCorrespondenceHeader = (
  <h4>Personal accounts and other correspondence</h4>
);

const personalAccAndOtherCorrespondenceList = (
  <ul>
    <li>Personal journal or diary entries</li>
    <li>Emails, messages, or letters</li>
  </ul>
);

const additionalFormsHeader = <h4>Additional forms</h4>;

const additionalFormsList = (
  <ul>
    <li>Requests for increased compensation if you can’t work</li>
    <li>Requests for an automobile allowance</li>
    <li>Applications for an adaptive-equipment grant for your automobile</li>
  </ul>
);

const additionalFormsLinkAndNote = (
  <p>
    <va-link
      external
      href="https://www.va.gov/disability/how-to-file-claim/additional-forms/"
      text="Learn more about the additional forms you can submit (opens in a new tab)"
    />
    <br />
    <br />
    <strong>Note: </strong> You only need to submit new evidence that we don’t
    already have.
  </p>
);

export const evidenceChoiceIntroDescriptionContent = (
  <>
    {evidenceChoiceIntroDescription}
    {receivingCareHeader}
    {receivingCareList}
    {writtenTestimonialHeader}
    {writtenTestimonialList}
    {civilPoliceReportHeader}
    {civilPoliceReportList}
    {personalAccAndOtherCorrespondenceHeader}
    {personalAccAndOtherCorrespondenceList}
    {additionalFormsHeader}
    {additionalFormsList}
    {additionalFormsLinkAndNote}
  </>
);

export const additionalEvidenceModalContent =
  'You can choose not to include supporting documents and additional forms. If you do so, we’ll delete these files you uploaded:';

export const missingSelectionErrorMessage = 'You must provide a response';
