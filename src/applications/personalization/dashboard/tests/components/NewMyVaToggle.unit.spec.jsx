import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import NewMyVaToggle from '../../components/NewMyVaToggle';

const LOCAL_STORAGE_KEY = 'myVaLayoutVersion';

const mockStore = configureStore([thunk]);

describe('NewMyVaToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with default selection (old) when localStorage is empty', async () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    const buttonSegmented = container.querySelector('va-button-segmented');
    expect(buttonSegmented.selected).to.equal(1); // "old" is the second button
  });

  it('renders with selection from localStorage (old)', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'old');
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    const buttonSegmented = container.querySelector('va-button-segmented');
    expect(buttonSegmented.selected).to.equal(1); // "old" is the second button
  });

  it('renders with selection from localStorage (new)', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'new');
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    const buttonSegmented = container.querySelector('va-button-segmented');
    expect(buttonSegmented.selected).to.equal(0); // "new" is the first button
  });

  it('updates localStorage when New My VA is clicked', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'old');
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    const buttonSegmented = container.querySelector('va-button-segmented');
    fireEvent(
      buttonSegmented,
      new CustomEvent('vaButtonClick', {
        bubbles: true,
        detail: { value: 'new' },
      }),
    );
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.equal('new');
  });

  it('updates localStorage when Old My VA is clicked', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'new');
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    const buttonSegmented = container.querySelector('va-button-segmented');
    fireEvent(
      buttonSegmented,
      new CustomEvent('vaButtonClick', {
        bubbles: true,
        detail: { value: 'old' },
      }),
    );
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.equal('old');
  });

  it('has correct label for accessibility', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    expect(container.querySelector('va-button-segmented')).to.have.attribute(
      'label',
      'Select a My VA version',
    );
  });
});
