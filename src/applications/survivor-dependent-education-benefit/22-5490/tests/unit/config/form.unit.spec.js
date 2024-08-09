import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import {
  fillData,
  fillDate,
  selectRadio,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';

describe('Complex Form 22-5490 Detailed Interaction Tests', () => {
  it('should fill out the applicant information fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.applicantInformationChapter.pages.applicantInformation;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );

    fillData(form, 'input#root_fullName_first', 'John');
    fillData(form, 'input#root_fullName_last', 'Doe');
    fillData(form, 'input#root_ssn', '123456789');
    selectRadio(form, 'root_relationShipToMember', 'spouse');

    expect(form.find('input#root_fullName_first').props().value).to.equal(
      'John',
    );
    expect(form.find('input#root_fullName_last').props().value).to.equal('Doe');
    expect(form.find('input#root_ssn').props().value).to.equal('123456789');
    expect(
      form
        .find('input[name="root_relationShipToMember"][value="spouse"]')
        .props().checked,
    ).to.be.true;
    form.unmount();
  });
  it('should fill out the benefit selection fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.benefitSelectionChapter.pages.benefitSelection;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );

    selectRadio(form, 'root_benefitToChoose', 'fry');
    expect(
      form.find('input[name="root_benefitToChoose"][value="fry"]').props()
        .checked,
    ).to.be.true;

    form.unmount();
  });
  it('should fill out the review personal information fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.yourInformationChapter.pages.reviewPersonalInformation;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    selectRadio(form, 'root_highSchoolDiploma', 'yes');
    fillDate(form, 'root_graduationDate', '1992-07-07');
    expect(
      form.find('input[name="root_highSchoolDiploma"][value="yes"]').props()
        .checked,
    ).to.be.true;
    form.unmount();
  });
  it('should fill out the marriage information fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.additionalConsiderationsChapter.pages.marriageInformation;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    selectRadio(form, 'root_marriageStatus', 'married');
    expect(
      form.find('input[name="root_marriageStatus"][value="married"]').props()
        .checked,
    ).to.be.true;
    form.unmount();
  });
  it('should fill out the remarriage information fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.additionalConsiderationsChapter.pages.remarriageInformation;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{ marriageStatus: 'divorced' }}
        formData={{}}
      />,
    );
    selectRadio(form, 'root_remarriageStatus', 'no');
    expect(
      form.find('input[name="root_remarriageStatus"][value="no"]').props()
        .checked,
    ).to.be.true;
    form.unmount();
  });
  it('should fill out the outstanding felony fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.additionalConsiderationsChapter.pages.outstandingFelony;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    selectRadio(form, 'root_felonyOrWarrant', 'no');
    expect(
      form.find('input[name="root_felonyOrWarrant"][value="no"]').props()
        .checked,
    ).to.be.true;
    form.unmount();
  });
  it('should fill out the contact information fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.contactInformationChapter.pages.contactInformation;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    fillData(form, 'input#root_mobilePhone', '555-555-5555');
    fillData(form, 'input#root_homePhone', '444-444-4444');
    fillData(form, 'input#root_email', 'test@example.com');
    fillData(form, 'input#root_confirmEmail', 'test@example.com');
    expect(form.find('input#root_mobilePhone').prop('value')).to.equal(
      '555-555-5555',
    );
    expect(form.find('input#root_homePhone').prop('value')).to.equal(
      '444-444-4444',
    );
    expect(form.find('input#root_email').prop('value')).to.equal(
      'test@example.com',
    );
    expect(form.find('input#root_confirmEmail').prop('value')).to.equal(
      'test@example.com',
    );
    form.unmount();
  });
  xit('should fill out the mailing address fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.contactInformationChapter.pages.mailingAddress;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    fillData(form, 'input#root_mailingAddressInput_country', 'USA');
    fillData(form, 'input#root_mailingAddressInput_street', '123 Main St');
    fillData(form, 'input#root_mailingAddressInput_city', 'Anytown');
    fillData(form, 'select#root_mailingAddressInput_state', 'CA');
    fillData(form, 'input#root_mailingAddressInput_postalCode', '12345');
    expect(
      form.find('input#root_mailingAddressInput_street').prop('value'),
    ).to.equal('123 Main St');
    expect(
      form.find('input#root_mailingAddressInput_city').prop('value'),
    ).to.equal('Anytown');
    expect(
      form.find('select#root_mailingAddressInput_state').prop('value'),
    ).to.equal('CA');
    expect(
      form.find('input#root_mailingAddressInput_postalCode').prop('value'),
    ).to.equal('12345');
    form.unmount();
  });
  it('should fill out the contact method fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.contactInformationChapter.pages.chooseContactMethod;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{ title: 'test form' }}
        formData={{ title: 'test form' }}
      />,
    );
    selectRadio(form, 'root_contactMethod', 'email');
    selectRadio(form, 'root_notificationMethod', 'yes');
    expect(
      form.find('input[name="root_contactMethod"][value="email"]').props()
        .checked,
    ).to.be.true;
    expect(
      form.find('input[name="root_notificationMethod"][value="yes"]').props()
        .checked,
    ).to.be.true;
    form.unmount();
  });
  it('should fill out the direct deposit fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.directDepositChapter.pages.directDeposit;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    fillData(form, 'input#root_bankAccount_accountNumber', '123456789');
    fillData(form, 'input#root_bankAccount_routingNumber', '987654321');
    selectRadio(form, 'root_bankAccount_accountType', 'checking');
    expect(
      form.find('input#root_bankAccount_accountNumber').prop('value'),
    ).to.equal('123456789');
    expect(
      form.find('input#root_bankAccount_routingNumber').prop('value'),
    ).to.equal('987654321');
    expect(
      form
        .find('input[name="root_bankAccount_accountType"][value="checking"]')
        .props().checked,
    ).to.be.true;
    form.unmount();
  });
});
