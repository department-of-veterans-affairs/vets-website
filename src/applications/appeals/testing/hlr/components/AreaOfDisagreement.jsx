import React, { useState, useEffect } from 'react';

import {
  VaCheckboxGroup,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import cloneDeep from '~/platform/utilities/data/cloneDeep';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import {
  scrollToFirstError,
  waitForRenderThenFocus,
} from '~/platform/utilities/ui';
import { focusOnChange } from '~/platform/forms-system/src/js/utilities//ui';
import { ERROR_ELEMENTS } from '~/platform/utilities/constants';

import { DISAGREEMENT_TYPES, MAX_LENGTH } from '../../../shared/constants';
import {
  getIssueTitle,
  issueTitle,
  content,
  errorMessages,
} from '../../../shared/content/areaOfDisagreement';
import { calculateOtherMaxLength } from '../../../shared/utils/areaOfDisagreement';

import { hasAreaOfDisagreementChoice } from '../../../shared/validations/areaOfDisagreement';
import { customPageProps } from '../../../shared/props';

const AreaOfDisagreement = ({
  data = {},
  pagePerItemIndex,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  onReviewPage,
  updatePage,
  uiSchema,
}) => {
  const [checkboxErrorMessage, setCheckboxErrorMessage] = useState(null);
  const [inputErrorMessage, setInputErrorMessage] = useState(null);
  const [maxLength, setMaxLength] = useState(MAX_LENGTH.DISAGREEMENT_REASON);
  const focusOnAlertRole = uiSchema?.['ui:options'] || false;

  useEffect(
    () => {
      // clear error state between pages
      setCheckboxErrorMessage(null);
      setInputErrorMessage(null);
      if (onReviewPage) {
        waitForRenderThenFocus(`#disagreement-title-${pagePerItemIndex}`);
      }
    },
    [pagePerItemIndex, onReviewPage],
  );

  const setMaxError = (disagreement = {}) => {
    const max = calculateOtherMaxLength(disagreement);
    const hasError = (disagreement.otherEntry?.length || 0) > max;
    setMaxLength(max);
    setInputErrorMessage(hasError ? errorMessages.maxOtherEntry(max) : null);
    return hasError;
  };

  const setCheckboxError = (disagreement = {}) => {
    const hasError = !hasAreaOfDisagreementChoice(disagreement);
    setCheckboxErrorMessage(
      hasError ? errorMessages.missingDisagreement : null,
    );
    return hasError;
  };

  const handlers = {
    onGroupChange: event => {
      // event.target.name doesn't work on va-checkbox
      const name = event.target.getAttribute('name');
      const { checked } = event.detail;
      if (name) {
        const areaOfDisagreement = cloneDeep(data.areaOfDisagreement || []);
        const disagreement = areaOfDisagreement[pagePerItemIndex] || {};
        disagreement.disagreementOptions = {
          ...(disagreement.disagreementOptions || {}),
          [name]: checked,
        };

        setFormData({ ...data, areaOfDisagreement });
        setMaxError(disagreement);
        setCheckboxError(disagreement);
      }
    },
    onInput: event => {
      const { value } = event.target;
      const areaOfDisagreement = cloneDeep(data.areaOfDisagreement || []);
      const disagreement = areaOfDisagreement[pagePerItemIndex] || {};
      disagreement.otherEntry = value;
      setFormData({ ...data, areaOfDisagreement });
      setMaxError(disagreement);
      setCheckboxError(disagreement);
    },
    onSubmit: event => {
      event.preventDefault();
      const disagreement = data.areaOfDisagreement?.[pagePerItemIndex];
      if (setMaxError(disagreement)) {
        // clear no reason error
        setCheckboxErrorMessage(null);
      } else if (setCheckboxError(disagreement)) {
        scrollToFirstError({ focusOnAlertRole });
        return false;
      }
      return goForward(data);
    },
    updatePage: () => {
      const disagreement = data.areaOfDisagreement[pagePerItemIndex] || {};
      const scrollKey = `areaOfDisagreementFollowUp${pagePerItemIndex}`;
      if (!setMaxError(disagreement) && !setCheckboxError(disagreement)) {
        focusOnChange(scrollKey, 'va-button', 'button');
        updatePage(data);
      } else {
        // replaces scrollToFirstError()
        focusOnChange(scrollKey, ERROR_ELEMENTS.join(','));
      }
    },
  };

  const disagreements = data.areaOfDisagreement?.[pagePerItemIndex] || {};
  const options = disagreements?.disagreementOptions || {};
  const titlePlainText = getIssueTitle(disagreements, { plainText: true });

  return (
    <form onSubmit={handlers.onSubmit}>
      {issueTitle({ data: disagreements, onReviewPage })}

      <VaCheckboxGroup
        label="Tell us which part of the decision you disagree with. Select all that you disagree with."
        onVaChange={handlers.onGroupChange}
        error={checkboxErrorMessage}
        required
        uswds
      >
        {Object.entries(DISAGREEMENT_TYPES).map(
          ([key, label]) =>
            key === 'otherEntry' ? null : (
              <va-checkbox
                key={key}
                name={key}
                label={label}
                checked={options[key]}
                message-aria-describedby={titlePlainText}
                uswds
              />
            ),
        )}
        <VaTextInput
          label={`Something else. ${content.otherEntryHint}`}
          name="otherEntry"
          error={inputErrorMessage}
          onInput={handlers.onInput}
          value={disagreements.otherEntry}
          maxlength={maxLength}
          uswds
          charcount
        />
      </VaCheckboxGroup>

      {onReviewPage ? (
        <va-button
          class="vads-u-margin-top--2 vads-u-margin-bottom--4"
          text={content.update}
          onClick={handlers.updatePage}
          uswds
        />
      ) : (
        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={handlers.onSubmit}
            submitToContinue
          />
          {contentAfterButtons}
        </div>
      )}
    </form>
  );
};

AreaOfDisagreement.propTypes = customPageProps;

export default AreaOfDisagreement;
