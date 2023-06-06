import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { SingleFieldLoadFailAlert } from '~/applications/personalization/profile/components/alerts/LoadFail';

describe('SingleFieldLoadFailAlert', () => {
  let consoleWarnStub;
  beforeEach(() => {
    consoleWarnStub = sinon.spy(console, 'warn');
  });
  afterEach(() => {
    consoleWarnStub.restore();
  });

  it('renders default failure message when no props are passed', () => {
    const view = render(<SingleFieldLoadFailAlert />);
    expect(
      view.getByText(
        'We’re sorry. We can’t access this information right now. Please refresh the page or try again.',
      ),
    ).to.exist;
  });

  it('renders children when passed', () => {
    const view = render(
      <SingleFieldLoadFailAlert>Custom message</SingleFieldLoadFailAlert>,
    );
    expect(view.getByText('Custom message')).to.exist;
  });

  it('renders failure message with section name when passed', () => {
    const view = render(<SingleFieldLoadFailAlert sectionName="section1" />);
    expect(
      view.getByText(
        'We’re sorry. Something went wrong on our end and we can’t load your section1. Please try again later.',
      ),
    ).to.exist;
  });

  it('console.warn is called when both sectionName and children are passed', () => {
    render(
      <SingleFieldLoadFailAlert sectionName="section1">
        Custom message
      </SingleFieldLoadFailAlert>,
    );
    expect(consoleWarnStub.calledOnce);
  });

  it('console.warn is called when sectionName is not a string', () => {
    render(<SingleFieldLoadFailAlert sectionName={1} />);
    expect(consoleWarnStub.calledOnce);
  });
});
