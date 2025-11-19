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

    const container = screen.getByTestId('wrapper-container');
    expect(container).to.exist;
    expect(container).to.have.class('custom-class');
    expect(container).to.have.class('vads-l-grid-container');
    expect(container).to.have.class('vads-u-padding-x--2p5');
    expect(container).to.have.class('desktop-lg:vads-u-padding-x--0');
    expect(container).to.have.class('vads-u-padding-bottom--2');
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
});
