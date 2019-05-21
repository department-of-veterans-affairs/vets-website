import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import set from '../../../../../platform/utilities/data/set';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

import { newDisabilitiesHook } from '../../pages/addDisabilities';

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

  describe('newDisabilitiesHook', () => {
    // It's a function just to make sure we're not mutating it anywhere along the way
    const oldData = () => ({
      newDisabilities: [
        { name: 'Something', uuid: '9238da0f1bc9316de95ab0c3f68ea35' },
      ],
      vaTreatmentFacilities: [
        { treatedDisabilityNames: { '9238da0f1bc9316de95ab0c3f68ea35': true } },
      ],
      'view:isPow': {
        powDisabilities: { '9238da0f1bc9316de95ab0c3f68ea35': true },
      },
    });

    it('should not modify oldData', () => {
      const old = oldData();
      newDisabilitiesHook(
        old,
        set('newDisabilities[1]', { name: 'Something else' }, oldData()),
      );
      expect(old).to.deep.equal(oldData());
    });

    it('should give a uuid to a new disability', () => {
      const newData = set(
        'newDisabilities[1]',
        { name: 'Something else' },
        oldData(),
      );
      const result = newDisabilitiesHook(oldData(), newData);
      // uuids are strings with a length of 32
      expect(result.newDisabilities[1].uuid).to.have.length(32);
    });

    it('should remove a deleted disability from treatedDisabilityNames and powDisabilities', () => {
      const newData = Object.assign(oldData(), { newDisabilities: [] });
      const result = newDisabilitiesHook(oldData(), newData);
      expect(result.vaTreatmentFacilities[0].treatedDisabilityNames).to.be
        .empty;
      expect(result['view:isPow'].powDisabilities).to.be.empty;
    });

    it('should not change any data if a disability was modified', () => {
      const newData = set(
        'newDisabilities[0].name',
        'Something else',
        oldData(),
      );
      const result = newDisabilitiesHook(oldData(), newData);
      expect(
        result.vaTreatmentFacilities[0].treatedDisabilityNames,
      ).to.deep.equal(
        oldData().vaTreatmentFacilities[0].treatedDisabilityNames,
      );
      expect(result['view:isPow'].powDisabilities).to.deep.equal(
        oldData()['view:isPow'].powDisabilities,
      );
    });
  });
});
