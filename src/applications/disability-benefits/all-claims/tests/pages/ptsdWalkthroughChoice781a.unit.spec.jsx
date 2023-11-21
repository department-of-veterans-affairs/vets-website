import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { formConfigBase } from '../../config/form';
import initialData from '../schema/initialData';

describe('781a choice screen', () => {
  const page =
    formConfigBase.chapters.disabilities.pages.ptsdWalkthroughChoice781a;
  const { schema, uiSchema } = page;

  it('should submit without validation errors', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfigBase.defaultDefinitions}
        schema={schema}
        formData={{ initialData }}
        data={{
          'view:selectablePtsdTypes': {
            'view:assaultPtsdType': true,
          },
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
