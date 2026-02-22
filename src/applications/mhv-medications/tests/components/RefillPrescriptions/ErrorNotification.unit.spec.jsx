import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ErrorNotification from '../../../components/RefillPrescriptions/ErrorNotification';
import { MEDICATION_REFILL_CONFIG } from '../../../util/constants';

describe('ErrorNotification component', () => {
  const defaultConfig = MEDICATION_REFILL_CONFIG.ERROR;

  it('renders without errors', () => {
    const { getByTestId } = render(
      <ErrorNotification config={defaultConfig} />,
    );
    expect(getByTestId('error-refill')).to.exist;
  });

  it('renders the alert title', () => {
    const { getByTestId } = render(
      <ErrorNotification config={defaultConfig} />,
    );
    expect(getByTestId('error-refill-title').textContent).to.equal(
      defaultConfig.title,
    );
  });

  it('displays the correct error description', () => {
    const { getByTestId } = render(
      <ErrorNotification config={defaultConfig} />,
    );
    expect(getByTestId('error-refill-description').textContent).to.equal(
      defaultConfig.description,
    );
  });

  it('displays the correct suggestion message', () => {
    const { getByTestId } = render(
      <ErrorNotification config={defaultConfig} />,
    );
    expect(getByTestId('error-refill-suggestion').textContent).to.equal(
      defaultConfig.suggestion,
    );
  });
});
