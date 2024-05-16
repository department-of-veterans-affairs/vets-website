import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import set from 'platform/utilities/data/set';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

import { updateFormData } from '../../pages/addDisabilities';

describe('Add new disabilities', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilities.pages.addDisabilities;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(1);
    form.unmount();
  });

  it('should add another disability', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: 'Abnormal Heart',
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('.va-growable-add-btn').simulate('click');

    expect(
      form
        .find('.va-growable-background')
        .first()
        .text(),
    ).to.contain('Abnormal Heart');
    form.unmount();
  });

  it('should submit when data filled in', () => {
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

  it('should show new conditions only alert', () => {
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
          // previously selected rated disability
          ratedDisabilities: [{}, { 'view:selected': true }],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    const error = form.find('va-alert');
    expect(error.length).to.equal(1);
    expect(error.text()).to.contain('add a new disability to claim');
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should show increase & new alert', () => {
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
    expect(error.text()).to.contain('add a new disability or choose a rated');
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not submit when an empty field is submitted', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              condition: '',
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    const error = form.find('.usa-input-error-message');
    expect(error.length).to.equal(1);
    expect(error.text()).to.include('enter a condition or select one');
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not submit when "unknown condition" is submitted', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [
            {
              // case in-sensitive; specifically preventing this because it was
              // previously the default text used when the user submitted an
              // empty string
              condition: 'UNKnowN COnDitioN',
            },
          ],
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    const error = form.find('.usa-input-error-message');
    expect(error.length).to.equal(1);
    expect(error.text()).to.include('enter a condition or select one');
    expect(onSubmit.called).to.be.false;
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
