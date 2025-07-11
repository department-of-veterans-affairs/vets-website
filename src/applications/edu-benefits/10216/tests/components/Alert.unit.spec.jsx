import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import Alert from '../../components/Alert';

describe('Alert component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    localStorage.clear();
  });

  afterEach(() => {
    sandbox.restore();
    localStorage.clear();
  });

  it('renders without issues', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/some-path']}>
        <Alert />
      </MemoryRouter>,
    );
    expect(container).to.exist;
  });

  it('should display warning message when school is not accredited', () => {
    localStorage.setItem('isAccredited', 'false');

    const { getByText } = render(
      <MemoryRouter initialEntries={['/some-path']}>
        <Alert />
      </MemoryRouter>,
    );

    expect(getByText('Additional form needed')).to.exist;
    expect(
      getByText(
        /Our records indicate your school is not recognized by a regional or national accreditor./,
      ),
    ).to.exist;
  });

  it('should display info message when school is accredited', () => {
    localStorage.setItem('isAccredited', 'true');

    const { container, getByText } = render(
      <MemoryRouter initialEntries={['/confirmation']}>
        <Alert />
      </MemoryRouter>,
    );

    expect(getByText('Complete all submission steps')).to.exist;
    expect(
      getByText(
        /This form requires additional steps for successful submission/,
      ),
    ).to.exist;
    expect(container.querySelector('p').textContent).to.equal(
      `This form requires additional steps for successful submission. Follow the instructions below carefully to ensure your form is submitted correctly.`,
    );
  });
});
