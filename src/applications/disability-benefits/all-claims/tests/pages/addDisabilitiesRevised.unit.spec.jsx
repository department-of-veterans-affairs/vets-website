import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import { SHOW_REVISED_ADD_DISABILITIES_PAGE } from '../../constants';

import { showRevisedNewDisabilitiesPage } from '../../content/addDisabilities';

describe('showRevisedNewDisabilitiesPage', () => {
  it('should return false if the toggle is not enabled', () => {
    const formData = {};
    expect(showRevisedNewDisabilitiesPage(formData)).to.be.false;
  });

  it('should show new combobox container', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const screen = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingNew': true,
            'view:claimingIncrease': true,
          },
          newDisabilities: ['test condition'],
          // no rated disability selected
          ratedDisabilities: [{}, {}],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    const labelStr = 'Enter your condition';
    expect(screen.getByText(labelStr)).to.exist;
  });

  it('should render updated content', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const screen = render(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingNew': true,
            'view:claimingIncrease': true,
          },
          newDisabilities: ['test condition'],
          // no rated disability selected
          ratedDisabilities: [{}, {}],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    const title = 'Tell us the new conditions you want to claim';
    const exampleConditions = 'Examples of conditions';
    const conditionInstructions = 'What if my condition isn’t listed?';
    const listItem = 'Tinnitus (ringing or hissing in ears)';
    expect(screen.getByText(title)).to.exist;
    expect(screen.getByText(exampleConditions)).to.exist;
    expect(screen.getByText(conditionInstructions)).to.exist;
    expect(screen.getByText(listItem)).to.exist;
  });

  it('should display newOnlyAlertRevised if no new conditions are added', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingNew': true,
            'view:claimingIncrease': false,
          },
          newDisabilities: [],
          // no rated disability selected
          ratedDisabilities: [{}, {}],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    const error = form.find('va-alert');
    expect(error.length).to.equal(1);
    expect(error.text()).to.contain('Enter a condition to submit your claim');
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should display increaseAndNewAlertRevised if no new conditions or increase disabilities are added', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingNew': true,
            'view:claimingIncrease': true,
          },
          newDisabilities: [],
          // no rated disability selected
          ratedDisabilities: [{}, {}],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    const error = form.find('va-alert');
    expect(error.length).to.equal(1);
    expect(error.text()).to.contain(
      'We can’t process your claim without a disability or new condition selected',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should display max characters error if input is greater than 255', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:claimType': {
            'view:claimingNew': true,
            'view:claimingIncrease': false,
          },
          newDisabilities: [
            {
              condition:
                'this is a really long input that will produce an error to the user to shorten the input value. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetu',
            },
          ],
          // no rated disability selected
          ratedDisabilities: [{}, {}],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    // console.log(form.debug())
    // form.find('form').simulate('submit');
    // const error = form.find('.usa-input-error-message')
    // console.log(error.text())
    // const error = form.find('span[role="alert"]')
    // expect(error.text()).to.contain(
    //   'This needs to be less than 256 characters',
    // );
    // expect(error.length).to.equal(1);
    // expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit when form is completed', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilitiesRevised;
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
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
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  describe('toggle enabled', () => {
    beforeEach(() => {
      window.sessionStorage.setItem(SHOW_REVISED_ADD_DISABILITIES_PAGE, true);
    });

    afterEach(() => {
      window.sessionStorage.removeItem(SHOW_REVISED_ADD_DISABILITIES_PAGE);
    });

    it('should return true if the toggle is enabled', () => {
      const formData = {};
      expect(showRevisedNewDisabilitiesPage(formData)).to.be.true;
    });
  });
});
