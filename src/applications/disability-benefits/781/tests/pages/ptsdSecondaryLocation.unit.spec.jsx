import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('781a Event location', () => {
  const page =
    formConfig.chapters.disabilityDetails.pages.ptsdSecondaryLocation;
  const { schema, uiSchema, arrayPath } = page;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:selectablePtsdTypes': {
            'view:assaultPtsdType': true,
          },
        }}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(1);
    expect(form.find('select').length).to.equal(2);
    expect(form.find('textarea').length).to.equal(1);
  });

  it('should fill in event location details', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:selectablePtsdTypes': {
            'view:assaultPtsdType': true,
          },
        }}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'select#root_secondaryIncidentLocation_country', 'USA');
    fillData(form, 'input#root_secondaryIncidentLocation_city', 'San Diego');
    fillData(form, 'select#root_secondaryIncidentLocation_state', 'CA');
    fillData(
      form,
      'textarea#root_secondaryIncidentLocation_additionalDetails',
      'It was near the cannons, on the southeast side.',
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
  it('should allow submission if no event location details are submitted', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{
          'view:selectablePtsdTypes': {
            'view:assaultPtsdType': true,
          },
        }}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
