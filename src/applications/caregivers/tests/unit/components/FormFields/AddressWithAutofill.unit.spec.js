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

describe('CG <AddressWithAutofill>', () => {
  const errorSchemas = {
    empty: { __errors: [] },
    required: { __errors: [content['validation-default-required']] },
  };
  const getData = ({ autofill = false, reviewMode = false }) => ({
    props: {
      formContext: { reviewMode, submitted: undefined },
      formData: {
        street: '1350 I St. NW',
        street2: 'Suite 550',
        city: 'Washington',
        state: 'DC',
        postalCode: '20005',
        'view:autofill': autofill,
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
        'view:autofill': { $id: 'root_caregiverAddress_view:autofill' },
      },
      schema: addressWithAutofillSchema(address),
      onChange: sinon.spy(),
    },
    mockStore: {
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
    },
  });
  const subject = ({ mockStore, props }) => {
    const { container } = render(
      <Provider store={mockStore}>
        <AddressWithAutofill {...props} />
      </Provider>,
    );
    const expectedFieldTypes = 'va-checkbox, va-text-input, va-select';
    const selectors = () => ({
      fieldset: container.querySelector('.cg-address-with-autofill'),
      inputs: container.querySelectorAll(expectedFieldTypes),
      reviewRow: container.querySelectorAll('.review-row'),
      vaCheckbox: container.querySelector('#root_caregiverAddress_autofill'),
      vaTextInput: container.querySelector('#root_caregiverAddress_postalCode'),
    });
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
    });
  });
});
