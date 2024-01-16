import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  VaCheckboxGroup,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import cloneDeep from 'platform/utilities/data/cloneDeep';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { waitForRenderThenFocus } from 'platform/utilities/ui';
import { scrollToFirstError } from 'platform/forms-system/src/js/utilities//ui';

import { DISAGREEMENT_TYPES, MAX_LENGTH } from '../constants';
import {
  getIssueTitle,
  issueTitle,
  content,
  errorMessages,
} from '../content/areaOfDisagreement';
import { calculateOtherMaxLength } from '../utils/areaOfDisagreement';

import { hasAreaOfDisagreementChoice } from '../validations/areaOfDisagreement';

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
}) => {
  const [checkboxErrorMessage, setCheckboxErrorMessage] = useState(null);
  const [inputErrorMessage, setInputErrorMessage] = useState(null);
  const [maxLength, setMaxLength] = useState(MAX_LENGTH.DISAGREEMENT_REASON);

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
    onSubmit: () => {
      const disagreement = data.areaOfDisagreement?.[pagePerItemIndex];
      if (setMaxError(disagreement)) {
        // clear no reason error
        setCheckboxErrorMessage(null);
      } else if (!setCheckboxError(disagreement)) {
        return goForward(data);
      }
      return false;
    },
    updatePage: () => {
      const disagreement = data.areaOfDisagreement[pagePerItemIndex] || {};
      if (!setMaxError(disagreement) && !setCheckboxError(disagreement)) {
        waitForRenderThenFocus(
          `[name="areaOfDisagreementFollowUp${pagePerItemIndex}ScrollElement"] + form va-button[text="Edit"]`,
        );
        updatePage();
      } else {
        scrollToFirstError();
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
        label={content.disagreementLegend}
        hint={content.disagreementHint}
        onVaChange={handlers.onGroupChange}
        error={checkboxErrorMessage}
        required
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
              />
            ),
        )}
        <VaTextInput
          label={DISAGREEMENT_TYPES.otherEntry}
          hint={content.otherEntryHint}
          name="otherEntry"
          error={inputErrorMessage}
          onInput={handlers.onInput}
          value={disagreements.otherEntry}
          maxlength={maxLength}
        />
      </VaCheckboxGroup>

      {onReviewPage ? (
        <va-button text={content.update} onClick={handlers.updatePage} />
      ) : (
        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          <FormNavButtons goBack={goBack} goForward={handlers.onSubmit} />
          {contentAfterButtons}
        </div>
      )}
    </form>
  );
};

AreaOfDisagreement.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    limitedConsent: PropTypes.string,
    providerFacility: PropTypes.array,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default AreaOfDisagreement;
