import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 } from '~/platform/testing/unit/react-testing-library-helpers';

import EnterOTC from './EnterOTC';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

const defaultRenderOptions = {
  initialState: {
    vassForm: {
      hydrated: false,
      selectedDate: null,
      selectedTopics: [],
    },
  },
  reducers,
  additionalMiddlewares: [vassApi.middleware],
};

describe('VASS Component: EnterOTC', () => {
  it('should render page title', () => {
    const screen = renderWithStoreAndRouterV6(
      <EnterOTC />,
      defaultRenderOptions,
    );

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render success alert with verification message', () => {
    const { container } = renderWithStoreAndRouterV6(
      <EnterOTC />,
      defaultRenderOptions,
    );
    const alert = container.querySelector('va-alert[status="success"]');

    expect(alert).to.exist;
    expect(alert.getAttribute('visible')).to.exist;
  });

  it('should display email address in alert message', () => {
    const { getByText } = renderWithStoreAndRouterV6(
      <EnterOTC />,
      defaultRenderOptions,
    );

    expect(getByText(/We just emailed a one-time verification code to/i)).to
      .exist;
    expect(getByText(/test@test.com/i)).to.exist;
  });

  it('should render OTC input field', () => {
    const { container } = renderWithStoreAndRouterV6(
      <EnterOTC />,
      defaultRenderOptions,
    );
    const otcInput = container.querySelector('va-text-input[name="otc"]');

    expect(otcInput).to.exist;
    expect(otcInput.getAttribute('label')).to.equal(
      'Enter your one-time verification code',
    );
    expect(otcInput.getAttribute('required')).to.exist;
  });

  it('should render continue button', () => {
    const { container } = renderWithStoreAndRouterV6(
      <EnterOTC />,
      defaultRenderOptions,
    );
    const continueButton = container.querySelector('va-button');

    expect(continueButton).to.exist;
    expect(continueButton.getAttribute('text')).to.equal('Continue');
  });
});
