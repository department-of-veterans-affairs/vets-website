import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester } from '../../../../src/platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../../src/js/disability-benefits/526EZ/config/form.js';
import initialData from '../schema/initialData.js';

initialData.prefilled = false;

describe('526EZ veteran information', () => {
  const page = formConfig.chapters.veteranDetails.pages.veteranInformation;
  const { schema, uiSchema } = page;

  it('should render', () => {
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{}}
      uiSchema={uiSchema}/>
    );

    expect(form.find('select').length).to.equal(3);
    expect(form.find('input').length).to.equal(6);
  });

  it('should not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={{}}
      uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(6);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data', () => {
    const onSubmit = sinon.spy();
    const form = mount(<DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={schema}
      data={initialData}
      onSubmit={onSubmit}
      uiSchema={uiSchema}/>
    );


    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
