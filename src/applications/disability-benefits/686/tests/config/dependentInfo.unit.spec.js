import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';

import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 dependent info', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.unMarriedChildren.pages.childrenInformation;
  const dependentData = () =>
    // default child age is between 18 - 23
    ({
      'view:hasUnmarriedChildren': true,
      dependents: [
        {
          fullName: {
            first: 'Jane',
            last: 'Doe',
          },
          // Child needs to be between 18 & 23
          childDateOfBirth: moment()
            .subtract(18, 'years')
            .format('YYYY-MM-DD'),
        },
      ],
    });

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={dependentData()}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(7); // `disabled` question hidden
    form.unmount();
  });

  it('should show disabled question if child is less than 18 years old', () => {
    const props = dependentData();
    const underageBirthday = moment()
      .subtract(17, 'years')
      .format('YYYY-MM-DD');
    props.dependents[0].childDateOfBirth = underageBirthday;
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={props}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(7); // `inSchool` question hidden
    form.unmount();
  });

  it('should not show show disabled question if child is 18 years old', () => {
    const props = dependentData();
    const underageBirthday = moment()
      .subtract(18, 'years')
      .format('YYYY-MM-DD');
    props.dependents[0].childDateOfBirth = underageBirthday;
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={props}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(7); // `inSchool` question visible
    form.unmount();
  });

  it('should not show disabled or inSchool if child is older than 23', () => {
    const props = dependentData();
    const over23Birthday = moment()
      .subtract(24, 'years')
      .format('YYYY-MM-DD');
    props.dependents[0].childDateOfBirth = over23Birthday;
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        data={props}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        data={dependentData()}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit form with required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        data={dependentData()}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_childSocialSecurityNumber', '222-22-2424');
    selectRadio(form, 'root_childRelationship', 'adopted');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should expand view:stepChildCondition if stepChild is selected', () => {
    const form = mount(
      <DefinitionTester
        data={dependentData()}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_childRelationship', 'stepchild');
    expect(form.find('input').length).to.equal(9); // `disabled` question hidden
    form.unmount();
  });
});
