import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

describe('Supplemental Claims option for MST page', () => {
  const { schema, uiSchema } = formConfig.chapters.issues.pages.optionIndicator;

  // Custom page is rendered, so this only renders a submit button
  it('should render', () => {
    const onSubmitSpy = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmitSpy}
      />,
    );

    const radio = $('va-radio', container);
    // Not required
    expect(radio.getAttribute('required')).to.eq('false');
    expect(radio.getAttribute('label-header-level')).to.eq('3');
    expect($('va-radio-option[value="yes"]', container)).to.exist;
    expect($('va-radio-option[value="no"]', container)).to.exist;
    expect($('va-radio-option[value="revoke"]', container)).to.exist;
    expect($('va-radio-option[value="notEnrolled"]', container)).to.exist;

    fireEvent.click($('button[type="submit"]', container));
    expect(onSubmitSpy.called).to.be.true;
  });

  // Increase test coverage
  it('should updateUiSchema for review page', () => {
    window.location = { pathname: '/review-and-submit' };
    const result = uiSchema.optionIndicator['ui:options'].updateUiSchema();
    expect(result).to.deep.equal({
      'ui:options': { labelHeaderLevel: 4 },
    });
  });
});
