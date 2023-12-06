import React from 'react';
import { expect } from 'chai';
import { render, act, fireEvent, waitFor } from '@testing-library/react';
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
  const testKey = 'testKey';

  it('retrieves an existing value from sessionStorage', () => {
    const mockSessionStorage = {
      getItem: () => 'storedValue',
      setItem: () => {},
    };

    const { getByTestId } = render(
      <TestComponent
        storageKey={testKey}
        mockSessionStorage={mockSessionStorage}
      />,
    );
    expect(getByTestId('value').textContent).to.equal('storedValue');
  });

  it('sets a new value in sessionStorage', async () => {
    const setItemMock = sinon.spy();
    const mockSessionStorage = {
      getItem: () => '',
      setItem: setItemMock,
    };

    const { getByTestId } = render(
      <TestComponent
        storageKey={testKey}
        mockSessionStorage={mockSessionStorage}
      />,
    );
    act(() => {
      fireEvent.click(getByTestId('change-button'));
    });

    await waitFor(() => {
      expect(setItemMock.calledWith(testKey, 'newValue')).to.be.true;
      expect(getByTestId('value').textContent).to.equal('newValue');
    });
  });

  it('throws an error if no key is provided', () => {
    const mockSessionStorage = {
      getItem: sinon.spy(),
      setItem: sinon.spy(),
    };

    const view = render(
      <TestComponent
        storageKey={null}
        mockSessionStorage={mockSessionStorage}
      />,
    );

    expect(
      view.getByText(
        'useSessionStorage requires a storageKey parameter as the first argument',
      ),
    ).to.exist;
  });
});
