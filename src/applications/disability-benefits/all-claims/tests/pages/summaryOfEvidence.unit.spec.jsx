import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Summary of Evidence', () => {
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

  it("should render 'no evidence' warning when 'no evidence' selected", () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': false,
        }}
      />,
    );

    expect(form.render().text()).to.contain(
      'You haven’t uploaded any evidence.',
    );
    expect(form.find('li').length).to.equal(0);
  });

  it('should render VA evidence list when VA evidence submitted', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
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
    const fileName1 = 'TestFile.png';
    const fileName2 = 'hospital records.pdf';
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          privateMedicalRecords: [{ name: fileName1 }, { name: fileName2 }],
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(
      list
        .at(0)
        .render()
        .text(),
    ).to.contain(fileName1);
    expect(
      list
        .at(1)
        .render()
        .text(),
    ).to.contain(fileName2);
  });

  it('should render lay evidence list when lay evidence submitted', () => {
    const fileName1 = 'Test Lay Statement.png';
    const fileName2 = 'buddy statement.pdf';
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          additionalDocuments: [{ name: fileName1 }, { name: fileName2 }],
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(
      list
        .at(0)
        .render()
        .text(),
    ).to.contain(fileName1);
    expect(
      list
        .at(1)
        .render()
        .text(),
    ).to.contain(fileName2);
  });
});
