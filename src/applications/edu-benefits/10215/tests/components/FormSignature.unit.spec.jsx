import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import FormSignature from '../../components/FormSignature';

describe('<FormSignature>', () => {
  const mockStore = configureStore([]);

  it('should render', () => {
    const setSignatureError = sinon.spy();
    const { container } = render(
      <Provider store={mockStore({})}>
        <FormSignature
          signature={{
            value: '',
            dirty: false,
          }}
          validations={[]}
          setSignatureError={setSignatureError}
          formData={{}}
        />
      </Provider>,
    );

    expect($('va-text-input', container)).to.exist;
  });

  it('should render error', () => {
    const setSignatureError = sinon.spy();
    const { container } = render(
      <Provider store={mockStore({})}>
        <FormSignature
          signature={{ value: '', dirty: true }}
          validations={[]}
          signatureError="Please enter your name"
          setSignatureError={setSignatureError}
          formData={{}}
        />
      </Provider>,
    );

    expect($('va-text-input[error="Please enter your name"]', container)).to
      .exist;
  });
});
