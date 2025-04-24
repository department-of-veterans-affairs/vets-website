import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const definitions = formConfig.defaultDefinitions;

describe('Edu 10282 contact information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.personalInformation.pages.applicantGender;
  it('renders the correct amount of inputs', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('va-radio').length).to.equal(1);
    form.unmount();
  });

  it('should show errors when required fields are empty', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
        definitions={definitions}
        // data={formData}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('va-radio[error]').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
