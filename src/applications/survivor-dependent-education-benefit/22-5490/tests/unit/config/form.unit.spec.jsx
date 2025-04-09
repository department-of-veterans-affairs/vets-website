import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  fillData,
  selectRadio,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../../config/form';

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

    it('should render an error when last name is too short', () => {
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
        target: { value: 'john' },
      });
      form.find('input#root_fullName_middle').simulate('change', {
        target: { value: 'tesh' },
      });
      form.find('input#root_fullName_last').simulate('change', {
        target: { value: 'a' },
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
        'Must be 2 characters or more',
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

  it('should fill out the review personal information fields', () => {
    const initialState = {
      user: {
        profile: {
          userFullName: {
            first: 'john',
            middle: 't',
            last: 'test',
          },
          dob: '1990-01-01',
        },
      },
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.yourInformationChapter.pages.reviewPersonalInformation;

    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );
    expect(form.find('h3').text()).to.include(
      'Review your personal information',
    );
    form.unmount();
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
        data={baseData}
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
        data={{
          marriageStatus: 'divorced',
          relationShipToMember: 'spouse',
          remarriageStatus: 'yes',
        }}
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

  // @here fix this issue!
  it('should fill out the contact information fields', () => {
    const initialState = {
      user: {
        profile: {
          userFullName: {
            first: 'john',
            middle: 't',
            last: 'test',
          },
          dob: '1990-01-01',
        },
      },
      form: {
        data: {
          duplicateEmail: [],
          duplicatePhone: [],
          email: '',
        },
      },
      data: {
        openModal: false,
      },
    };
    const middlewares = [thunk];
    const mockStore = configureStore(middlewares);
    const store = mockStore(initialState);
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.contactInformationChapter.pages.contactInformation;
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{}}
          formData={{}}
        />
      </Provider>,
    );

    fillData(form, 'input#root_mobilePhone_phone', '555-555-5555');
    fillData(form, 'input#root_homePhone_phone', '444-444-4444');
    fillData(form, 'input#root_email', 'test@test.com');
    expect(form.find('input#root_mobilePhone_phone').prop('value')).to.equal(
      '555-555-5555',
    );
    expect(form.find('input#root_homePhone_phone').prop('value')).to.equal(
      '444-444-4444',
    );

    form.unmount();
  });
  it('should fill out the mailing address fields', () => {
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
    form
      .find('select#root_mailingAddressInput_address_country')
      .simulate('change', {
        target: { value: 'USA' },
      });
    fillData(
      form,
      'input#root_mailingAddressInput_address_street',
      '123 Main St',
    );
    fillData(form, 'input#root_mailingAddressInput_address_city', 'Anytown');
    form
      .find('select#root_mailingAddressInput_address_state')
      .simulate('change', {
        target: { value: 'CA' },
      });
    fillData(
      form,
      'input#root_mailingAddressInput_address_postalCode',
      '12345',
    );
    expect(
      form.find('input#root_mailingAddressInput_address_street').prop('value'),
    ).to.equal('123 Main St');
    expect(
      form.find('input#root_mailingAddressInput_address_city').prop('value'),
    ).to.equal('Anytown');
    expect(
      form.find('select#root_mailingAddressInput_address_state').prop('value'),
    ).to.equal('CA');
    expect(
      form
        .find('input#root_mailingAddressInput_address_postalCode')
        .prop('value'),
    ).to.equal('12345');
    form.unmount();
  });

  it('should fill render errors when comleting mailing address fields', () => {
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
    form
      .find('select#root_mailingAddressInput_address_country')
      .simulate('change', {
        target: { value: 'USA' },
      });
    fillData(form, 'input#root_mailingAddressInput_address_street', '');
    fillData(form, 'input#root_mailingAddressInput_address_city', 'Anytown');
    form
      .find('select#root_mailingAddressInput_address_state')
      .simulate('change', {
        target: { value: 'CA' },
      });
    fillData(
      form,
      'input#root_mailingAddressInput_address_postalCode',
      '12345',
    );
    form.find('form').simulate('submit');
    const errorMessages = form.find('.usa-input-error-message');

    expect(errorMessages.length).to.be.at.least(1);
    expect(errorMessages.at(0).text()).to.include(
      'Please enter your full street address',
    );

    fillData(form, 'input#root_mailingAddressInput_address_street', 'SA');
    form.find('form').simulate('submit');

    expect(errorMessages.at(0).text()).to.include('minimum of 3 characters');

    fillData(
      form,
      'input#root_mailingAddressInput_address_street',
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    );

    form.find('form').simulate('submit');
    expect(errorMessages.at(0).text()).to.include('maximum of 40 characters');

    form.unmount();
  });

  it('should fill out the contact method fields', () => {
    const initialState = {
      featureToggles: {
        showMeb5490MaintenanceAlert: true,
      },
      user: {
        profile: {
          userFullName: {
            first: 'john',
            middle: 't',
            last: 'test',
          },
          dob: '1990-01-01',
          loa: {
            current: 3,
          },
        },
      },
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.contactInformationChapter.pages.chooseContactMethod;
    const form = mount(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={{ title: 'test form', mobilePhone: { phone: '4138675309' } }}
          formData={{
            title: 'test form',
            mobilePhone: { phone: '4138675309' },
          }}
        />
      </Provider>,
    );

    selectRadio(form, 'root_contactMethod', 'Email');
    selectRadio(
      form,
      'root_notificationMethod',
      'No, just send me email notifications',
    );

    expect(
      form.find('input[name="root_contactMethod"][value="Email"]').props()
        .checked,
    ).to.be.true;
    expect(
      form
        .find(
          'input[name="root_notificationMethod"][value="No, just send me email notifications"]',
        )
        .props().checked,
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
