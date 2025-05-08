import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $, $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../config/form';

describe('HLR authorization page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.conditions.pages.authorization;

  it('should not render a checkbox when toggle is enabled', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );
    expect($$('va-checkbox', container).length).to.equal(0);
  });

  it('should allow submit when toggle is enabled', () => {
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
    expect(onSubmit.called).to.be.true;
  });
});
