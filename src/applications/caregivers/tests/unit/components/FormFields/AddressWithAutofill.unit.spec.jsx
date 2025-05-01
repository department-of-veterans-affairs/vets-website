import { omit } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import { inputVaTextInput } from 'platform/testing/unit/helpers';
import { FULL_SCHEMA } from '../../../../utils/imports';
import { addressWithAutofillSchema } from '../../../../definitions/sharedSchema';
import AddressWithAutofill from '../../../../components/FormFields/AddressWithAutofill';
import content from '../../../../locales/en/content.json';

// declare error message content
const ERROR_MSG_POSTAL_REQUIRED =
  content['validation-address--postalCode-required'];
const ERROR_MSG_POSTAL_PATTERN =
  content['validation-address--postalCode-pattern'];
const ERROR_MSG_REQUIRED = content['validation-default-required'];

const errorSchemas = {
  empty: { __errors: [] },
  required: { __errors: [ERROR_MSG_REQUIRED] },
};

const postalCode = { valid: '46220', invalid: '462205678' };

describe('CG <AddressWithAutofill>', () => {
  let onChangeSpy;

  const subject = ({
    autofill = false,
    reviewMode = false,
    onChange = onChangeSpy,
  } = {}) => {
    const props = {
      formContext: { reviewMode, submitted: undefined },
      formData: {
        street: '1350 I St. NW',
        street2: 'Suite 550',
        city: 'Washington',
        state: 'DC',
        postalCode: '20005',
        'view:autofill': autofill,
        county: undefined,
      },
      errorSchema: {
        city: errorSchemas.required,
        county: errorSchemas.required,
        postalCode: errorSchemas.required,
        state: errorSchemas.required,
        street: errorSchemas.required,
        street2: errorSchemas.empty,
        'view:autofill': errorSchemas.empty,
      },
      idSchema: {
        $id: 'root_caregiverAddress',
        city: { $id: 'root_caregiverAddress_city' },
        county: { $id: 'root_caregiverAddress_county' },
        postalCode: { $id: 'root_caregiverAddress_postalCode' },
        state: { $id: 'root_caregiverAddress_state' },
        street: { $id: 'root_caregiverAddress_street' },
        street2: { $id: 'root_caregiverAddress_street2' },
        'view:autofill': { $id: 'root_caregiverAddress_autofill' },
      },
      schema: addressWithAutofillSchema(FULL_SCHEMA.definitions.address),
      name: 'caregiverAddress',
      onChange,
    };
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            veteranAddress: {
              street: '1350 I St. NW',
              street2: 'Suite 550',
              city: 'Washington',
              state: 'DC',
              postalCode: '20005',
            },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <AddressWithAutofill {...props} />
      </Provider>,
    );
    const expectedFieldTypes = 'va-checkbox, va-text-input, va-select';
    const selectors = () => ({
      fieldset: container.querySelector('.cg-address-with-autofill'),
      inputs: container.querySelectorAll(expectedFieldTypes),
      reviewRows: container.querySelectorAll('.review-row'),
      vaCheckbox: container.querySelector('#root_caregiverAddress_autofill'),
      vaTextInput: container.querySelector('#root_caregiverAddress_postalCode'),
      streetInput: container.querySelector('#root_caregiverAddress_street'),
    });
    return { container, selectors, formData: props.formData };
  };

  beforeEach(() => {
    onChangeSpy = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render the form fields when not in review mode', () => {
    const { selectors } = subject();
    const { fieldset, inputs, reviewRows } = selectors();
    expect(fieldset).to.not.be.empty;
    expect(inputs).to.have.lengthOf(7);
    expect(reviewRows).to.not.have.length;
  });

  it('should render the review rows when in review mode', () => {
    const { selectors } = subject({ reviewMode: true });
    const { inputs, reviewRows } = selectors();
    expect(inputs).to.not.have.length;
    expect(reviewRows).to.have.length;
  });

  it('should call the `onChange` method with the correct form data when the user clicks the autofill checkbox', () => {
    const { selectors, formData } = subject({
      autofill: true,
      onChange: onChangeSpy,
    });
    const { vaCheckbox } = selectors();

    vaCheckbox.__events.vaChange({ target: { checked: true } });
    sinon.assert.calledWithExactly(onChangeSpy, omit(formData, 'county'));

    vaCheckbox.__events.vaChange({ target: { checked: false } });
    sinon.assert.calledWithExactly(onChangeSpy, { 'view:autofill': false });
  });

  it('should reset the `view:autofill` datapoint when a change is made to the an autofilled address', () => {
    const { container, selectors, formData } = subject({
      autofill: true,
      onChange: onChangeSpy,
    });
    inputVaTextInput(container, postalCode.valid, selectors().vaTextInput);
    sinon.assert.calledWithExactly(onChangeSpy, {
      ...formData,
      postalCode: postalCode.valid,
      'view:autofill': false,
    });
  });

  it('should call the `onChange` method with the correct form data when a change is made', () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { vaTextInput } = selectors();

    inputVaTextInput(container, postalCode.valid, vaTextInput);
    sinon.assert.calledWithExactly(onChangeSpy, {
      ...formData,
      postalCode: postalCode.valid,
    });

    fireEvent.blur(vaTextInput);
    expect(vaTextInput).to.not.have.attr('error');
  });

  it('should call all `onChange` methods to update the form data in case of autocomplete', () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { streetInput, vaTextInput } = selectors();
    const expectedOutput = {
      ...formData,
      postalCode: postalCode.valid,
      street: '123 Fake St.',
    };
    streetInput.value = expectedOutput.street;
    inputVaTextInput(container, postalCode.valid, vaTextInput);

    vaTextInput.dispatchEvent(new CustomEvent('blur'));
    sinon.assert.calledWithExactly(onChangeSpy, expectedOutput);

    fireEvent.blur(vaTextInput);
    expect(vaTextInput).to.not.have.attr('error');
  });

  it('should render error when `blur` event is fired with invalid data', () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { vaTextInput } = selectors();

    inputVaTextInput(container, '', vaTextInput);
    sinon.assert.calledWithExactly(onChangeSpy, {
      ...formData,
      postalCode: '',
    });

    fireEvent.blur(vaTextInput);
    expect(vaTextInput).to.have.attr('error', ERROR_MSG_POSTAL_REQUIRED);
  });

  it('should render error when form data is invalid with a pattern mismatch', () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { vaTextInput } = selectors();

    inputVaTextInput(container, postalCode.invalid, vaTextInput);
    sinon.assert.calledWithExactly(onChangeSpy, {
      ...formData,
      postalCode: postalCode.invalid,
    });

    fireEvent.blur(vaTextInput);
    expect(vaTextInput).to.have.attr('error', ERROR_MSG_POSTAL_PATTERN);
  });
});
