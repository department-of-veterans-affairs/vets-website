import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { errorMessages, EVIDENCE_VA } from '../../constants';

describe('Supplemental Claims VA evidence request page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidenceVaRecordsRequest;

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

    expect($$('input', container).length).to.eq(2);
  });

  it('should not allow submit with radios unselected (required)', () => {
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
    expect($('.usa-input-error', container).textContent).to.contain(
      errorMessages.requiredYesNo,
    );
    expect(onSubmit.called).to.be.false;
  });

  it('should allow submit with one radio selected', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ [EVIDENCE_VA]: true }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit($('form', container));
    expect(container.innerHTML).to.contain('value="Y" checked');
    expect($('.usa-input-error', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });

  it('should capture google analytics', () => {
    global.window.dataLayer = [];
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={() => {}}
      />,
    );

    fireEvent.click($('input[value="Y"]', container));

    const event = global.window.dataLayer.slice(-1)[0];
    expect(event).to.deep.equal({
      event: 'int-radio-button-option-click',
      'radio-button-label':
        'Would you like us to request your VA medical records for you?',
      'radio-button-optionLabel': 'Yes',
      'radio-button-required': true,
    });
  });
});
