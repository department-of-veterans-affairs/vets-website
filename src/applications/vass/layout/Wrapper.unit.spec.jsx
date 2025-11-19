import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouterV6 as renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

import Wrapper from './Wrapper';

describe('VASS Component: Wrapper', () => {
  it('should render children content', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper>
        <div data-testid="test-child">Test Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    expect(screen.getByTestId('test-child')).to.exist;
  });

  it('should render page title when provided', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper pageTitle="Test Page Title">
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    expect(screen.getByRole('heading', { level: 1, name: /test page title/i }))
      .to.exist;
    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('header')).to.have.attribute('tabIndex', '-1');
  });

  it('should not render h1 when pageTitle is not provided', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper>
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    expect(screen.queryByTestId('header')).to.not.exist;
  });

  it('should render NeedHelp component', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper>
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    expect(screen.getByTestId('help-footer')).to.exist;
  });

  it('should apply custom className to container', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper className="custom-class" testID="wrapper-container">
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    const container = screen.getByTestId('wrapper-container'); // The default testID
    expect(container).to.exist;
    expect(container).to.have.class('custom-class');
    expect(container).to.have.class('vads-l-grid-container');
    expect(container).to.have.class('vads-u-padding-y--3');
  });

  it('should apply testID to container', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper testID="test-wrapper">
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    expect(screen.getByTestId('test-wrapper')).to.exist;
  });

  it('should render back button when showBackLink is true', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper showBackLink>
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    expect(screen.getByTestId('back-link')).to.exist;
  });

  it('should display *Required text when required prop is passed with pageTitle', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper showBackLink required pageTitle="Test Page Title">
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    const header = screen.getByTestId('header');
    expect(header.textContent).to.include('(*Required)');
  });

  it('should not display *Required text when required is not passed', () => {
    const screen = renderWithStoreAndRouter(
      <Wrapper showBackLink>
        <div>Content</div>
      </Wrapper>,
      {
        initialState: {},
      },
    );

    expect(screen.queryByText(/\(\*Required\)/)).to.not.exist;
  });
});
