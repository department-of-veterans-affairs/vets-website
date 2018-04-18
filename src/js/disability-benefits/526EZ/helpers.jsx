import React from 'react';
import classNames from 'classnames';
import AdditionalInfo from '@department-of-veterans-affairs/jean-pants/AdditionalInfo';

import { isValidUSZipCode, isValidCanPostalCode } from '../../common/utils/address';
import { stateRequiredCountries } from '../../common/schemaform/definitions/address';
import { transformForSubmit } from '../../common/schemaform/helpers';
import cloneDeep from '../../common/utils/data-utils/cloneDeep';
import get from '../../common/utils/data-utils/get';
import set from '../../common/utils/data-utils/set';
import { genderLabels } from '../../common/utils/labels';

const siblings = ['treatments', 'privateRecordReleases', 'privateRecords', 'additionalDocuments'];

import {
  PREFILL_STATUSES
} from '../../common/schemaform/save-in-progress/actions';
import { DateWidget } from '../../common/schemaform/review/widgets';

/*
 * Flatten nested array form data into sibling properties
 *
 * @param {object} data - Form data for a full form, including nested array properties
 */
export function flatten(data) {
  const formData = cloneDeep(data);
  formData.disabilities.forEach((disability, idx) => {
    siblings.forEach(sibling => {
      if (disability[sibling]) {
        formData[sibling] = [];
        formData[sibling][idx] = disability[sibling];
        delete disability[sibling]; // eslint-disable-line no-param-reassign
      }
    });
  });
  return formData;
}

export function transform(formConfig, form) {
  const formData = flatten(transformForSubmit(formConfig, form));
  delete formData.prefilled;
  return JSON.stringify({
    disabilityBenefitsClaim: {
      form: formData
    }
  });
}

export const isPrefillDataComplete = (formData) => {
  const { socialSecurityNumber, vaFileNumber, gender,
    dateOfBirth, servicePeriods } = formData;
  const first = get('fullName.first', formData);
  const last = get('fullName.last', formData);
  const country = get('veteran.mailingAddress.country', formData);
  const addressLine1 = get('veteran.mailingAddress.addressLine1', formData);
  const emailAddress = get('veteran.emailAddress', formData);
  const primaryPhone = get('veteran.primaryPhone', formData);
  const accountType = get('directDeposit.accountType', formData);
  const routingNumber = get('directDeposit.routingNumber', formData);
  const bankName = get('directDeposit.bankName', formData);
  const noBank = get('directDeposit.noBank', formData);
  const hasVeteranDetails = first && last && gender && dateOfBirth && (socialSecurityNumber || vaFileNumber);
  const hasPrimaryAddressInfo = country && addressLine1 && emailAddress && primaryPhone;
  const hasPaymentInfo = noBank || (accountType && routingNumber && bankName);
  const hasMilitaryHistoryInfo = servicePeriods && servicePeriods.length > 0;
  return !!(hasVeteranDetails && hasPrimaryAddressInfo && hasPaymentInfo && hasMilitaryHistoryInfo);
};

export function prefillTransformer(pages, formData, metadata, state) {
  let newData = formData;
  const isPrefilled = state.prefilStatus === PREFILL_STATUSES.success;
  const hasRequiredInformation = isPrefillDataComplete(formData);

  if (isPrefilled && hasRequiredInformation) {
    newData = set('prefilled', true, newData);
  }

  return {
    metadata,
    formData: newData,
    pages
  };
}

export const supportingEvidenceOrientation = (
  <p>We’ll now ask you where we can find medical records or evidence about your worsened conditions after they were rated. You don’t need to turn in any medical records that you’ve already submitted with your original claim. <strong>We only need new medical records or other evidence about your condition after you got your disability rating.</strong></p>
);


export const evidenceTypesDescription = ({ formData }) => {
  return (
    <p>What supporting evidence do you have that shows how your {formData.disability.diagnosticText} <strong>has worsened since VA rated your disability</strong>?</p>
  );
};


// Shows or collapses the "Which should I choose?" link at the bottom of the evidence types page
// TODO: Investigate whether this should just use `expandUnder`
export class EvidenceTypeHelp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  toggleOpen = (e) => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  }

  expandedContent = (
    <div>
      <h3>Types of evidence</h3>
      <h4>VA medical records</h4>
      <p>If you were treated at a VA medical center or clinic, you have VA medical records. This includes Tri-Care.</p>
      <h4>Private medical records</h4>
      <p>If you were treated by a private doctor, including Veteran’s Choice, we will need to see those records to proceed with your claim. Like DBQs.</p>
      <h4>Lay statements or other evidence</h4>
      <p>Also known as "buddy statements," written accounts from family or other people who know you can help support a claim. In most cases your medical records are enough, but claims involving Post Traumatic Stress Disorder or Military Sexual Trauma sometimes benefit from Lay Statements.</p>
      <button className="va-button-link" onClick={this.toggleOpen}>Close</button>
    </div>
  )

  render() {
    const className = classNames(
      'form-expanding-group',
      { 'form-expanding-group-open': this.state.open }
    );

    return (
      <div className={className}>
        <button className="va-button-link dashed-underline" onClick={this.toggleOpen}>Which should I choose?</button>
        {this.state.open && this.expandedContent}
      </div>
    );
  }
}


export const disabilityNameTitle = ({ formData }) => {
  return (
    <legend className="schemaform-block-title schemaform-title-underline">{formData.disability.diagnosticText}</legend>
  );
};


export const facilityDescription = ({ formData }) => {
  return (
    <p>Tell us about facilities where VA treated you for {formData.disability.diagnosticText}, <strong>after you got your disability rating</strong>.</p>
  );
};


export const treatmentView = ({ formData }) => {
  const { startTreatment, endTreatment, treatmentCenterName } = formData.treatment;
  let treatmentPeriod = '';

  if (startTreatment && endTreatment) {
    treatmentPeriod = `${startTreatment} — ${endTreatment}`;
  } else if (startTreatment || endTreatment) {
    treatmentPeriod = `${(startTreatment || endTreatment)}`;
  }


  return (
    <div>
      <strong>{treatmentCenterName}</strong><br/>
      {treatmentPeriod}
    </div>
  );
};

export const releaseView = ({ formData }) => {
  const { startTreatment, endTreatment, treatmentCenterName } = formData.privateRecordRelease;
  let treatmentPeriod = '';

  if (startTreatment && endTreatment) {
    treatmentPeriod = `${startTreatment} — ${endTreatment}`;
  } else if (startTreatment || endTreatment) {
    treatmentPeriod = `${(startTreatment || endTreatment)}`;
  }


  return (
    <div>
      <strong>{treatmentCenterName}</strong><br/>
      {treatmentPeriod}
    </div>
  );
};

export const vaMedicalRecordsIntro = ({ formData }) => {
  return (
    <p>Ok, first we’ll ask about your VA medical records related to your {formData.disability.diagnosticText}.</p>
  );
};


export const privateMedicalRecordsIntro = ({ formData }) => {
  return (
    <p>Ok, first we’ll ask about your private medical records related to your {formData.disability.diagnosticText}.</p>
  );
};

export function validatePostalCodes(errors, formData) {
  let isValidPostalCode = true;
  // Checks if postal code is valid
  if (formData.treatmentCenterCountry === 'USA') {
    isValidPostalCode = isValidPostalCode && isValidUSZipCode(formData.treatmentCenterPostalCode);
  }
  if (formData.treatmentCenterCountry === 'CAN') {
    isValidPostalCode = isValidPostalCode && isValidCanPostalCode(formData.treatmentCenterPostalCode);
  }

  // Add error message for postal code if it exists and is invalid
  if (formData.treatmentCenterPostalCode && !isValidPostalCode) {
    errors.treatmentCenterPostalCode.addError('Please provide a valid postal code');
  }
}

export function validateAddress(errors, formData) {
  // Adds error message for state if it is blank and one of the following countries:
  // USA, Canada, or Mexico
  if (stateRequiredCountries.has(formData.treatmentCenterCountry)
    && formData.treatmentCenterState === undefined) {
    // TODO: enable once validation determined 
    // && currentSchema.required.length) {
    errors.treatmentCenterState.addError('Please select a state or province');
  }
  const hasAddressInfo = stateRequiredCountries.has(formData.treatmentCenterCountry)
    // TODO: enable once validation determined 
    // && !currentSchema.required.length
    && typeof formData.treatmentCenterCity !== 'undefined'
    && typeof formData.treatmentCenterStreet !== 'undefined'
    && typeof formData.treatmentCenterPostalCode !== 'undefined';

  if (hasAddressInfo && typeof formData.treatmentCenterState === 'undefined') {
    errors.treatmentCenterState.addError('Please enter a state or province, or remove other address information.');
  }

  validatePostalCodes(errors, formData);
}

export const recordReleaseWarning = (
  <div className="usa-alert usa-alert-warning no-background-image">
    <span>Limiting consent means that your doctor can only share records that are directly related to your condition. This could add to the time it takes to get your private medical records.</span>
  </div>
);

export const documentDescription = () => {
  return (
    <div>
      <p>File upload guidelines:</p>
      <ul>
        <li>File types you can upload: .pdf, .jpeg, or .png</li>
        <li>Maximum file size: 50 MB</li>
      </ul>
      <p><em>Large files can be more difficult to upload with a slow Internet connection</em></p>
    </div>
  );
};

export const additionalDocumentDescription = () => {
  return (
    <div>
      <p>If you have other evidence, like lay or buddy statements, that you would like to submit, you can upload them here.</p>
      <p>File upload guidelines:</p>
      <ul>
        <li>File types you can upload: .pdf, .jpeg, or .png</li>
        <li>Maximum file size: 50 MB</li>
      </ul>
      <p><em>Large files can be more difficult to upload with a slow Internet connection</em></p>
    </div>
  );
};

const documentLabels = {
  1: 'Discharge',
  2: 'Marriage related',
  3: 'Dependent related',
  // 4: 'VA preneed form',
  5: 'Letter',
  6: 'Other'
};

const getVACenterName = (center) => center.treatment.treatmentCenterName;
const getPrivateCenterName = (release) => release.privateRecordRelease.treatmentCenterName;

const listifyCenters = (center, idx, list) => {
  const centerName = center.treatment ? getVACenterName(center) : getPrivateCenterName(center);
  const notLast = idx < (list.length - 1);
  const justOne = list.length === 1;
  const atLeastThree = list.length > 2;
  return (
    <span key={idx}>
      {!notLast && !justOne && <span className="unstyled-word"> and </span>}
      {centerName}
      {atLeastThree && notLast && ', '}
    </span>
  );
};


export const evidenceSummaryView = ({ formData }) => {
  const { treatments: VATreatments, privateRecordReleases, privateRecords, additionalDocuments } = formData;
  return (
    <div>
      <ul>
        {VATreatments &&
        <li>We’ll get your medical records from <span className="treatment-centers">{VATreatments.map(listifyCenters)}</span>.</li>}
        {privateRecordReleases &&
        <li>We’ll get your private medical records from <span className="treatment-centers">{privateRecordReleases.map(listifyCenters)}</span>.</li>}
        {privateRecords && <li>We have received the private medical records you uploaded.</li>}
        {additionalDocuments &&
        <li>We have received the additional evidence you uploaded:
          <ul>
            {additionalDocuments.map((document, id) => {
              return (<li className="dashed-bullet" key={id}>
                <strong>{`${documentLabels[document.attachmentId]} (${document.name})`}</strong>
              </li>);
            })
            }
          </ul>
        </li>}
      </ul>
    </div>
  );
};

const FullNameViewField = ({ formData }) => {
  const { first, middle, last, suffix } = formData;
  return <strong>{first} {middle} {last} {suffix}</strong>;
};

const SsnViewField = ({ formData }) => {
  const ssn = formData.slice(5);
  const mask = <span>•••-••-</span>;
  return <p>Social Security number: {mask}{ssn}</p>;
};

const VAFileNumberViewField = ({ formData }) => {
  const vaFileNumber = formData.slice(5);
  const mask = <span>•••-••-</span>;
  return <p>VA file number: {mask}{vaFileNumber}</p>;
};

const DateOfBirthViewField = ({ formData }) => {
  return <p>Date of birth: <DateWidget value={formData} options={{ monthYear: false }}/></p>;
};

const GenderViewField = ({ formData }) => <p>Gender: {genderLabels[formData]}</p>;

export const veteranInformationViewField = ({ formData }) => {
  return (
    <div>
      <FullNameViewField formData={formData.fullName}/>
      <SsnViewField formData={formData.socialSecurityNumber}/>
      <VAFileNumberViewField formData={formData.vaFileNumber}/>
      <GenderViewField formData={formData.gender}/>
      <DateOfBirthViewField formData={formData.dateOfBirth}/>
    </div>
  );
};

function lowerCaseFirstLetter(word) {
  return word[0].toLowerCase().concat(word.slice(1));
}

function lowerCaseAll(words) {
  return words.map(word => lowerCaseFirstLetter(word));
}

function kebabize(words) {
  return lowerCaseAll(words).join('-');
}

function getVerifiedPagePath(chapterTitleWords, pageTitleWords) {
  const verifiedChapterPath = chapterTitleWords.slice(0);
  verifiedChapterPath.unshift('review');
  const verifiedPagePath = pageTitleWords.slice(0);
  return `${kebabize(verifiedChapterPath)}/${kebabize(verifiedPagePath)}`;
}

function getUnverifiedPagePath(chapterTitleWords, pageTitleWords) {
  const unverifiedChapterPath = chapterTitleWords.slice(0);
  const unverifiedPagePath = pageTitleWords.slice(0);
  return `${kebabize(unverifiedChapterPath)}/${kebabize(unverifiedPagePath)}`;
}

function getPath(chapterTitle, pageTitle, isReview) {
  const chapterTitleWords = chapterTitle.split(' ');
  const pageTitleWords = pageTitle.split(' ');
  const getPagePath = isReview ? getVerifiedPagePath : getUnverifiedPagePath;
  return getPagePath(chapterTitleWords, pageTitleWords);
}

const verifiedDepends = ({ prefilled }) => !!prefilled;

const unverifiedDepends = ({ prefilled }) => !prefilled;

export function getPage(pageConfig, chapterTitle) {
  const { pageTitle, component, isReview, ...rest } = pageConfig;
  const pagePath = getPath(chapterTitle, pageTitle, isReview);
  const depends = isReview ? verifiedDepends : unverifiedDepends;
  const pageComponent = isReview ? component : undefined;

  return {
    title: pageTitle,
    path: pagePath,
    component: pageComponent,
    depends,
    ...rest
  };
}

export const VAFileNumberDescription = (
  <div className="additional-info-title-help">
    <AdditionalInfo triggerText="What does this mean?">
      <p>The VA file number is the number used to track your disability claim and evidence through the VA system. For most Veterans, your VA file number is the same as your Social Security Number. However, if you filed your first disability claim a long time ago, your VA file number may be a different number.</p>
    </AdditionalInfo>
  </div>
);
