import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';
import { HAS_PRIVATE_LIMITATION } from '../../constants';
import * as helpers from '../../../shared/utils/helpers';

describe('Supplemental Claims Limited Consent Prompt Page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.limitedConsentPromptOld;

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
    expect($('va-radio', container).getAttribute('required')).to.eq('false');
    expect($('va-radio-option[value="Y"]', container)).to.exist;
    expect($('va-radio-option[value="N"]', container)).to.exist;

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should call updateUiSchema and updateSchema', () => {
    const options = uiSchema[HAS_PRIVATE_LIMITATION]['ui:options'];
    const isOnReviewPageStub = sinon
      .stub(helpers, 'isOnReviewPage')
      .returns(true);

    expect(options.updateUiSchema()).to.deep.equal({
      'ui:options': {
        labelHeaderLevel: 4,
      },
    });

    isOnReviewPageStub.restore();
  });
});
