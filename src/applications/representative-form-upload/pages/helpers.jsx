import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FormNavButtons, SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { getAlert, getFormNumber, onClickContinue } from '../helpers';

export const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

const formNumber = getFormNumber();
export const form686cBcList = [
  { href: '/representative', label: 'Accredited representative portal home' },
  { href: '/representative/submissions', label: 'Submissions' },
  {
    href: `/representative/representative-form-upload/${formNumber}/introduction`,
    label: `Submit VA Form ${formNumber}`,
  },
];

export const uploadTitleAndDescription = {
  'view:uploadTitle': {
    'ui:description': Object.freeze(
      <h3>{`Upload VA Form ${getFormNumber()}`}</h3>,
    ),
  },
  'view:uploadDescription': {
    'ui:description': Object.freeze(
      <>
        <span className="vads-u-font-weight--bold">Note:</span> After you upload
        your file, you’ll need to continue to the next screen to submit it. If
        you leave before you submit it, you’ll need to upload it again.
      </>,
    ),
  },
};

export const claimantTitleAndDescription = {
  'view:claimantTitle': {
    'ui:title': 'Claimant information',
  },
  'view:claimantDescription': {
    'ui:description': Object.freeze(
      <>
        <span className="vads-u-font-weight--bold">Note:</span> If the
        claimant’s information here doesn’t match the uploaded PDF, it will
        cause processing delays.
      </>,
    ),
  },
};

export const ITFClaimantTitleAndDescription = {
  'view:claimantTitle': {
    ...titleUI('Claimant information'),
  },
};

export const supportingEvidenceTitleAndDescription = {
  'view:supportingEvidenceTitle': {
    'ui:title': Object.freeze(<h3>Upload supporting evidence</h3>),
  },
  'view:supportingEvidenceDescription': {
    'ui:description': Object.freeze(
      <p className="vads-u-margin--0">
        Select supporting documents to upload.
      </p>,
    ),
  },
};

export const veteranTitleAndDescription = {
  'view:veteranTitle': {
    'ui:title': 'Veteran identification information',
  },
  'view:veteranDescription': {
    'ui:description': Object.freeze(
      <div className="veteran-note">
        <span className="vads-u-font-weight--bold">Note:</span> If the veteran’s
        information here doesn’t match the uploaded PDF, it will cause
        processing delays.
      </div>,
    ),
  },
};
export const ITFVetBenefits = Object.freeze({
  SURVIVOR: {
    title:
      'Survivors pension and/or dependency and indemnity compensation (DIC)',
    description:
      'Select this option if you intend to file a DIC claim (VA Form 21P-534 or VA Form 21P-534EZ)',
  },
});

export const ITFBenefitTypes = Object.freeze({
  labels: {
    compensation: 'Disability Compensation',
    pension: 'Pension',
  },
  descriptions: {
    compensation:
      'Select this option if you intend to file for disability compensation (VA Form 21-526EZ)',
    pension:
      'Select this option if you intend to file a pension claim (VA Form 21P-527EZ)',
  },
});

export const ITFVeteranTitleAndDescription = {
  'view:veteranTitle': {
    ...titleUI('Veteran identification information'),
  },
};

export const CustomTopContent = () => {
  const bcString = JSON.stringify(form686cBcList);
  return (
    <va-breadcrumbs
      className="breadcrumbs-container"
      breadcrumb-list={bcString}
      label="Breadcrumb"
      home-veterans-affairs={false}
    />
  );
};

/** @type {CustomPageType} */
export const CustomAlertPage = props => {
  const [continueClicked, setContinueClicked] = useState(false);
  useEffect(() => {
    const focusSelector = document.querySelector("va-alert[status='error']");
    if (focusSelector && continueClicked && !window.Cypress) {
      scrollAndFocus(focusSelector);
    }
  }, [continueClicked]);

  return (
    <div className="form-panel">
      {getAlert(props, continueClicked)}
      <SchemaForm {...props}>
        <>
          {props.contentBeforeButtons}
          <FormNavButtons
            goBack={props.goBack}
            goForward={() => onClickContinue(props, setContinueClicked)}
            submitToContinue
          />
          {props.contentAfterButtons}
        </>
      </SchemaForm>
    </div>
  );
};

CustomAlertPage.propTypes = {
  alert: PropTypes.element,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goBack: PropTypes.func,
  onContinue: PropTypes.func,
};
