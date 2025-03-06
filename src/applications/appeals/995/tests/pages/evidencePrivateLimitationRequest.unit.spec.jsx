import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { EVIDENCE_LIMIT } from '../../constants';

describe('Supplemental Claims private limitation request page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidencePrivateLimitationRequest;

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

  it('should call updateUiSchema and updateSchema and return US phone patterns when checkbox is false', () => {
    const options = uiSchema[EVIDENCE_LIMIT]['ui:options'];
    window.location = { pathname: '/review-and-submit' };

    expect(options.updateUiSchema()).to.deep.equal({
      'ui:options': {
        labelHeaderLevel: 4,
      },
    });
  });
});
