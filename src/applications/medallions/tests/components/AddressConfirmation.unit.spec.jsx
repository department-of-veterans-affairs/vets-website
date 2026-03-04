import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import AddressConfirmation from '../../components/AddressConfirmation'; // the default export (connected)

const mockStore = configureStore([]);

const baseState = {
  form: { data: {} },
  vapService: { addressValidation: {} },
};

const renderWithStore = (props, state = baseState) => {
  const store = mockStore(state);
  return render(
    <Provider store={store}>
      <AddressConfirmation {...props} />
    </Provider>,
  );
};

describe('Connected AddressConfirmation component', () => {
  const baseAddress = {
    street: '123 Test St',
    street2: 'Unit 456',
    city: 'Testville',
    state: 'VA',
    postalCode: '12345',
    country: 'USA',
  };

  it('does not render city/state/postal line if all values are missing', () => {
    const { container } = renderWithStore({
      subHeader: 'Missing city/state/zip',
      userAddress: {
        street: 'Somewhere St',
        street2: 'Suite X',
        country: 'USA',
        // No city, state, or postalCode
      },
    });

    const block = container.querySelector('.blue-bar-block');
    const text = block.textContent;

    expect(text).to.include('Somewhere St');
    expect(text).to.include('Suite X');
    expect(text).to.not.include('Testville');
    expect(text).to.not.include('VA');
    expect(text).to.not.include('12345');
  });

  it('renders country label if not USA', () => {
    const { container } = renderWithStore({
      subHeader: 'International address',
      userAddress: {
        ...baseAddress,
        country: 'CAN',
      },
    });

    const block = container.querySelector('.blue-bar-block');
    expect(block.textContent).to.include('Canada');
  });

  it('falls back to country code if label not found', () => {
    const { container } = renderWithStore({
      subHeader: 'Unknown country code',
      userAddress: {
        ...baseAddress,
        country: 'XYZ',
      },
    });

    const block = container.querySelector('.blue-bar-block');
    expect(block.textContent).to.include('XYZ');
  });
});
