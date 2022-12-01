import React from 'react';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { EVIDENCE_PRIVATE, EVIDENCE_PRIVATE_PATH } from '../constants';

import { content } from '../content/evidencePrivateLimitation';

// const REVIEW_AND_SUBMIT = '/review-and-submit';

const EvidencePrivateLimitation = ({
  data,
  onReviewPage,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const handlers = {
    onInput: event => {
      setFormData({ ...data, limitedConsent: event.target.value });
    },

    onGoBack: () => {
      if (data[EVIDENCE_PRIVATE]) {
        // go to last private facility entry, but only if they requested it
        const last = data.providerFacility.length - 1;
        goToPath(`/${EVIDENCE_PRIVATE_PATH}?index=${last}`);
      } else {
        // go to request VA evidence page
        goBack();
      }
    },
  };

  const navButtons = onReviewPage ? (
    <button type="submit">Review update button</button>
  ) : (
    <>
      {contentBeforeButtons}
      <FormNavButtons goBack={handlers.onGoBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );

  return (
    <form onSubmit={handlers.onGoForward}>
      <fieldset>
        <legend className="vads-u-font-family--serif">
          <h3 name="topPageElement" className="vads-u-margin--0">
            {content.title}
          </h3>
        </legend>
        <va-textarea
          label={content.textAreaLabel}
          name="limitation"
          onInput={handlers.onInput}
          value={data.limitedConsent}
        />
        <p />
        {content.info}
        <p />
        <div className="vads-u-margin-top--4">{navButtons}</div>
      </fieldset>
    </form>
  );
};

EvidencePrivateLimitation.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    limitedConsent: PropTypes.string,
    providerFacility: PropTypes.array,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  testingMethod: PropTypes.string,
  onReviewPage: PropTypes.bool,
};

export default EvidencePrivateLimitation;
