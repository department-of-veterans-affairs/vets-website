import React from 'react';
import FormNavButtons, {
  FormNavButtonContinue,
} from 'platform/forms-system/src/js/components/FormNavButtons';

/**
 * This wrapper handles showing the appropriate form navigation buttons based
 * on the props provided.
 * @param {*} props
 * @returns JSX
 */
export function IvcCustomPageNavButtons(props) {
  const { contentAfterButtons, arrayBuilder, goBack } = props;

  const useTopBackLink =
    contentAfterButtons?.props?.formConfig?.useTopBackLink ?? false;

  let navButtons;

  /*
  Three possible button configs:
  1. useTopbackLink: show top back link + a wide Continue button
  2. useTopbackLink && arrayBuilder: show top back link + standard array builder continue/cancel buttons
  3. no useTopBackLink: standard Continue/Back buttons
  */
  if (useTopBackLink) {
    navButtons = arrayBuilder ? (
      <arrayBuilder.ArrayBuilderButtonPair />
    ) : (
      <FormNavButtonContinue submitToContinue />
    );
  } else {
    navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  }

  return navButtons;
}
