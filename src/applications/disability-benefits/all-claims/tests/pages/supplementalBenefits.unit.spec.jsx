import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

import { ERR_MSG_CSS_CLASS } from '../../constants';

describe('Supplmental Benefits 8940', () => {
  const opts = { showSubforms: true };
  const { schema, uiSchema } = formConfig(
    opts,
  ).chapters.disabilities.pages.supplementalBenefits;
  const defaultDefinitions = formConfig(opts).defaultDefinitions;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('should submit if no options selected', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        definitions={defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
