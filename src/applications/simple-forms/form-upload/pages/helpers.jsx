import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormNavButtons, SchemaForm } from 'platform/forms-system/exportsFile';
import { scrollAndFocus } from 'platform/utilities/scroll';
import {
  extractAlertText,
  getAlert,
  getFormNumber,
  onClickContinue,
} from '../helpers';

export const CustomTopContent = () => {
  const formNumber = getFormNumber();
  const breadcrumbs = [
    { href: '/', label: 'VA.gov home' },
    { href: '/find-forms', label: 'Find a VA form' },
    // TODO: Restore this breadcrumb when the static content at /find-forms/upload plays nicely with the Form Upload tool
    // {
    //   href: `/find-forms/upload`,
    //   label: `Upload VA forms`,
    // },
    {
      href: `/find-forms/upload/${formNumber}/introduction`,
      label: `Upload form ${formNumber}`,
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
  const isFirstRender = useRef(true);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  useEffect(
    () => {
      const focusSelector = document.querySelector("va-alert[status='error']");
      if (focusSelector && continueClicked && !window.Cypress) {
        scrollAndFocus(focusSelector);
      }
    },
    [continueClicked],
  );

  const alert =
    props.name === 'uploadPage' ? getAlert(props, continueClicked) : null;
  const alertText =
    alert && !isFirstRender.current ? extractAlertText(alert) : '';

  return (
    <div className="form-panel">
      <span
        aria-atomic="true"
        role="alert"
        aria-live="polite"
        className="sr-only"
      >
        {alertText}
      </span>
      {alert}
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
