import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { EVIDENCE_OTHER } from '../../constants';
import errorMessages from '../../../shared/content/errorMessages';

describe('Supplemental Claims evidence upload request page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidenceWillUpload;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($$('va-radio-option', container).length).to.eq(2);
  });

  it('should prevent submit with radios unselected (required)', async () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit($('form', container));

    await waitFor(() => {
      const radios = $$('[error]', container);
      expect(radios.length).to.equal(1);
      expect(radios[0].getAttribute('error')).to.eq(
        errorMessages.requiredYesNo,
      );
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should allow submit with one radio selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ [EVIDENCE_OTHER]: true }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit($('form', container));
    expect(container.innerHTML).to.contain('value="Y" checked');
    expect($('.usa-input-error', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });
});
