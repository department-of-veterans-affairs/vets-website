import React from 'react';
import { act, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TelephoneFieldNoInternalErrors from '../../../components/TelephoneFieldNoInternalErrors';

describe('21-8940 component/TelephoneFieldNoInternalErrors', () => {
  const buildProps = overrides => {
    const base = {
      label: 'Primary phone number',
      required: true,
      error: undefined,
      uiOptions: { classNames: 'test-class' },
      childrenProps: {
        formData: { contact: '5555555555', countryCode: 'US' },
        schema: { maxLength: 10, minLength: 10, pattern: '^.*$' },
        idSchema: { $id: 'root_veteran_homePhone' },
        onChange: sinon.spy(),
      },
    };

    return {
      ...base,
      ...overrides,
      childrenProps: {
        ...base.childrenProps,
        ...(overrides?.childrenProps || {}),
        formData: {
          ...base.childrenProps.formData,
          ...(overrides?.childrenProps?.formData || {}),
        },
        schema: {
          ...base.childrenProps.schema,
          ...(overrides?.childrenProps?.schema || {}),
        },
        idSchema: {
          ...base.childrenProps.idSchema,
          ...(overrides?.childrenProps?.idSchema || {}),
        },
        onChange:
          overrides?.childrenProps?.onChange || base.childrenProps.onChange,
      },
    };
  };

  it('renders a va-telephone-input with internal errors disabled', () => {
    const props = buildProps();
    const { container } = render(<TelephoneFieldNoInternalErrors {...props} />);

    const telephoneInput = container.querySelector('va-telephone-input');

    expect(telephoneInput).to.exist;
    expect(telephoneInput.getAttribute('show-internal-errors')).to.equal(
      'false',
    );
    expect(telephoneInput.className).to.contain('rjsf-web-component-field');
    expect(telephoneInput.className).to.contain('test-class');
    expect(telephoneInput.getAttribute('name')).to.equal(
      'root_veteran_homePhone',
    );
  });

  it('maps telephone field props and forwards contact changes', () => {
    const props = buildProps();
    const { container } = render(<TelephoneFieldNoInternalErrors {...props} />);

    const telephoneInput = container.querySelector('va-telephone-input');
    expect(telephoneInput).to.exist;
    expect(telephoneInput.getAttribute('contact')).to.equal('5555555555');
    expect(telephoneInput.getAttribute('country')).to.equal('US');

    act(() => {
      telephoneInput.dispatchEvent(
        new CustomEvent('vaContact', {
          detail: {
            contact: '2028675309',
            callingCode: '1',
            countryCode: 'US',
            isValid: true,
            error: undefined,
            touched: true,
          },
          bubbles: true,
        }),
      );
    });

    expect(props.childrenProps.onChange.calledOnce).to.be.true;
    expect(props.childrenProps.onChange.firstCall.args[0]).to.deep.equal({
      callingCode: 1,
      countryCode: 'US',
      contact: '2028675309',
      _isValid: true,
      _error: undefined,
      _touched: true,
      _required: true,
    });
  });
});
