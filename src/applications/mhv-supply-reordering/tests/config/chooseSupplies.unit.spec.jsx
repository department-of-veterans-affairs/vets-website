import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('chooseSupplies', () => {
  const {
    schema,
    uiSchema,
    title,
  } = formConfig.chapters.chooseSuppliesChapter.pages.chooseSupplies;

  it('renders the form with the correct number of inputs', () => {
    const { container, getByRole } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect($$('va-checkbox-group', container).length).to.equal(1);
    getByRole('heading', { level: 3, name: title });
    // Not required
    const group = $('va-checkbox-group', container);
    expect(group.getAttribute('required')).to.eq('false');
    expect($('button[type="submit"]', container)).to.exist;
  });

  it('renders on review & submit page', () => {
    window.location = { pathname: '/review-and-submit' };
    const { container, getByRole } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );
    expect($$('va-checkbox-group', container).length).to.equal(1);
    getByRole('heading', { level: 3, name: title });
    // Not required
    const group = $('va-checkbox-group', container);
    expect(group.getAttribute('required')).to.eq('false');
    expect($('button[type="submit"]', container)).to.exist;
  });
});
