import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import PropTypes from 'prop-types';

import { useSessionStorage } from './useSessionStorage';

// Create a test component that utilizes useSessionStorage
function TestComponent({ storageKey, mockSessionStorage }) {
  try {
    const [value, setValue] = useSessionStorage(storageKey, mockSessionStorage);
    return (
      <div>
        <span data-testid="value">{value}</span>
        <button
          type="button"
          onClick={() => setValue('newValue')}
          data-testid="change-button"
        >
          Change Value
        </button>
      </div>
    );
  } catch (error) {
    return <p>{error.message}</p>;
  }
}

TestComponent.propTypes = {
  mockSessionStorage: PropTypes.object.isRequired,
  storageKey: PropTypes.string.isRequired,
};

describe('useSessionStorage', () => {
  afterEach(cleanup);
  const testKey = 'testKey';

  let mockSessionStorage;
  beforeEach(() => {
    mockSessionStorage = {
      getItem: sinon.stub(),
      setItem: sinon.stub(),
    };
  });

  it('retrieves an existing value from sessionStorage', () => {
    mockSessionStorage.getItem.returns('storedValue');

    const { getByTestId } = render(
      <TestComponent
        storageKey={testKey}
        mockSessionStorage={mockSessionStorage}
      />,
    );
    expect(getByTestId('value')).to.have.text('storedValue');
  });

  it('sets a new value in sessionStorage', async () => {
    mockSessionStorage.getItem.returns('');

    const { getByTestId } = render(
      <TestComponent
        storageKey={testKey}
        mockSessionStorage={mockSessionStorage}
      />,
    );

    fireEvent.click(getByTestId('change-button'));

    await waitFor(() => {
      expect(mockSessionStorage.setItem.calledWith(testKey, 'newValue')).to.be
        .true;
      expect(getByTestId('value')).to.have.text('newValue');
    });
  });

  it('throws an error if no key is provided', () => {
    const renderResult = render(
      <TestComponent
        storageKey={null}
        mockSessionStorage={mockSessionStorage}
      />,
    );

    expect(
      renderResult.getByText(
        'useSessionStorage requires a storageKey parameter as the first argument',
      ),
    ).to.exist;
  });
});
