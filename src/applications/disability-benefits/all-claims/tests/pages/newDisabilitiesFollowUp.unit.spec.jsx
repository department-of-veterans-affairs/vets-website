import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  selectRadio,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

// 445 characters
const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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
    form.unmount();
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
    form.unmount();
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
    form.unmount();
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
    form.unmount();
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
    form.unmount();
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
    form.unmount();
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
    form.unmount();
  });

  it('should not submit when primaryDescription is too long', () => {
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
    fillData(form, 'textarea#root_primaryDescription', longText);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not submit when worsened followup descriptions are too long', () => {
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

    selectRadio(form, 'root_cause', 'WORSENED');
    fillData(
      form,
      'input[id="root_view:worsenedFollowUp_worsenedDescription"]',
      longText,
    );
    fillData(
      form,
      'textarea[id="root_view:worsenedFollowUp_worsenedEffects"]',
      longText,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not submit when causedByDisabilityDescription is too long', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [{ name: 'Old condition' }],
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

    selectRadio(form, 'root_cause', 'SECONDARY');
    fillData(
      form,
      'select[name="root_view:secondaryFollowUp_causedByDisability"]',
      'Old Condition',
    );
    fillData(
      form,
      'textarea[id="root_view:secondaryFollowUp_causedByDisabilityDescription"]',
      longText,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not submit when VA mistreatment fields are too long', () => {
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

    selectRadio(form, 'root_cause', 'VA');
    fillData(
      form,
      'textarea[id="root_view:vaFollowUp_vaMistreatmentDescription"]',
      longText,
    );
    fillData(
      form,
      'input[id="root_view:vaFollowUp_vaMistreatmentLocation"]',
      longText,
    );
    fillData(
      form,
      'input[id="root_view:vaFollowUp_vaMistreatmentDate"]',
      longText,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
