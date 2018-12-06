import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  selectRadio,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('New disabilities follow up info', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.disabilities.pages.newDisabilityFollowUp;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [
            {
              name: 'Test',
            },
          ],
          newDisabilities: [
            {
              condition: 'New condition',
            },
          ],
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(4);
  });

  it('should render NEW disability follow up questions', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [
            {
              name: 'Test',
            },
          ],
          newDisabilities: [
            {
              condition: 'New condition',
            },
          ],
        }}
        formData={{}}
      />,
    );

    selectRadio(form, 'root_cause', 'NEW');

    expect(form.find('input').length).to.equal(4);
    expect(form.find('textarea').length).to.equal(1);
  });

  it('should render SECONDARY disability follow up questions', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [
            {
              name: 'Test',
            },
          ],
          newDisabilities: [
            {
              condition: 'New condition',
            },
          ],
        }}
        formData={{}}
      />,
    );

    selectRadio(form, 'root_cause', 'SECONDARY');

    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(1);
    expect(form.find('select').find('option').length).to.equal(2);
  });

  it('should render WORSENED disability followup questions', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [
            {
              name: 'Test',
            },
          ],
          newDisabilities: [
            {
              condition: 'New condition',
            },
          ],
        }}
        formData={{}}
      />,
    );

    selectRadio(form, 'root_cause', 'WORSENED');

    expect(form.find('input').length).to.equal(5);
    expect(form.find('textarea').length).to.equal(1);
  });

  it('should render VA mistreatment disability followup questions', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [
            {
              name: 'Test',
            },
          ],
          newDisabilities: [
            {
              condition: 'New condition',
            },
          ],
        }}
        formData={{}}
      />,
    );

    selectRadio(form, 'root_cause', 'VA');

    expect(form.find('input').length).to.equal(6);
    expect(form.find('textarea').length).to.equal(1);
  });

  it('should not submit when data not filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: 'Test',
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: 'Test',
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(form, 'root_cause', 'NEW');
    fillData(form, 'textarea#root_primaryDescription', 'Testing');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });
});
