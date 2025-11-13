import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import Wrapper from './Wrapper';

describe('VASS Component: Wrapper', () => {
  it('should render children content', () => {
    const screen = render(
      <Wrapper>
        <div data-testid="test-child">Test Content</div>
      </Wrapper>,
    );

    expect(screen.getByTestId('test-child')).to.exist;
  });

  it('should render page title when provided', () => {
    const screen = render(
      <Wrapper pageTitle="Test Page Title">
        <div>Content</div>
      </Wrapper>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /test page title/i }))
      .to.exist;
    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('header')).to.have.attribute('tabIndex', '-1');
  });

  it('should not render h1 when pageTitle is not provided', () => {
    const screen = render(
      <Wrapper>
        <div>Content</div>
      </Wrapper>,
    );

    expect(screen.queryByTestId('header')).to.not.exist;
  });

  it('should render NeedHelp component', () => {
    const screen = render(
      <Wrapper>
        <div>Content</div>
      </Wrapper>,
    );

    expect(screen.getByTestId('help-footer')).to.exist;
  });

  it('should apply custom classNames to container', () => {
    const screen = render(
      <Wrapper classNames="custom-class" testID="wrapper-container">
        <div>Content</div>
      </Wrapper>,
    );

    const container = screen.getByTestId('wrapper-container');
    expect(container).to.exist;
    expect(container).to.have.class('custom-class');
    expect(container).to.have.class('vads-l-grid-container');
    expect(container).to.have.class('vads-u-padding-y--3');
  });

  it('should apply testID to container', () => {
    const screen = render(
      <Wrapper testID="test-wrapper">
        <div>Content</div>
      </Wrapper>,
    );

    expect(screen.getByTestId('test-wrapper')).to.exist;
  });
});
