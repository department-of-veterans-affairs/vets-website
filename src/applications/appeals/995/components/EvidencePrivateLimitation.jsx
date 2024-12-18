import React, { useEffect } from 'react';

import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

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
  }, []);

  const handlers = {
    onInput: event => {
      setFormData({ ...data, limitedConsent: event.target.value });
    },

    onSelected: event => {
      setFormData({ ...data, [EVIDENCE_LIMIT]: event.detail.value === 'y' });
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

  const footer = (
    <>
      <p />
      {content.info}
      <p />
      <div className="vads-u-margin-top--4">
        {contentBeforeButtons}
        <FormNavButtons goBack={handlers.onGoBack} goForward={goForward} />
        {contentAfterButtons}
      </div>
    </>
  );

  return (
    <form onSubmit={handlers.onGoForward}>
      {showNewContent ? (
        <>
          <VaRadio
            label={content.ynTitle}
            label-header-level="3"
            onVaValueChange={handlers.onSelected}
          >
            <va-radio-option
              label="Yes"
              name="willLimit"
              value="y"
              checked={data[EVIDENCE_LIMIT]}
            />
            <va-radio-option
              label="No"
              name="willLimit"
              value="n"
              checked={data[EVIDENCE_LIMIT] === false}
            />
          </VaRadio>
          {footer}
        </>
      ) : (
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
          {footer}
        </fieldset>
      )}
    </form>
  );
};

EvidencePrivateLimitation.propTypes = customPageProps995;

export default EvidencePrivateLimitation;
