import React from 'react';
import PropTypes from 'prop-types';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { EVIDENCE_PRIVATE, EVIDENCE_PRIVATE_PATH } from '../constants';

import { content } from '../content/evidencePrivateLimitation';

const EvidencePrivateLimitation = ({
  data = {},
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
        const last = data.providerFacility?.length - 1 || 0;
        goToPath(`/${EVIDENCE_PRIVATE_PATH}?index=${last}`);
      } else {
        // go to request VA evidence page
        goBack();
      }
    },
  };

  return (
    <form onSubmit={handlers.onGoForward}>
      <fieldset>
        <legend className="vads-u-font-family--serif">
          <h3 name="topPageElement" className="vads-u-margin--0">
            {content.title}
          </h3>
        </legend>
        <va-textarea
          class="resize-y"
          label={content.textAreaLabel}
          name="limitation"
          onInput={handlers.onInput}
          value={data.limitedConsent}
          uswds
        />
        <p />
        {content.info}
        <p />
        <div className="vads-u-margin-top--4">
          {contentBeforeButtons}
          <FormNavButtons goBack={handlers.onGoBack} goForward={goForward} />
          {contentAfterButtons}
        </div>
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
};

export default EvidencePrivateLimitation;
