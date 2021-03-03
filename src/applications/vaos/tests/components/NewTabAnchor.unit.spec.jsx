import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import NewTabAnchor from '../../components/NewTabAnchor';
import userEvent from '@testing-library/user-event';

describe('VAOS <NewTabAnchor>', () => {
  it('should create anchor tag with default attributes', () => {
    const url = 'http://va.gov';

    const screen = render(
      <NewTabAnchor href={url}>Join appointment</NewTabAnchor>,
    );

    const anchor = screen.getByRole('link', {
      name: 'Join appointment',
    });

    // Default attributes...
    expect(anchor.getAttribute('rel')).to.equal('noopener noreferrer');
    expect(anchor.getAttribute('target')).to.equal('_blank');

    expect(anchor.getAttribute('href')).to.equal('http://va.gov');
    expect(anchor.getAttribute('aria-describedby')).to.equal('new-tab-msg-1');
  });

  it('should create anchor tag with expected attributes', () => {
    const url = 'http://va.gov';
    const linkClasses = 'class1, class2, class3';
    const disableVideoLink = true;
    const appointment = { id: 1 };
    const callback = sinon.spy();

    // Override 'aria-describedby' attribute
    const screen = render(
      <NewTabAnchor
        href={url}
        className={linkClasses}
        // Use case for anchors that have existing descriptions.
        aria-describedby={
          disableVideoLink
            ? `description-join-link-${appointment.id}`
            : undefined
        }
        aria-disabled={!!disableVideoLink}
        // Use case for links styled as buttons
        onClick={callback}
      >
        Join appointment
      </NewTabAnchor>,
    );

    const anchor = screen.getByRole('link', {
      name: 'Join appointment',
    });

    expect(anchor).to.be.ok;

    // Default attributes...
    expect(anchor.getAttribute('rel')).to.equal('noopener noreferrer');
    expect(anchor.getAttribute('target')).to.equal('_blank');

    expect(anchor.getAttribute('href')).to.equal('http://va.gov');
    expect(anchor.getAttribute('class')).to.equal('class1, class2, class3');
    expect(anchor.getAttribute('aria-describedby')).to.equal(
      'description-join-link-1 new-tab-msg-1',
    );
    expect(anchor.getAttribute('aria-disabled')).to.equal('true');

    // Make sure button handler works...
    userEvent.click(anchor);
    expect(callback.calledOnce).to.be.true;
  });
});
