import { expect } from 'chai';
import formConfig from '../../config/form';

describe('formConfig', () => {
  it('should export an object', () => {
    expect(formConfig).to.be.an('object');
  });

  it('should have a formId', () => {
    expect(formConfig.formId).to.exist;
    expect(formConfig.formId).to.be.a('string');
  });

  it('should have a rootUrl and urlPrefix', () => {
    expect(formConfig.rootUrl).to.be.a('string');
    expect(formConfig.urlPrefix).to.equal('/');
  });

  it('should have an introduction and confirmation component', () => {
    expect(formConfig.introduction).to.be.a('function');
    expect(formConfig.confirmation).to.be.a('function');
  });

  it('should have chapters with applicantInformation', () => {
    expect(formConfig.chapters).to.have.property('applicantInformation');
    expect(formConfig.chapters.applicantInformation).to.have.property('pages');
  });

  it('should have a submitUrl pointing to simple_forms_api', () => {
    expect(formConfig.submitUrl).to.be.a('string');
    expect(formConfig.submitUrl).to.include('simple_forms_api/v1/simple_forms');
  });

  it('should have a getHelp property', () => {
    expect(formConfig.getHelp).to.exist;
  });

  it('should have a title and subTitle', () => {
    expect(formConfig.title).to.exist;
    expect(formConfig.subTitle).to.exist;
  });

  it('should have chapters for veteranInformation, servicePeriods, burialInformation, typeOfRequest, supportingDocuments', () => {
    [
      'veteranInformation',
      'servicePeriods',
      'burialInformation',
      'typeOfRequest',
      'supportingDocuments',
    ].forEach(chapter => {
      expect(formConfig.chapters).to.have.property(chapter);
    });
  });

  it('should have a savedFormMessages object with notFound and noAuth', () => {
    expect(formConfig.savedFormMessages).to.have.property('notFound');
    expect(formConfig.savedFormMessages).to.have.property('noAuth');
  });

  it('should have a trackingPrefix', () => {
    expect(formConfig.trackingPrefix).to.be.a('string');
  });

  it('should have a version number', () => {
    expect(formConfig.version).to.be.a('number');
  });

  it('should have prefillEnabled set to true', () => {
    expect(formConfig.prefillEnabled).to.be.true;
  });

  it('should have a defaultDefinitions object', () => {
    expect(formConfig.defaultDefinitions).to.be.an('object');
  });

  it('should have a footerContent property', () => {
    expect(formConfig.footerContent).to.exist;
  });
});

describe('medallions formConfig depends logic (relationToVetRadio)', () => {
  const dependsCases = [
    {
      chapter: 'applicantInformation',
      page: 'applicantNameView',
      depends:
        formConfig.chapters.applicantInformation.pages.applicantNameView
          .depends,
      scenarios: [
        {
          formData: { 'view:loginState': { isLoggedIn: true } },
          expected: true,
        },
        {
          formData: { 'view:loginState': { isLoggedIn: false } },
          expected: false,
        },
        { formData: {}, expected: undefined },
      ],
    },
    {
      chapter: 'applicantInformation',
      page: 'applicantName',
      depends:
        formConfig.chapters.applicantInformation.pages.applicantName.depends,
      scenarios: [
        {
          formData: { 'view:loginState': { isLoggedIn: false } },
          expected: true,
        },
        {
          formData: { 'view:loginState': { isLoggedIn: true } },
          expected: false,
        },
        { formData: {}, expected: true },
      ],
    },
    {
      chapter: 'applicantInformation',
      page: 'applicantRelationToVetOrg',
      depends:
        formConfig.chapters.applicantInformation.pages.applicantRelationToVetOrg
          .depends,
      scenarios: [
        { formData: { relationToVetRadio: 'repOfCemetery' }, expected: true },
        {
          formData: { relationToVetRadio: 'repOfFuneralHome' },
          expected: true,
        },
        { formData: { relationToVetRadio: 'repOfVSO' }, expected: false },
        { formData: { relationToVetRadio: 'familyMember' }, expected: false },
      ],
    },
    {
      chapter: 'applicantInformation',
      page: 'applicantRelationToVetOrg2',
      depends:
        formConfig.chapters.applicantInformation.pages
          .applicantRelationToVetOrg2.depends,
      scenarios: [
        { formData: { relationToVetRadio: 'repOfVSO' }, expected: true },
        { formData: { relationToVetRadio: 'repOfCemetery' }, expected: false },
      ],
    },
    {
      chapter: 'applicantInformation',
      page: 'applicantContactInfo',
      depends:
        formConfig.chapters.applicantInformation.pages.applicantContactInfo
          .depends,
      scenarios: [
        { formData: { relationToVetRadio: 'familyMember' }, expected: true },
        { formData: { relationToVetRadio: 'personalRep' }, expected: true },
        { formData: { relationToVetRadio: 'other' }, expected: true },
        { formData: { relationToVetRadio: 'repOfVSO' }, expected: false },
      ],
    },
    {
      chapter: 'applicantInformation',
      page: 'applicantContactInfo2',
      depends:
        formConfig.chapters.applicantInformation.pages.applicantContactInfo2
          .depends,
      scenarios: [
        { formData: { relationToVetRadio: 'repOfVSO' }, expected: true },
        { formData: { relationToVetRadio: 'repOfCemetery' }, expected: true },
        {
          formData: { relationToVetRadio: 'repOfFuneralHome' },
          expected: true,
        },
        { formData: { relationToVetRadio: 'familyMember' }, expected: false },
      ],
    },
    {
      chapter: 'applicantInformation',
      page: 'applicantMailingAddress',
      depends:
        formConfig.chapters.applicantInformation.pages.applicantMailingAddress
          .depends,
      scenarios: [
        { formData: { relationToVetRadio: 'familyMember' }, expected: true },
        { formData: { relationToVetRadio: 'personalRep' }, expected: true },
        { formData: { relationToVetRadio: 'other' }, expected: true },
        { formData: { relationToVetRadio: 'repOfVSO' }, expected: false },
      ],
    },
    {
      chapter: 'applicantInformation',
      page: 'applicantMailingAddress2',
      depends:
        formConfig.chapters.applicantInformation.pages.applicantMailingAddress2
          .depends,
      scenarios: [
        { formData: { relationToVetRadio: 'repOfVSO' }, expected: true },
        { formData: { relationToVetRadio: 'repOfCemetery' }, expected: true },
        {
          formData: { relationToVetRadio: 'repOfFuneralHome' },
          expected: true,
        },
        { formData: { relationToVetRadio: 'familyMember' }, expected: false },
      ],
    },
    {
      chapter: 'veteranInformation',
      page: 'veteranDemographics2',
      depends:
        formConfig.chapters.veteranInformation.pages.veteranDemographics2
          .depends,
      scenarios: [
        { formData: { veteranDemoYesNo: true }, expected: true },
        { formData: { veteranDemoYesNo: false }, expected: false },
        { formData: {}, expected: undefined },
      ],
    },
    {
      chapter: 'typeOfRequest',
      page: 'replacementMedallionReason',
      depends:
        formConfig.chapters.typeOfRequest.pages.replacementMedallionReason
          .depends,
      scenarios: [
        { formData: { typeOfRequestRadio: 'replacement' }, expected: true },
        { formData: { typeOfRequestRadio: 'new' }, expected: false },
        { formData: {}, expected: false },
      ],
    },
    {
      chapter: 'typeOfRequest',
      page: 'typeOfMedallion',
      depends: formConfig.chapters.typeOfRequest.pages.typeOfMedallion.depends,
      scenarios: [
        { formData: { typeOfRequestRadio: 'new' }, expected: true },
        { formData: { typeOfRequestRadio: 'replacement' }, expected: false },
        { formData: {}, expected: false },
      ],
    },
    {
      chapter: 'typeOfRequest',
      page: 'medallionSizeBronze',
      depends:
        formConfig.chapters.typeOfRequest.pages.medallionSizeBronze.depends,
      scenarios: [
        {
          formData: {
            typeOfRequestRadio: 'new',
            typeOfMedallionRadio: 'bronze',
          },
          expected: true,
        },
        {
          formData: {
            typeOfRequestRadio: 'new',
            typeOfMedallionRadio: 'medalOfHonor',
          },
          expected: false,
        },
        { formData: { typeOfRequestRadio: 'replacement' }, expected: false },
        { formData: {}, expected: false },
      ],
    },
    {
      chapter: 'typeOfRequest',
      page: 'medallionSizeMOH',
      depends: formConfig.chapters.typeOfRequest.pages.medallionSizeMOH.depends,
      scenarios: [
        {
          formData: {
            typeOfRequestRadio: 'new',
            typeOfMedallionRadio: 'medalOfHonor',
          },
          expected: true,
        },
        {
          formData: {
            typeOfRequestRadio: 'new',
            typeOfMedallionRadio: 'bronze',
          },
          expected: false,
        },
        { formData: { typeOfRequestRadio: 'replacement' }, expected: false },
        { formData: {}, expected: false },
      ],
    },
  ];

  dependsCases.forEach(({ chapter, page, depends, scenarios }) => {
    describe(`depends logic for ${chapter} > ${page}`, () => {
      scenarios.forEach(({ formData, expected }) => {
        it(`returns ${expected} for formData: ${JSON.stringify(
          formData,
        )}`, () => {
          const result = depends(formData);
          expect(result).to.equal(expected);
        });
      });
    });
  });
});
