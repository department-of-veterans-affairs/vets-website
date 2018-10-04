import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe.only('Summary of Evidence', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.supportingEvidence.pages.summaryOfEvidence;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    expect(form.render().text()).to.contain('Summary of evidence');
    expect(form.find('li').length).to.equal(0);
  });

  it('should render VA evidence list when VA evidence submitted', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          vaTreatmentFacilities: [
            { treatmentCenterName: 'Sommerset' },
            { treatmentCenterName: 'Huntsville' },
          ],
        }}
      />,
    );

    expect(form.find('li').length).to.equal(2);
  });

  it('should render private evidence list when private evidence submitted', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          privateMedicalRecords: [
            { name: 'Test File.png' },
            { name: 'hospital records.pdf' },
          ],
        }}
      />,
    );

    expect(form.find('li').length).to.equal(2);
  });

  // it('should render lay evidence list when lay evidence submitted', () => {
  //   const form = mount(
  //     <DefinitionTester
  //       definitions={formConfig.defaultDefinitions}
  //       schema={schema}
  //       uiSchema={uiSchema}
  //       data={{
  //         vaTreatmentFacilities: [
  //           { treatmentCenterName: 'Sommerset' },
  //           { treatmentCenterName: 'Huntsville' },
  //         ],
  //       }}
  //     />,
  //   );

  //   expect(form.find('li').length).to.equal(2);
  // });
});
