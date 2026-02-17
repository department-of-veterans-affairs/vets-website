import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Summary of Evidence', () => {
  const { schema, uiSchema } =
    formConfig.chapters.supportingEvidence.pages.summaryOfEvidence;

  const vaTreatmentFacilities = [
    { treatmentCenterName: 'Sommerset' },
    { treatmentCenterName: 'Huntsville' },
  ];

  const privateFacilities = [
    {
      providerFacilityName: 'Provider',
      treatmentDateRange: [{ from: '2010-02-03', to: '2012-03-05' }],
      providerFacilityAddress: {
        street: '1234 test rd',
        city: 'Testville',
        postalCode: '12345',
        country: 'USA',
        state: 'AZ',
      },
    },
    {
      providerFacilityName: 'Another Provider',
      treatmentDateRange: [{ from: '2010-03-04', to: '2012-02-03' }],
      providerFacilityAddress: {
        street: '1234 test rd',
        city: 'Testville',
        country: 'USA',
        state: 'AZ',
        postalCode: '12345',
      },
    },
  ];

  const privateMedicalRecordAttachments = [
    { name: 'TestFile.png' },
    { name: 'hospital records.pdf' },
  ];

  const additionalDocuments = [
    { name: 'Test Lay Statement.png' },
    { name: 'buddy statement.pdf' },
  ];

  const serviceTreatmentRecordsAttachments = [
    { name: 'service record 1.pdf' },
    { name: 'service record 2.pdf' },
  ];

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
    form.unmount();
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
    form.unmount();
  });

  it("should render 'no evidence' warning when 'no evidence' selected even if evidence present", () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': false,
          vaTreatmentFacilities,
          privateMedicalRecordAttachments,
          additionalDocuments,
          providerFacility: privateFacilities,
        }}
      />,
    );

    expect(form.render().text()).to.contain(
      'You haven’t uploaded any evidence.',
    );
    expect(form.find('li').length).to.equal(0);
    form.unmount();
  });

  it('should not render any evidence whose evidence type was not selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          // Note: this isn't technically a valid state, because you are required
          // to select at least one type if hasEvidence is true, but it lets us
          // test that unselected evidence types aren't displayed
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {},
          vaTreatmentFacilities,
          privateMedicalRecordAttachments,
          additionalDocuments,
          providerFacility: privateFacilities,
        }}
      />,
    );

    expect(form.find('li').length).to.equal(0);
    form.unmount();
  });

  it('should render VA evidence list when VA evidence submitted', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
          vaTreatmentFacilities,
        }}
      />,
    );

    expect(form.find('li').length).to.equal(2);
    form.unmount();
  });

  it('should render private medical facility list when private facilities selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          providerFacility: privateFacilities,
        }}
      />,
    );

    expect(form.render().text()).to.contain('Provider');
    expect(form.render().text()).to.contain('Another Provider');
    expect(form.find('li').length).to.equal(2);
    form.unmount();
  });

  it('should render private evidence list when private evidence submitted', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': true,
          },
          privateMedicalRecordAttachments,
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(list.at(0).render().text()).to.contain(
      privateMedicalRecordAttachments[0].name,
    );
    expect(list.at(1).render().text()).to.contain(
      privateMedicalRecordAttachments[1].name,
    );
    form.unmount();
  });

  it('should not render private medical facilities even if entered, when upload selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': true,
          },
          providerFacility: privateFacilities,
        }}
      />,
    );

    expect(form.find('li').length).to.equal(0);
    form.unmount();
  });

  it('should not render private evidence uploads even if uploaded, when upload not selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          privateMedicalRecordAttachments,
        }}
      />,
    );

    expect(form.find('li').length).to.equal(0);
    form.unmount();
  });

  it('should render lay evidence list when lay evidence submitted', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasOtherEvidence': true,
          },
          additionalDocuments,
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(list.at(0).render().text()).to.contain(additionalDocuments[0].name);
    expect(list.at(1).render().text()).to.contain(additionalDocuments[1].name);
    form.unmount();
  });
  it('should render service treatment records list when service treatment records submitted', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:uploadServiceTreatmentRecordsQualifier': {
            'view:hasServiceTreatmentRecordsToUpload': true,
          },
          serviceTreatmentRecordsAttachments,
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(list.at(0).render().text()).to.contain(
      serviceTreatmentRecordsAttachments[0].name,
    );
    expect(list.at(1).render().text()).to.contain(
      serviceTreatmentRecordsAttachments[1].name,
    );
    form.unmount();
  });
  it('should render with updated title when the enhancment feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{ disability526SupportingEvidenceEnhancement: true }}
      />,
    );

    expect(form.render().text()).to.contain(
      'Summary of supporting evidence for your disability claim',
    );
    expect(form.find('li').length).to.equal(0);
    form.unmount();
  });
  it('should render additional content when there is evidence submitted when enhancement feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
          vaTreatmentFacilities,
          disability526SupportingEvidenceEnhancement: true,
        }}
      />,
    );

    expect(form.render().text()).to.contain(
      'You provided documents to support your claim.',
    );
    expect(form.render().text()).to.contain(
      'Next, we’ll share some information about what to expect during a claim exam.',
    );
    form.unmount();
  });
  it('should render VA evidence list when VA evidence submitted and updated headings when enhancement feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasVaMedicalRecords': true,
          },
          vaTreatmentFacilities,
          disability526SupportingEvidenceEnhancement: true,
        }}
      />,
    );

    expect(form.find('li').length).to.equal(2);
    expect(form.render().text()).to.contain(
      'We’ll request your VA medical records on your behalf from these VA medical centers:',
    );
    form.unmount();
  });
  it('should render private medical facility list when private facilities selected with updated headings when enhancement feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': false,
          },
          providerFacility: privateFacilities,
          disability526SupportingEvidenceEnhancement: true,
        }}
      />,
    );

    expect(form.render().text()).to.contain('Provider');
    expect(form.render().text()).to.contain('Another Provider');
    expect(form.find('li').length).to.equal(2);
    expect(form.render().text()).to.contain(
      'We’ll request your private medical records on your behalf from these medical centers:',
    );
    form.unmount();
  });
  it('should render private evidence list when private evidence submitted with updated heading when enhancement feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': true,
          },
          privateMedicalRecordAttachments,
          disability526SupportingEvidenceEnhancement: true,
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(list.at(0).render().text()).to.contain(
      privateMedicalRecordAttachments[0].name,
    );
    expect(list.at(1).render().text()).to.contain(
      privateMedicalRecordAttachments[1].name,
    );
    expect(form.render().text()).to.contain(
      'We’ll submit these private medical records you uploaded:',
    );
    form.unmount();
  });
  it('should not render private medical facilities even if entered, when upload selected when enhancement feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasPrivateMedicalRecords': true,
          },
          'view:uploadPrivateRecordsQualifier': {
            'view:hasPrivateRecordsToUpload': true,
          },
          providerFacility: privateFacilities,
          disability526SupportingEvidenceEnhancement: true,
        }}
      />,
    );

    expect(form.find('li').length).to.equal(0);
    form.unmount();
  });
  it('should render lay evidence list when lay evidence submitted with updated heading when enhancement feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:selectableEvidenceTypes': {
            'view:hasOtherEvidence': true,
          },
          additionalDocuments,
          disability526SupportingEvidenceEnhancement: true,
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(list.at(0).render().text()).to.contain(additionalDocuments[0].name);
    expect(list.at(1).render().text()).to.contain(additionalDocuments[1].name);
    expect(form.render().text()).to.contain(
      'We’ll submit these documents you uploaded as evidence supporting your claim:',
    );
    form.unmount();
  });
  it('should render service treatment records list when service treatment records submitted with updated heading when enhancement feature is on', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasEvidence': true,
          'view:uploadServiceTreatmentRecordsQualifier': {
            'view:hasServiceTreatmentRecordsToUpload': true,
          },
          serviceTreatmentRecordsAttachments,
          disability526SupportingEvidenceEnhancement: true,
        }}
      />,
    );

    const list = form.find('li');
    expect(list.length).to.equal(2);
    expect(list.at(0).render().text()).to.contain(
      serviceTreatmentRecordsAttachments[0].name,
    );
    expect(list.at(1).render().text()).to.contain(
      serviceTreatmentRecordsAttachments[1].name,
    );
    expect(form.render().text()).to.contain(
      'We’ll submit these service treatment records you uploaded:',
    );
    form.unmount();
  });
});
