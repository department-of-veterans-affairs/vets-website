import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import set from 'platform/utilities/data/set';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import { updateFormData } from '../../pages/addDisabilitiesRevised';

describe('showRevisedNewDisabilitiesPage', () => {
  it('should show new combobox container', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilities;
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
    } = formConfig.chapters.disabilities.pages.addDisabilities;
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
    const conditionInstructions = 'If your conditions aren’t listed';
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
    } = formConfig.chapters.disabilities.pages.addDisabilities;
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
    } = formConfig.chapters.disabilities.pages.addDisabilities;
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

  it('should submit when form is completed', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.disabilities.pages.addDisabilities;
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

  describe('updateFormData', () => {
    // It's a function just to make sure we're not mutating it anywhere along the way
    const oldData = () => ({
      newDisabilities: [{ condition: 'Something with-hyphens and ALLCAPS' }],
      vaTreatmentFacilities: [
        {
          treatedDisabilityNames: {
            somethingwithhyphensandallcaps: true,
          },
        },
      ],
      'view:isPow': {
        powDisabilities: { somethingwithhyphensandallcaps: true },
      },
    });

    describe('should return unmodified newData', () => {
      it("if oldData.newDisabilities doesn't exist", () => {
        const newData = { newDisabilities: ['foo'] };
        expect(updateFormData({}, newData)).to.deep.equal(newData);
      });
      it("if newData.newDisabilities doesn't exist", () => {
        const newData = {};
        expect(updateFormData(oldData(), newData)).to.deep.equal(newData);
      });
      it('if no disabilities changed', () => {
        const old = oldData();
        expect(updateFormData(old, old)).to.deep.equal(old);
      });
    });

    it('should not modify oldData', () => {
      const old = oldData();
      updateFormData(
        old,
        set('newDisabilities[1]', { condition: 'Something else' }, oldData()),
      );
      expect(old).to.deep.equal(oldData());
    });

    it('should change the property name in treatedDisabilityNames and powDisabilities when a disability name is changed', () => {
      const newData = set(
        'newDisabilities[0].condition',
        'Foo-with EXTRAz',
        oldData(),
      );
      const result = updateFormData(oldData(), newData);
      expect(
        result.vaTreatmentFacilities[0].treatedDisabilityNames.foowithextraz,
      ).to.be.true;
      expect(result['view:isPow'].powDisabilities.foowithextraz).to.be.true;
    });

    it('should remove a deleted disability from treatedDisabilityNames and powDisabilities', () => {
      const newData = Object.assign(oldData(), { newDisabilities: [] });
      const result = updateFormData(oldData(), newData);
      expect(result.vaTreatmentFacilities[0].treatedDisabilityNames).to.be
        .empty;
      expect(result['view:isPow'].powDisabilities).to.be.empty;
    });
  });
});
