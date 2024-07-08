import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Toggler } from '~/platform/utilities/feature-toggles';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import IconCTALink from '../../components/IconCTALink';

describe('<IconCTALink />', () => {
  const getAnchorEl = wrapper => {
    return wrapper.container.querySelector('a');
  };

  it('should render', () => {
    const linkText = 'Testing';
    const tree = render(
      <IconCTALink testId="12345" href="https://example.com" text={linkText} />,
    );
    expect(tree.getByTestId('12345')).to.exist;
    expect(tree.getByText('Testing')).to.exist;
  });

  it('should render the correct href', () => {
    const wrapper = render(
      <IconCTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
      />,
    );

    const href = getAnchorEl(wrapper).getAttribute('href');
    expect(href).to.eq('https://example.com');
  });

  it('should open in a new tab', () => {
    const wrapper = render(
      <IconCTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        newTab
      />,
    );
    const anchor = getAnchorEl(wrapper);

    const target = anchor.getAttribute('target');
    const rel = anchor.getAttribute('rel');
    expect(target).to.eq('_blank');
    expect(rel).to.eq('noreferrer noopener');
  });

  it('should render the aria-label', () => {
    const wrapper = render(
      <IconCTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        ariaLabel="test label"
      />,
    );

    const ariaLabel = getAnchorEl(wrapper).getAttribute('aria-label');
    expect(ariaLabel).to.eq('test label');
  });

  it('should render the icon', () => {
    const wrapper = render(
      <IconCTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        icon="check"
      />,
    );

    expect(wrapper.container.querySelector('va-icon')).to.exist;
  });

  it('should render bold text', () => {
    const wrapper = render(
      <IconCTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        boldText
      />,
    );

    expect(
      wrapper.container.querySelector(
        '.vads-u-padding-y--2p5.cta-link.vads-u-font-weight--bold',
      ),
    ).to.exist;
  });

  it('should handle an onClick prop', () => {
    const onClickSpy = sinon.spy();
    const tree = render(
      <IconCTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        onClick={onClickSpy}
      />,
    );

    getAnchorEl(tree).click();
    expect(onClickSpy.called).to.be.true;
  });

  it('should show the dot indicator if the toggle is enabled', () => {
    const initialState = {
      featureToggles: {
        [Toggler.TOGGLE_NAMES.myVaNotificationDotIndicator]: true,
      },
    };
    const tree = renderWithStoreAndRouter(
      <IconCTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        dotIndicator
      />,
      { initialState },
    );

    expect(tree.getByTestId('icon-cta-link-dot-indicator')).to.exist;
  });
});
