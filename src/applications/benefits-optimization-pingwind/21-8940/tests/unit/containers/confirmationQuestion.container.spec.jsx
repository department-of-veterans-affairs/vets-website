import React from 'react';
import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import ConfirmationQuestion from '../../../containers/ConfirmationQuestion';

// Ensure a DOM is available for Testing Library & web components (in case mocha setup didn't provide one here)
if (typeof window === 'undefined' || !window.document) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
}

// Minimal mock Redux store
const mockStore = {
  getState: () => ({ form: { data: {} } }),
  subscribe: () => {},
  dispatch: () => {},
};

const renderWithRouter = (formData = {}) => {
  const pushSpy = sinon.spy();
  const router = { push: pushSpy };
  const location = { pathname: '/confirmation-question' };
  const route = { pageList: [{ path: 'confirmation-question' }, { path: 'important-information' }] };

  render(
    <Provider store={mockStore}>
      <ConfirmationQuestion
        formData={formData}
        route={route}
        location={location}
        router={router}
        setFormData={() => {}}
      />
    </Provider>,
  );

  return { pushSpy };
};

describe('ConfirmationQuestion container interactions', () => {
  it('allows progression after selecting No then Yes', () => {
    const { pushSpy } = renderWithRouter();

    // Select "No"
    fireEvent.click(screen.getByLabelText('No'));

    // Click Continue -> should show error
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/Oops, we hit a snag/i)).to.exist;

    // Select "Yes"
    fireEvent.click(screen.getByLabelText('Yes'));

    // Click Continue -> should navigate (spy called)
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(pushSpy.calledOnce).to.be.true;
  });
});
