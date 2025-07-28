import React from 'react';
import FormNavButtons, {
  FormNavButtonContinue,
} from 'platform/forms-system/src/js/components/FormNavButtons';
import CustomArrayBuilderButtonPair from './CustomArrayBuilderButtonPair';

/**
 * This wrapper handles showing the appropriate form navigation buttons based
 * on the props provided.
 * @param {object} props The standard props object provided to a custom page
 * @returns JSX
 */
export function CustomPageNavButtons(props) {
  const { contentAfterButtons, arrayBuilder, goBack } = props;

  const useTopBackLink =
    contentAfterButtons?.props?.formConfig?.useTopBackLink ?? false;

  let navButtons;

  /*
  Three possible button configs:
  1. useTopbackLink: show top back link + a wide Continue button (this aligns with minimal header styling)
  2. useTopbackLink && arrayBuilder: show top back link + custom array builder continue/cancel buttons
  3. no useTopBackLink: standard Continue/Back buttons
  */
  if (useTopBackLink) {
    navButtons = arrayBuilder ? (
      <CustomArrayBuilderButtonPair {...props} {...arrayBuilder} />
    ) : (
      <FormNavButtonContinue submitToContinue />
    );
  } else {
    navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  }

  return navButtons;
}
