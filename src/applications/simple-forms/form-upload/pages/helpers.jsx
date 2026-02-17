import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormNavButtonContinue,
  SchemaForm,
} from 'platform/forms-system/exportsFile';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { getFormNumber, onClickContinue } from '../helpers';

export const CustomTopContent = () => {
  const formNumber = getFormNumber();
  const breadcrumbs = [
    { href: '/', label: 'VA.gov home' },
    { href: '/forms', label: 'Find a VA form' },
    // TODO: Restore this breadcrumb when the static content at /forms/upload plays nicely with the Form Upload tool
    // {
    //   href: `/forms/upload`,
    //   label: `Upload VA forms`,
    // },
    {
      href: `/forms/upload/${formNumber}/introduction`,
      label: `Upload VA Form ${formNumber}`,
    },
  ];
  const bcString = JSON.stringify(breadcrumbs);
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
  const [srText, setSrText] = useState(null);

  useEffect(() => {
    const focusSelector = document.querySelector("va-alert[status='error']");
    if (focusSelector && continueClicked && !window.Cypress) {
      scrollAndFocus(focusSelector);
    }
  }, [continueClicked]);

  useEffect(() => {
    // after re-render, get the text of the new alert
    const id = setTimeout(() => {
      const alertText =
        document.querySelector('div.form-panel va-alert')?.innerText || '';
      setSrText(alertText);
    }, 100);
    return () => clearTimeout(id);
  }, [props?.data?.uploadedFile?.name]);

  return (
    <div className="form-panel">
      <span
        aria-atomic="true"
        role="alert"
        aria-live="polite"
        className="sr-only"
      >
        {srText}
      </span>
      <SchemaForm {...props}>
        <>
          {props.contentBeforeButtons}
          <FormNavButtonContinue
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
