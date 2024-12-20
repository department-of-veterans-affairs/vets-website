import React, { useEffect } from 'react';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import {
  EVIDENCE_LIMIT,
  EVIDENCE_PRIVATE,
  EVIDENCE_PRIVATE_PATH,
} from '../constants';

import { content } from '../content/evidencePrivateLimitation';
import { showScNewForm } from '../utils/toggle';

import { customPageProps995 } from '../../shared/props';

const EvidencePrivateLimitation = ({
  data = {},
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const showNewContent = showScNewForm(data);

  // Set y/n value, if textarea is already filled
  useEffect(() => {
    if (
      showNewContent &&
      typeof data[EVIDENCE_LIMIT] === 'undefined' &&
      data.limitedConsent
    ) {
      setFormData({
        ...data,
        [EVIDENCE_LIMIT]: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

EvidencePrivateLimitation.propTypes = customPageProps995;

export default EvidencePrivateLimitation;
