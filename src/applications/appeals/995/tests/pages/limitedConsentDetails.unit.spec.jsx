import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import {
  detailsError,
  detailsHint,
  detailsQuestion,
} from '../../pages/limitedConsentDetails';

describe('Supplemental Claims Limited Consent Details page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.limitedConsentDetails;

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

    const textarea = $('va-textarea[required]', container);
    expect(textarea).to.exist;
    expect(textarea.getAttribute('label')).to.eq(detailsQuestion);
    expect(textarea.getAttribute('label-header-level')).to.eq('3');
    expect(textarea.getAttribute('hint')).to.eq(detailsHint);
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should prevent submission & show error', () => {
    const data = { limitedConsent: '' };
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    waitFor(() => {
      expect($('va-textarea', container).getAttribute('error')).to.eq(
        detailsError,
      );
    });
  });

  it('should allow submission with content', () => {
    const onSubmitSpy = sinon.spy();
    const data = { limitedConsent: 'test' };
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        formData={{}}
        onSubmit={onSubmitSpy}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    expect(onSubmitSpy.called).to.be.true;
  });
});
