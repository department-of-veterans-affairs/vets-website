import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormNavButtons, SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { getAlert, getFormNumber, onClickContinue } from '../helpers';

export const emptyObjectSchema = {
  type: 'object',
  properties: {},
};

const formNumber = getFormNumber();
export const form686cBcList = [
  { href: '/representative', label: 'Representative.va.gov home' },
  { href: '/representative/submissions', label: 'Submissions' },
  {
    href: `/representative/representative-form-upload/${formNumber}/introduction`,
    label: `Submit VA Form ${formNumber}`,
  },
];

export const uploadTitleAndDescription = {
  'view:uploadTitle': {
    'ui:title': 'Upload files',
  },
  'view:uploadFormNumberDescription': {
    'ui:title': `Upload VA Form ${getFormNumber()}`,
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

export const supportingEvidenceTitleAndDescription = {
  'view:supportingEvidenceTitle': {
    'ui:title': 'Upload supporting evidence',
  },
  'view:supportingEvidenceDescription': {
    'ui:description': 'Select supporting documents to upload.',
  },
};

export const veteranTitleAndDescription = {
  'view:veteranTitle': {
    'ui:title': 'Veteran identification information',
  },
  'view:veteranDescription': {
    'ui:description': Object.freeze(
      <>
        <span className="vads-u-font-weight--bold">Note:</span> If the veteran’s
        information here doesn’t match the uploaded PDF, it will cause
        processing delays.
      </>,
    ),
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
  useEffect(
    () => {
      const focusSelector = document.querySelector("va-alert[status='error']");
      if (focusSelector && continueClicked && !window.Cypress) {
        scrollAndFocus(focusSelector);
      }
    },
    [continueClicked],
  );

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
