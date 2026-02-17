import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import * as featureToggles from 'platform/utilities/feature-toggles';
import NewMyVaToggle from '../../components/NewMyVaToggle';

const LOCAL_STORAGE_KEY = 'myVaLayoutVersion';

const mockStore = configureStore([thunk]);

describe('NewMyVaToggle', () => {
  let sandbox;
  let updateFeatureToggleValueStub;

  beforeEach(() => {
    localStorage.clear();
    sandbox = sinon.createSandbox();
    updateFeatureToggleValueStub = sandbox
      .stub(featureToggles, 'updateFeatureToggleValue')
      .returns(() => {});
  });

  afterEach(() => {
    sandbox.restore();
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

  it('dispatches updateFeatureToggleValue when storeVersion matches selected (new)', () => {
    const store = mockStore({
      myVaPreferences: {
        layout: {
          version: 'new',
        },
      },
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, 'new');

    render(
      <Provider store={store}>
        <NewMyVaToggle />
      </Provider>,
    );

    expect(
      updateFeatureToggleValueStub.calledWith({
        [featureToggles.TOGGLE_NAMES.myVaAuthExpRedesignEnabled]: true,
      }),
    ).to.be.true;
  });

  it('dispatches updateFeatureToggleValue when storeVersion matches selected (old)', () => {
    const store = mockStore({
      myVaPreferences: {
        layout: {
          version: 'old',
        },
      },
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, 'old');

    render(
      <Provider store={store}>
        <NewMyVaToggle />
      </Provider>,
    );

    expect(
      updateFeatureToggleValueStub.calledWith({
        [featureToggles.TOGGLE_NAMES.myVaAuthExpRedesignEnabled]: false,
      }),
    ).to.be.true;
  });
});
