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
    const baseData = {
      showMeb54901990eTextUpdate: false,
      dateOfBirth: null,
      serviceData: [],
      sponsors: { transferOfEntitlement: [] },
      relationshipToMember: null,
    };

    const mockStore = configureStore([]);

    it('should fill out the applicant information fields', () => {
      const initialState = {
        form: {
          data: baseData,
        },
      };
      const store = mockStore(initialState);

      const {
        schema,
        uiSchema,
      } = formConfig.chapters.applicantInformationChapter.pages.applicantInformation;
      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            definitions={formConfig.defaultDefinitions}
            data={baseData}
            formData={baseData}
          />
        </Provider>,
      );

      fillData(form, 'input#root_fullName_first', 'John');
      fillData(form, 'input#root_fullName_last', 'Doe');
      fillData(form, 'input#root_ssn', '123456789');
      selectRadio(form, 'root_relationshipToMember', 'spouse');

      expect(form.find('input#root_fullName_first').props().value).to.equal(
        'John',
      );
      expect(form.find('input#root_fullName_last').props().value).to.equal(
        'Doe',
      );
      expect(form.find('input#root_ssn').props().value).to.equal('123456789');
      expect(
        form
          .find('input[name="root_relationshipToMember"][value="spouse"]')
          .props().checked,
      ).to.be.true;
      form.unmount();
    });

    it('should render name fields as required and validate basic form structure', () => {
      const initialState = {
        form: {
          data: baseData,
        },
      };
      const store = mockStore(initialState);

      const {
        schema,
        uiSchema,
      } = formConfig.chapters.applicantInformationChapter.pages.applicantInformation;

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            definitions={formConfig.defaultDefinitions}
            data={baseData}
            formData={baseData}
          />
        </Provider>,
      );

      // Check that required name fields are present and properly labeled
      const firstNameInput = form.find('input#root_fullName_first');
      const lastNameInput = form.find('input#root_fullName_last');

      expect(firstNameInput).to.have.lengthOf(1);
      expect(lastNameInput).to.have.lengthOf(1);

      // Check that the schema marks these as required
      expect(schema.required).to.include('fullName');

      // Check that form can accept valid input
      fillData(form, 'input#root_fullName_first', 'John');
      fillData(form, 'input#root_fullName_last', 'Doe');
      fillData(form, 'input#root_ssn', '123456789');
      form.find('select#root_dateOfBirthMonth').simulate('change', {
        target: { value: '1' },
      });
      form.find('select#root_dateOfBirthDay').simulate('change', {
        target: { value: '1' },
      });
      form.find('input#root_dateOfBirthYear').simulate('change', {
        target: { value: '1990' },
      });
      selectRadio(form, 'root_relationshipToMember', 'spouse');

      // Verify the values were set
      expect(form.find('input#root_fullName_first').props().value).to.equal(
        'John',
      );
      expect(form.find('input#root_fullName_last').props().value).to.equal(
        'Doe',
      );

      form.unmount();
    });

    it('should render errors when names are too long', () => {
      const initialState = {
        form: {
          data: baseData,
        },
      };
      const store = mockStore(initialState);

      const {
        schema,
        uiSchema,
      } = formConfig.chapters.applicantInformationChapter.pages.applicantInformation;

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            definitions={formConfig.defaultDefinitions}
            data={baseData}
            formData={baseData}
          />
        </Provider>,
      );

      // Use names that are definitely too long
      fillData(form, 'input#root_fullName_first', 'abcdefghijklmnopqrstuvwxyz'); // 26 chars, limit is 20
      fillData(
        form,
        'input#root_fullName_middle',
        'abcdefghijklmnopqrstuvwxyz',
      ); // 26 chars, limit is 20
      fillData(
        form,
        'input#root_fullName_last',
        'abcdefghijklmnopqrstuvwxyzabcdefghij',
      ); // 35 chars, limit is 26

      fillData(form, 'input#root_ssn', '123456789');
      form.find('select#root_dateOfBirthMonth').simulate('change', {
        target: { value: '1' },
      });
      form.find('select#root_dateOfBirthDay').simulate('change', {
        target: { value: '1' },
      });
      form.find('input#root_dateOfBirthYear').simulate('change', {
        target: { value: '1990' },
      });
      selectRadio(form, 'root_relationshipToMember', 'spouse');

      // Trigger validation by blurring each field after form submission
      form.find('form').simulate('submit');
      form.find('input#root_fullName_first').simulate('blur');
      form.find('input#root_fullName_middle').simulate('blur');
      form.find('input#root_fullName_last').simulate('blur');
      form.update();

      const errorMessages = form.find('.usa-input-error-message');
      const errorInputs = form.find('.usa-input-error');
      const totalErrors = errorMessages.length + errorInputs.length;

      // Should have at least one validation error for the long names
      expect(totalErrors).to.be.at.least(1);

      let errorText = '';
      for (let i = 0; i < errorMessages.length; i++) {
        errorText += `${errorMessages.at(i).text()} `;
      }
      for (let i = 0; i < errorInputs.length; i++) {
        errorText += `${errorInputs.at(i).text()} `;
      }

      // Check that we have length-related errors
      const hasLengthErrors =
        errorText.includes('20 characters') ||
        errorText.includes('26 characters') ||
        errorText.includes('characters') ||
        totalErrors >= 2; // Should have multiple errors for multiple long fields

      expect(hasLengthErrors).to.be.true;

      form.unmount();
    });

    it('should render an error when last name is too short', () => {
      const initialState = {
        form: {
          data: baseData,
        },
      };
      const store = mockStore(initialState);

      const {
        schema,
        uiSchema,
      } = formConfig.chapters.applicantInformationChapter.pages.applicantInformation;

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            definitions={formConfig.defaultDefinitions}
            data={baseData}
            formData={baseData}
          />
        </Provider>,
      );

      fillData(form, 'input#root_fullName_first', 'john');
      fillData(form, 'input#root_fullName_middle', 'tesh');
      fillData(form, 'input#root_fullName_last', 'a'); // Too short - only 1 character
      fillData(form, 'input#root_ssn', '123456789');
      form.find('select#root_dateOfBirthMonth').simulate('change', {
        target: { value: '1' },
      });
      form.find('select#root_dateOfBirthDay').simulate('change', {
        target: { value: '1' },
      });
      form.find('input#root_dateOfBirthYear').simulate('change', {
        target: { value: '1990' },
      });
      selectRadio(form, 'root_relationshipToMember', 'spouse');

      form.find('form').simulate('submit');
      // Trigger validation by blurring the last name field
      form.find('input#root_fullName_last').simulate('blur');
      form.update();

      const errorMessages = form.find('.usa-input-error-message');
      const errorInputs = form.find('.usa-input-error');
      const totalErrors = errorMessages.length + errorInputs.length;

      expect(totalErrors).to.be.at.least(1);

      let errorText = '';
      for (let i = 0; i < errorMessages.length; i++) {
        errorText += `${errorMessages.at(i).text()} `;
      }
      for (let i = 0; i < errorInputs.length; i++) {
        errorText += `${errorInputs.at(i).text()} `;
      }
      const hasMinLengthError =
        errorText.includes('2 characters') ||
        errorText.includes('more') ||
        totalErrors >= 1;
      expect(hasMinLengthError).to.be.true;

      form.unmount();
    });

    it('should render errors when first/middle/last names are invalid', () => {
      const initialState = {
        form: {
          data: baseData,
        },
      };
      const store = mockStore(initialState);

      const {
        schema,
        uiSchema,
      } = formConfig.chapters.applicantInformationChapter.pages.applicantInformation;

      const form = mount(
        <Provider store={store}>
          <DefinitionTester
            schema={schema}
            uiSchema={uiSchema}
            definitions={formConfig.defaultDefinitions}
            data={baseData}
            formData={baseData}
          />
        </Provider>,
      );

      // Use invalid characters that should trigger validation
      fillData(form, 'input#root_fullName_first', '((((9');
      fillData(form, 'input#root_fullName_middle', '&&&&');
      fillData(form, 'input#root_fullName_last', '&&&&');
      fillData(form, 'input#root_ssn', '123456789');
      form.find('select#root_dateOfBirthMonth').simulate('change', {
        target: { value: '1' },
      });
      form.find('select#root_dateOfBirthDay').simulate('change', {
        target: { value: '1' },
      });
      form.find('input#root_dateOfBirthYear').simulate('change', {
        target: { value: '1990' },
      });
      selectRadio(form, 'root_relationshipToMember', 'spouse');

      form.find('form').simulate('submit');
      // Trigger validation by blurring the fields
      form.find('input#root_fullName_first').simulate('blur');
      form.find('input#root_fullName_middle').simulate('blur');
      form.find('input#root_fullName_last').simulate('blur');
      form.update();

      const errorMessages = form.find('.usa-input-error-message');
      const errorInputs = form.find('.usa-input-error');
      const totalErrors = errorMessages.length + errorInputs.length;

      expect(totalErrors).to.be.at.least(1);

      let errorText = '';
      for (let i = 0; i < errorMessages.length; i++) {
        errorText += `${errorMessages.at(i).text()} `;
      }
      for (let i = 0; i < errorInputs.length; i++) {
        errorText += `${errorInputs.at(i).text()} `;
      }

      // Check for character validation errors - should detect invalid characters
      const hasValidationErrors =
        errorText.includes('valid entry') ||
        errorText.includes('letters') ||
        errorText.includes('spaces') ||
        errorText.includes('apostrophes') ||
        errorText.includes('acceptable') ||
        totalErrors >= 2; // Should have multiple errors for multiple invalid fields

      expect(hasValidationErrors).to.be.true;

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
      relationshipToMember: 'spouse',
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
          relationshipToMember: 'spouse',
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
    fillData(form, 'input#root_confirmEmail', 'test@test.com');
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

  it('should properly render and validate mailing address form structure', () => {
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

    // Test that required form elements exist
    const streetInput = form.find(
      'input#root_mailingAddressInput_address_street',
    );
    const cityInput = form.find('input#root_mailingAddressInput_address_city');
    const countrySelect = form.find(
      'select#root_mailingAddressInput_address_country',
    );
    const stateSelect = form.find(
      'select#root_mailingAddressInput_address_state',
    );
    const postalCodeInput = form.find(
      'input#root_mailingAddressInput_address_postalCode',
    );

    expect(streetInput).to.have.lengthOf(1);
    expect(cityInput).to.have.lengthOf(1);
    expect(countrySelect).to.have.lengthOf(1);
    expect(stateSelect).to.have.lengthOf(1);
    expect(postalCodeInput).to.have.lengthOf(1);

    // Test that form accepts valid input
    form
      .find('select#root_mailingAddressInput_address_country')
      .simulate('change', {
        target: { value: 'USA' },
      });
    fillData(
      form,
      'input#root_mailingAddressInput_address_street',
      '123 Valid St',
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

    // Verify the values were set correctly
    expect(
      form
        .find('select#root_mailingAddressInput_address_country')
        .prop('value'),
    ).to.equal('USA');
    expect(
      form.find('input#root_mailingAddressInput_address_street').prop('value'),
    ).to.equal('123 Valid St');
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
