import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { MemoryRouter } from 'react-router-dom';
import Alert from '../../components/Alert';

describe('Alert component', () => {
  const localStorageMock = {
    getItem: sinon.stub(),
    setItem: sinon.stub(),
    removeItem: sinon.stub(),
    clear: sinon.stub(),
  };
  global.localStorage = localStorageMock;
  it('renders without issues', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/some-path']}>
        <Alert router={{ location: { pathname: '/some-path' } }} />
      </MemoryRouter>,
    );
    expect(container).to.exist;
  });
  it('should display warning message when school is not accredited', () => {
    localStorage.setItem('isAccredited', 'false');
    const { getByText } = render(
      <MemoryRouter initialEntries={['/some-path']}>
        <Alert router={{ location: { pathname: '/some-path' } }} />
      </MemoryRouter>,
    );

    expect(getByText('Additional form needed')).to.exist;
    expect(
      getByText(
        /Your school facility code indicates the school is not accredited/,
      ),
    ).to.exist;
  });
  it('should display info message when school is accredited', () => {
    localStorage.setItem('isAccredited', 'true');
    const { container, getByText } = render(
      <MemoryRouter initialEntries={['/confirmation']}>
        <Alert
          router={{ router: { location: { pathname: '/confirmation' } } }}
        />
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
