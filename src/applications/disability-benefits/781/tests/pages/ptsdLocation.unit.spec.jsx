import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('781 PTSD Location', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.disabilityDetails.pages.ptsdLocation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
      />,
    );

    expect(form.find('input[type="text"]').length).to.equal(1);
    expect(form.find('textarea').length).to.equal(1);
    expect(form.find('select').length).to.equal(2);
  });

  it('should render state field as text for countries other than USA, MEX, and CAN', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
      />,
    );

    fillData(form, 'select#root_incidentLocation_country', 'ABW');

    expect(form.find('input[type="text"]').length).to.equal(2);
    expect(form.find('textarea').length).to.equal(1);
    expect(form.find('select').length).to.equal(1);
  });

  it('should submit', () => {
    const onSubmit = sinon.spy();

    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:selectablePtsdTypes': {
            'view:combatPtsdType': true,
          },
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
