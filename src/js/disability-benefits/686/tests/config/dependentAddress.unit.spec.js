import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 dependent info', () => {
  const { schema, uiSchema, arrayPath } = formConfig.chapters.unMarriedChildren.pages.childrenAddress;
  const dependentData = () => {
    // default child age is between 18 - 23
    return {
      'view:hasUnmarriedChildren': true,
      dependents: [
        {
          fullName: {
            first: 'Jane',
            last: 'Doe'
          },
          childSocialSecurityNumber: '222-24-2525',
          childRelationship: 'biological',
          childInHousehold: true
        },
      ]
    };
  };
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={dependentData()}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    expect(form.find('input').length).to.equal(2);
  });

  it('should not submit empty form', () => {
    const props = dependentData();
    props.dependents[0].childInHousehold = null;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={props}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit form if child lives with applicant', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={dependentData()}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should expand address info if child does not live with applicant', () => {
    const props = dependentData();
    props.dependents[0].childInHousehold = false;
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={props}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );
    expect(form.find('input').length).to.equal(8);

  });
  xit('should submit form with required fields filled', () => {
    const props = dependentData();
    props.dependents[0].childInHousehold = false;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        data={dependentData()}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    fillData(form, 'input#root_childInfo_childAddress_street', 'test st');
    // fillData(form, 'input#root_childInfo_childAddress_city', 'test city');
    // fillData(form, 'select#root_childInfo_childAddress_state', 'CA');
    // fillData(form, 'input#root_childInfo_childAddress_postalCode', '91111');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});

