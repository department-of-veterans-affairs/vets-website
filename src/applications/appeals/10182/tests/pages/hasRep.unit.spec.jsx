import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('NOD has representative page', () => {
  const { schema, uiSchema } = formConfig.chapters.infoPages.pages.hasRep;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should allow submit', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(form, 'root_view:hasRep', 'Y');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
