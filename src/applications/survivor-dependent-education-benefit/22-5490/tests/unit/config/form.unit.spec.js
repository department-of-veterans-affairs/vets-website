import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  fillData,
  fillDate,
  selectRadio,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';

const initialData = {
  user: {
    profile: {
      userFullName: {
        first: 'Michael',
        middle: 'Thomas',
        last: 'Wazowski',
        suffix: 'Esq.',
      },
      dob: '1990-02-03',
    },
  },
  form: {
    data: {},
  },
  data: {
    formData: {
      data: {
        attributes: {
          claimant: {
            firstName: 'john',
            middleName: 'doe',
            lastName: 'smith',
            dateOfBirth: '1990-01-01',
          },
        },
      },
    },
  },
};

describe('Complex Form 22-5490 Detailed Interaction Tests', () => {
  describe('applicantInformation', () => {
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
      expect(form.find('input#root_fullName_last').props().value).to.equal(
        'Doe',
      );
      expect(form.find('input#root_ssn').props().value).to.equal('123456789');
      expect(
        form
          .find('input[name="root_relationShipToMember"][value="spouse"]')
          .props().checked,
      ).to.be.true;
      form.unmount();
    });

    it('should render an error when no first/last name are provided', () => {
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

      form.find('input#root_fullName_first').simulate('change', {
        target: { value: '' },
      });
      form.find('input#root_fullName_last').simulate('change', {
        target: { value: '' },
      });
      form.find('input#root_ssn').simulate('change', {
        target: { value: '123456789' },
      });
      form.find('select#root_dateOfBirthMonth').simulate('change', {
        target: { value: '1' },
      });
      form.find('select#root_dateOfBirthDay').simulate('change', {
        target: { value: '1' },
      });
      form.find('input#root_dateOfBirthYear').simulate('change', {
        target: { value: '1990' },
      });
      selectRadio(form, 'root_relationShipToMember', 'spouse');

      form.find('form').simulate('submit');
      const errorMessages = form.find('.usa-input-error-message');

      expect(errorMessages.length).to.be.at.least(1);
      expect(errorMessages.at(0).text()).to.include(
        'Error Please enter a first name',
      );
      expect(errorMessages.at(1).text()).to.include(
        'Error Please enter a last name',
      );

      form.unmount();
    });

    it('should render errors when names are too long', () => {
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

      form.find('input#root_fullName_first').simulate('change', {
        target: { value: 'abcdefghijklmnopqrstuvwxyz' },
      });
      form.find('input#root_fullName_middle').simulate('change', {
        target: { value: 'abcdefghijklmnopqrstuvwxyz' },
      });
      form.find('input#root_fullName_last').simulate('change', {
        target: { value: 'abcdefghijklmnopqrstuvwxyzabcd' },
      });
      form.find('input#root_ssn').simulate('change', {
        target: { value: '123456789' },
      });
      form.find('select#root_dateOfBirthMonth').simulate('change', {
        target: { value: '1' },
      });
      form.find('select#root_dateOfBirthDay').simulate('change', {
        target: { value: '1' },
      });
      form.find('input#root_dateOfBirthYear').simulate('change', {
        target: { value: '1990' },
      });
      selectRadio(form, 'root_relationShipToMember', 'spouse');

      form.find('form').simulate('submit');
      const errorMessages = form.find('.usa-input-error-message');

      expect(errorMessages.length).to.be.at.least(1);
      expect(errorMessages.at(0).text()).to.include(
        'Error Must be 20 characters or less',
      );
      expect(errorMessages.at(1).text()).to.include(
        'Error Must be 20 characters or less',
      );
      expect(errorMessages.at(2).text()).to.include(
        'Error Must be 26 characters or less',
      );

      form.unmount();
    });

    it('should render errors when first/middle/last names are invalid', () => {
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

      form.find('input#root_fullName_first').simulate('change', {
        target: { value: '((((9' },
      });
      form.find('input#root_fullName_middle').simulate('change', {
        target: { value: '&&&&' },
      });
      form.find('input#root_fullName_last').simulate('change', {
        target: { value: '&&&&' },
      });
      form.find('input#root_ssn').simulate('change', {
        target: { value: '123456789' },
      });
      form.find('select#root_dateOfBirthMonth').simulate('change', {
        target: { value: '1' },
      });
      form.find('select#root_dateOfBirthDay').simulate('change', {
        target: { value: '1' },
      });
      form.find('input#root_dateOfBirthYear').simulate('change', {
        target: { value: '1990' },
      });
      selectRadio(form, 'root_relationShipToMember', 'spouse');

      form.find('form').simulate('submit');
      const errorMessages = form.find('.usa-input-error-message');

      expect(errorMessages.length).to.be.at.least(1);
      expect(errorMessages.at(0).text()).to.include(
        'Error Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
      );
      expect(errorMessages.at(1).text()).to.include(
        'Error Please enter a valid entry. Acceptable entries are letters, spaces and apostrophes.',
      );
      expect(errorMessages.at(2).text()).to.include(
        'Error Please enter a valid entry. Acceptable entries are letters, spaces, dashes and apostrophes.',
      );

      form.unmount();
    });
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

    selectRadio(form, 'root_chosenBenefit', 'fry');
    expect(
      form.find('input[name="root_chosenBenefit"][value="fry"]').props()
        .checked,
    ).to.be.true;

    form.unmount();
  });

  // Issue with this spec is there is a custom component to render info
  // have been unable to get a tests that populates the data store so that the
  // component renders correctly
  xit('should fill out the review personal information fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.yourInformationChapter.pages.reviewPersonalInformation;

    const middleware = [thunk];
    const mockStore = configureStore(middleware);

    const { container } = render(
      <Provider store={mockStore(initialData)}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={initialData?.data}
          formData={initialData?.data?.formData}
        />
      </Provider>,
    );

    selectRadio(container, 'root_highSchoolDiploma', 'yes');
    fillDate(container, 'root_graduationDate', '1992-07-07');
    expect(
      container
        .find('input[name="root_highSchoolDiploma"][value="yes"]')
        .props().checked,
    ).to.be.true;
    container.unmount();
  });
  it('should fill out the marriage information fields', () => {
    const baseData = {
      relationShipToMember: 'spouse',
    };
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
        formData={baseData}
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

  // @here fix this issue! think it's
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
    fillData(form, '#root_mailingAddressInput_country', 'USA');
    fillData(form, '#root_mailingAddressInput_street', '123 Main St');
    fillData(form, '#root_mailingAddressInput_city', 'Anytown');
    fillData(form, '#root_mailingAddressInput_state', 'CA');
    fillData(form, '#root_mailingAddressInput_postalCode', '12345');
    expect(
      form.find('#root_mailingAddressInput_street').prop('value'),
    ).to.equal('123 Main St');
    expect(form.find('#root_mailingAddressInput_city').prop('value')).to.equal(
      'Anytown',
    );
    expect(form.find('#root_mailingAddressInput_state').prop('value')).to.equal(
      'CA',
    );
    expect(
      form.find('#root_mailingAddressInput_postalCode').prop('value'),
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
        data={{ title: 'test form', mobilePhone: { phone: '4138675309' } }}
        formData={{ title: 'test form', mobilePhone: { phone: '4138675309' } }}
      />,
    );

    selectRadio(form, 'root_contactMethod', 'Email');
    selectRadio(form, 'root_notificationMethod', 'no');

    expect(
      form.find('input[name="root_contactMethod"][value="Email"]').props()
        .checked,
    ).to.be.true;
    expect(
      form.find('input[name="root_notificationMethod"][value="no"]').props()
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
    fillData(
      form,
      'input[name="root_view:directDeposit_bankAccount_accountNumber"]',
      '123456789',
    );
    fillData(
      form,
      'input[name="root_view:directDeposit_bankAccount_routingNumber"]',
      '031101279',
    );

    expect(
      form
        .find('input[name="root_view:directDeposit_bankAccount_accountNumber"]')
        .prop('value'),
    ).to.equal('123456789');
    expect(
      form
        .find('input[name="root_view:directDeposit_bankAccount_routingNumber"]')
        .prop('value'),
    ).to.equal('031101279');
    form.unmount();
  });
});
