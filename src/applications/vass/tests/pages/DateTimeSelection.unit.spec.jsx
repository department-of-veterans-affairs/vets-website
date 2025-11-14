import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom-v5-compat';
import sinon from 'sinon';

import DateTimeSelection from '../../pages/DateTimeSelection';

describe('VASS Component: DateTimeSelection', () => {
  let mockNavigate;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockNavigate = sandbox.stub();
    // Mock the useNavigate hook
    sandbox
      .stub(require('react-router-dom-v5-compat'), 'useNavigate')
      .returns(mockNavigate);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render page title', () => {
    const screen = render(
      <MemoryRouter>
        <DateTimeSelection />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render content section with instructions', () => {
    const screen = render(
      <MemoryRouter>
        <DateTimeSelection />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('content')).to.exist;
  });

  it('should render continue button', () => {
    const screen = render(
      <MemoryRouter>
        <DateTimeSelection />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('continue-button')).to.exist;
  });

  it('should prevent continue without selecting a date', () => {
    const screen = render(
      <MemoryRouter>
        <DateTimeSelection />
      </MemoryRouter>,
    );

    const continueButton = screen.getByTestId('continue-button');

    // Click continue without selecting a date
    fireEvent.click(continueButton);

    // Should not navigate
    expect(mockNavigate.called).to.be.false;
  });
});
