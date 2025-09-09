import React from 'react';
import { expect } from 'chai';
import { render, screen, waitFor } from '@testing-library/react';
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
    await waitFor(() => {
      expect(container.getElementsByTagName('va-button-segmented')).to.exist;
    });
    const segmentedButtons = container.getElementsByTagName(
      'va-button-segmented',
    );
    expect(segmentedButtons[0].selected).to.equal(1);
  });

  it('renders with selection from localStorage (old)', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'old');
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    await waitFor(() => {
      expect(container.getElementsByTagName('va-button-segmented')).to.exist;
    });
    const segmentedButtons = container.getElementsByTagName(
      'va-button-segmented',
    );
    expect(segmentedButtons[0].selected).to.equal(1);
  });

  it('renders with selection from localStorage (new)', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'new');
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    await waitFor(() => {
      expect(container.getElementsByTagName('va-button-segmented')).to.exist;
    });
    const segmentedButtons = container.getElementsByTagName(
      'va-button-segmented',
    );
    expect(segmentedButtons[0].selected).to.equal(0);
  });

  it.skip('updates localStorage when New My VA is clicked', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'new');
    const { container } = render(
      <Provider store={mockStore({})}>
        <NewMyVaToggle />
      </Provider>,
    );
    await waitFor(() => {
      expect(container.getElementsByTagName('va-button-segmented')).to.exist;
    });
    const segmentedButtons = container.getElementsByTagName(
      'va-button-segmented',
    );
    // eslint-disable-next-line no-console
    console.log(segmentedButtons[0].selected);
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).to.equal('new');
  });

  it.skip('updates localStorage when Old My VA is clicked', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'new');
    render(<NewMyVaToggle />);
  });

  it.skip('has correct aria label for accessibility', () => {
    render(<NewMyVaToggle />);
    expect(screen.getByLabelText('Select a My VA version')).to.exist;
  });
});
