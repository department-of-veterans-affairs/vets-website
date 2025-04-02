import React from 'react';
import { expect } from 'chai';
import { render, waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { OTHER_HOUSING_RISK_MAX } from '../../constants';

describe('Supplemental Claims other housing risks page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.infoPages.pages.otherHousingRisk;

  // Custom page is rendered, so this only renders a submit button
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

    // Not required
    expect($('va-textarea', container).getAttribute('required')).to.eq('false');
    expect($('va-additional-info', container)).to.exist;

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should show error and block submission if over character limit', () => {
    const onSubmit = sinon.spy();
    const longText = 'lorem ipsum '.repeat(10);

    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{ otherHousingRisks: longText }}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = $('button[type="submit"]', container);
    expect(submitButton).to.exist;
    fireEvent.click(submitButton);

    const textarea = $('va-textarea', container);

    expect($('va-additional-info', container)).to.exist;
    waitFor(() => {
      expect(textarea.getAttribute('error')).to.contain(
        `should be less than ${OTHER_HOUSING_RISK_MAX} characters`,
      );
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should allow submit if under character limit', () => {
    const onSubmit = sinon.spy();
    const longText = 'lorem ipsum '.repeat(3);

    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{ otherHousingRisks: longText }}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click($('button[type="submit"]', container));

    const textarea = $('va-textarea', container);

    waitFor(() => {
      expect(textarea.getAttribute('error')).to.eq('');
      expect(onSubmit.called).to.be.true;
    });
  });
});
