import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { SHOW_PART3 } from '../../constants';

const {
  schema,
  uiSchema,
} = formConfig.chapters.conditions.pages.extensionReason;

describe('extension request page', () => {
  const defaultData = {
    [SHOW_PART3]: true,
    requestingExtension: true,
    extensionReason: 'Lorem ipsum',
  };

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

    expect($('va-textarea', container)).to.exist;
  });

  it('should not allow submit with no value (required)', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{ ...defaultData, extensionReason: '' }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit($('form', container));

    expect($('va-textarea', container).outerHTML).to.contain('value=""');
    expect($('va-textarea[error]', container)).to.exist;
    expect(onSubmit.called).to.be.false;
  });

  it('should allow submit with some text', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={defaultData}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit($('form', container));
    expect($('va-textarea', container).outerHTML).to.contain(
      'value="Lorem ipsum"',
    );
    expect($('va-textarea[error]', container)).to.not.exist;
    expect(onSubmit.called).to.be.true;
  });
});
