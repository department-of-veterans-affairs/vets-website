import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import { uiSchema, schema } from '../../pages/remarks';

describe('22-10272 – Remarks page', () => {
  const renderPage = () =>
    render(
      <DefinitionTester
        uiSchema={uiSchema}
        schema={schema}
        formData={{}}
        definitions={formConfig.defaultDefinitions}
      />,
    );

  it('renders one <va-textarea>', () => {
    const { container } = renderPage();
    expect(container.querySelectorAll('va-textarea').length).to.equal(1);
  });
  it('confirms that the remarks textarea is limited to 500 chars', () => {
    const { container } = renderPage();
    const textarea = container.querySelector('va-textarea');

    // Verify maxlength is set to 500
    expect(textarea.getAttribute('maxlength')).to.equal('500');

    // Verify charcount is enabled for user feedback
    expect(textarea.getAttribute('charcount')).to.equal('true');
  });
});
