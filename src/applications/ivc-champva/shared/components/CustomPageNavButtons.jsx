import React from 'react';
import FormNavButtons, {
  FormNavButtonContinue,
} from 'platform/forms-system/src/js/components/FormNavButtons';
import { getArrayUrlSearchParams } from 'platform/forms-system/src/js/patterns/array-builder';
import CustomArrayBuilderButtonPair from './CustomArrayBuilderButtonPair';

/**
 * This wrapper handles showing the appropriate form navigation buttons based
 * on the props provided.
 * @param {object} props The standard props object provided to a custom page
 * @returns JSX
 */
export function CustomPageNavButtons(props) {
  const { contentAfterButtons, arrayBuilder, goBack, onContinue } = props;

  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');

  const useTopBackLink =
    contentAfterButtons?.props?.formConfig?.useTopBackLink ?? false;

  let navButtons;

  /*
  Three possible button configs:
  1. arrayBuilder (with or without topBackLink): custom array builder continue/cancel buttons
  2. useTopbackLink: show top back link + a wide Continue button (this aligns with minimal header styling)
  3. no useTopBackLink: standard Continue/Back buttons
  */
  if (arrayBuilder && (isEdit || isAdd)) {
    navButtons = <CustomArrayBuilderButtonPair {...props} {...arrayBuilder} />;
  } else {
    navButtons = useTopBackLink ? (
      <FormNavButtonContinue
        submitToContinue
        goBack={goBack}
        goForward={onContinue}
      />
    ) : (
      <FormNavButtons goBack={goBack} submitToContinue />
    );
  }

  return navButtons;
}
