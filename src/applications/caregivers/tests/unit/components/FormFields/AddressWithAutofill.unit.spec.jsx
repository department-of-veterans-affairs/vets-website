<<<<<<< HEAD
=======
import { omit } from 'lodash';
>>>>>>> main
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
<<<<<<< HEAD

import { inputVaTextInput } from 'platform/testing/unit/helpers';
import { fullSchema } from '../../../../utils/imports';
=======
import { inputVaTextInput } from 'platform/testing/unit/helpers';
import { FULL_SCHEMA } from '../../../../utils/imports';
>>>>>>> main
import { addressWithAutofillSchema } from '../../../../definitions/sharedSchema';
import AddressWithAutofill from '../../../../components/FormFields/AddressWithAutofill';
import content from '../../../../locales/en/content.json';

<<<<<<< HEAD
const { address } = fullSchema.definitions;

describe('CG <AddressWithAutofill>', () => {
  const errorSchemas = {
    empty: { __errors: [] },
    required: { __errors: [content['validation-default-required']] },
  };
  const getData = ({ autofill = false, reviewMode = false }) => ({
    props: {
=======
const { address } = FULL_SCHEMA.definitions;

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
>>>>>>> main
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
<<<<<<< HEAD
        'view:autofill': { $id: 'root_caregiverAddress_view:autofill' },
      },
      schema: addressWithAutofillSchema(address),
      onChange: sinon.spy(),
      name: 'caregiverAddress',
    },
    mockStore: {
=======
        'view:autofill': { $id: 'root_caregiverAddress_autofill' },
      },
      schema: addressWithAutofillSchema(address),
      name: 'caregiverAddress',
      onChange,
    };
    const mockStore = {
>>>>>>> main
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
<<<<<<< HEAD
    },
  });
  const subject = ({ mockStore, props }) => {
=======
    };
>>>>>>> main
    const { container } = render(
      <Provider store={mockStore}>
        <AddressWithAutofill {...props} />
      </Provider>,
    );
    const expectedFieldTypes = 'va-checkbox, va-text-input, va-select';
    const selectors = () => ({
      fieldset: container.querySelector('.cg-address-with-autofill'),
      inputs: container.querySelectorAll(expectedFieldTypes),
<<<<<<< HEAD
      reviewRow: container.querySelectorAll('.review-row'),
=======
      reviewRows: container.querySelectorAll('.review-row'),
>>>>>>> main
      vaCheckbox: container.querySelector('#root_caregiverAddress_autofill'),
      vaTextInput: container.querySelector('#root_caregiverAddress_postalCode'),
      streetInput: container.querySelector('#root_caregiverAddress_street'),
    });
<<<<<<< HEAD
    return { container, selectors };
  };

  context('when the component renders on form page', () => {
    const { mockStore, props } = getData({});

    it('should render the appropriate number of form fields', () => {
      const { selectors } = subject({ mockStore, props });
      expect(selectors().fieldset).to.exist;
      expect(selectors().fieldset).to.not.be.empty;
      expect(selectors().inputs).to.have.lengthOf(7);
    });

    it('should not render the review rows', () => {
      const { selectors } = subject({ mockStore, props });
      expect(selectors().reviewRow).to.not.have.length;
    });
  });

  context('when the component renders in review mode', () => {
    const { mockStore, props } = getData({ reviewMode: true });

    it('should render the review rows', () => {
      const { selectors } = subject({ mockStore, props });
      expect(selectors().reviewRow).to.have.length;
    });
  });

  context('when the user clicks the autofill checkbox', () => {
    it('should call the `onChange` method with the correct form data', async () => {
      const { mockStore, props } = getData({ autofill: true });
      const { selectors } = subject({ mockStore, props });
      await waitFor(() => {
        selectors().vaCheckbox.__events.vaChange({
          target: { checked: true },
        });
        expect(props.onChange.calledWith(props.formData)).to.be.true;
      });
      await waitFor(() => {
        const formData = { 'view:autofill': false };
        selectors().vaCheckbox.__events.vaChange({
          target: { checked: false },
        });
        expect(props.onChange.calledWith(formData)).to.be.true;
      });
    });
  });

  context('when the user makes an update to non-checkbox field', () => {
    const postalCode = { valid: '46220', invalid: '462205678' };

    it('should reset the `view:autofill` datapoint when a change is made to the an autofilled address', () => {
      const { mockStore, props } = getData({ autofill: true });
      const { container, selectors } = subject({ mockStore, props });
      const formData = {
        ...props.formData,
        postalCode: postalCode.valid,
        'view:autofill': false,
      };
      inputVaTextInput(container, formData.postalCode, selectors().vaTextInput);
      expect(props.onChange.calledWith(formData)).to.be.true;
    });

    it('should call the `onChange` method with the correct form data when a change is made', async () => {
      const { mockStore, props } = getData({});
      const { container, selectors } = subject({ mockStore, props });
      const formData = { ...props.formData, postalCode: postalCode.valid };

      await waitFor(() => {
        inputVaTextInput(
          container,
          formData.postalCode,
          selectors().vaTextInput,
        );
        expect(props.onChange.calledWith(formData)).to.be.true;
      });

      await waitFor(() => {
        fireEvent.blur(selectors().vaTextInput);
        expect(selectors().vaTextInput).to.not.have.attr('error');
      });
    });

    it('should call all `onChange` methods to update the form data in case of autocomplete', async () => {
      const { mockStore, props } = getData({});
      const { container, selectors } = subject({ mockStore, props });
      const formData = {
        ...props.formData,
        postalCode: postalCode.valid,
        street: '123 Fake st.',
      };

      await waitFor(() => {
        selectors().streetInput.value = formData.street;
        inputVaTextInput(
          container,
          formData.postalCode,
          selectors().vaTextInput,
        );
        const blurEvent = new CustomEvent('blur');
        selectors().vaTextInput.dispatchEvent(blurEvent);
        expect(props.onChange.calledWith(formData)).to.be.true;

        fireEvent.blur(selectors().vaTextInput);
        expect(selectors().vaTextInput).to.not.have.attr('error');
      });
    });

    it('should render error when `blur` event is fired with invalid data', async () => {
      const { mockStore, props } = getData({});
      const { container, selectors } = subject({ mockStore, props });
      const formData = { ...props.formData, postalCode: '' };

      await waitFor(() => {
        inputVaTextInput(
          container,
          formData.postalCode,
          selectors().vaTextInput,
        );
        expect(props.onChange.calledWith(formData)).to.be.true;
      });

      await waitFor(() => {
        fireEvent.blur(selectors().vaTextInput);
        expect(selectors().vaTextInput).to.have.attr(
          'error',
          content['validation-address--postalCode-required'],
        );
      });
    });

    it('should render error when form data is invalid with a pattern mismatch', async () => {
      const { mockStore, props } = getData({});
      const { container, selectors } = subject({ mockStore, props });
      const formData = { ...props.formData, postalCode: postalCode.invalid };

      await waitFor(() => {
        inputVaTextInput(
          container,
          formData.postalCode,
          selectors().vaTextInput,
        );
        expect(props.onChange.calledWith(formData)).to.be.true;
      });

      await waitFor(() => {
        fireEvent.blur(selectors().vaTextInput);
        expect(selectors().vaTextInput).to.have.attr(
          'error',
          content['validation-address--postalCode-pattern'],
        );
      });
=======
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
>>>>>>> main
    });
  });
});
