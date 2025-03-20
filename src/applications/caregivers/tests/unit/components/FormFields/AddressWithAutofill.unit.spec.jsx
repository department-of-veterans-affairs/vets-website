import { omit } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { inputVaTextInput } from 'platform/testing/unit/helpers';
import { fullSchema } from '../../../../utils/imports';
import { addressWithAutofillSchema } from '../../../../definitions/sharedSchema';
import AddressWithAutofill from '../../../../components/FormFields/AddressWithAutofill';
import content from '../../../../locales/en/content.json';

const { address } = fullSchema.definitions;

const errorSchemas = {
  empty: { __errors: [] },
  required: { __errors: [content['validation-default-required']] },
};

const postalCode = { valid: '46220', invalid: '462205678' };

describe('CG <AddressWithAutofill>', () => {
  const subject = ({
    autofill = false,
    reviewMode = false,
    onChange = f => f,
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
      schema: addressWithAutofillSchema(address),
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
  let onChangeSpy;

  beforeEach(() => {
    onChangeSpy = sinon.spy();
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

  it('should call the `onChange` method with the correct form data when the user clicks the autofill checkbox', async () => {
    const { selectors, formData } = subject({
      autofill: true,
      onChange: onChangeSpy,
    });
    const { vaCheckbox } = selectors();
    await waitFor(() => {
      const expectedOutput = omit(formData, 'county');
      vaCheckbox.__events.vaChange({ target: { checked: true } });
      expect(onChangeSpy.calledWith(expectedOutput)).to.be.true;
    });
    await waitFor(() => {
      const expectedOutput = { 'view:autofill': false };
      vaCheckbox.__events.vaChange({ target: { checked: false } });
      expect(onChangeSpy.calledWith(expectedOutput)).to.be.true;
    });
  });

  it('should reset the `view:autofill` datapoint when a change is made to the an autofilled address', () => {
    const { container, selectors, formData } = subject({
      autofill: true,
      onChange: onChangeSpy,
    });
    const expectedOutput = {
      ...formData,
      postalCode: postalCode.valid,
      'view:autofill': false,
    };
    inputVaTextInput(container, postalCode.valid, selectors().vaTextInput);
    expect(onChangeSpy.calledWith(expectedOutput)).to.be.true;
  });

  it('should call the `onChange` method with the correct form data when a change is made', async () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { vaTextInput } = selectors();
    await waitFor(() => {
      const expectedOutput = { ...formData, postalCode: postalCode.valid };
      inputVaTextInput(container, postalCode.valid, vaTextInput);
      expect(onChangeSpy.calledWith(expectedOutput)).to.be.true;
    });
    await waitFor(() => {
      fireEvent.blur(vaTextInput);
      expect(vaTextInput).to.not.have.attr('error');
    });
  });

  it('should call all `onChange` methods to update the form data in case of autocomplete', async () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { streetInput, vaTextInput } = selectors();
    await waitFor(() => {
      const blurEvent = new CustomEvent('blur');
      const expectedOutput = {
        ...formData,
        postalCode: postalCode.valid,
        street: '123 Fake St.',
      };
      streetInput.value = expectedOutput.street;
      inputVaTextInput(container, postalCode.valid, vaTextInput);

      vaTextInput.dispatchEvent(blurEvent);
      expect(onChangeSpy.calledWith(expectedOutput)).to.be.true;

      fireEvent.blur(vaTextInput);
      expect(vaTextInput).to.not.have.attr('error');
    });
  });

  it('should render error when `blur` event is fired with invalid data', async () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { vaTextInput } = selectors();
    await waitFor(() => {
      const expectedOutput = { ...formData, postalCode: '' };
      inputVaTextInput(container, '', vaTextInput);
      expect(onChangeSpy.calledWith(expectedOutput)).to.be.true;
    });
    await waitFor(() => {
      fireEvent.blur(vaTextInput);
      expect(vaTextInput).to.have.attr(
        'error',
        content['validation-address--postalCode-required'],
      );
    });
  });

  it('should render error when form data is invalid with a pattern mismatch', async () => {
    const { container, selectors, formData } = subject({
      onChange: onChangeSpy,
    });
    const { vaTextInput } = selectors();
    await waitFor(() => {
      const expectedOutput = { ...formData, postalCode: postalCode.invalid };
      inputVaTextInput(container, postalCode.invalid, vaTextInput);
      expect(onChangeSpy.calledWith(expectedOutput)).to.be.true;
    });
    await waitFor(() => {
      fireEvent.blur(vaTextInput);
      expect(vaTextInput).to.have.attr(
        'error',
        content['validation-address--postalCode-pattern'],
      );
    });
  });
});
