import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';

import IdentityNotVerified from './IdentityNotVerified';

describe('IdentityNotVerified component', () => {
  let view;
  describe('when only passed a headline prop', () => {
    const headline = 'The alert headline';
    beforeEach(() => {
      view = render(<IdentityNotVerified alertHeadline={headline} />);
    });
    it('renders the correct alert headline', () => {
      expect(
        view.getByRole('heading', {
          name: headline,
        }),
      ).to.exist;
    });
    it('renders the correct alert content', () => {
      expect(view.getByText(/We need to make sure you’re you/i)).to.exist;
      expect(view.getByText(/your personal and health-related information/i)).to
        .exist;
    });
    it('renders the correct CTA', () => {
      expect(
        view.getByRole('link', { name: 'Verify your identity' }),
      ).to.have.attr('href', '/verify');
    });
  });
  describe('when passed alertHeadline and alertContent props', () => {
    const headline = 'The alert headline';
    const content = 'The alert content';
    beforeEach(() => {
      view = render(
        <IdentityNotVerified alertHeadline={headline} alertContent={content} />,
      );
    });
    it('renders the correct alert headline', () => {
      expect(
        view.getByRole('heading', {
          name: headline,
        }),
      ).to.exist;
    });
    it('renders the correct alert content', () => {
      expect(view.getByText(content)).to.exist;
    });
    it('renders the correct CTA', () => {
      expect(
        view.getByRole('link', { name: 'Verify your identity' }),
      ).to.have.attr('href', '/verify');
    });
  });
  describe('when passed alertHeadline and additionalInfoClickHandler props', () => {
    const headline = 'The alert headline';
    let additionalInfoClickSpy;
    beforeEach(() => {
      additionalInfoClickSpy = sinon.spy();
      view = render(
        <IdentityNotVerified
          alertHeadline={headline}
          additionalInfoClickHandler={() => {
            additionalInfoClickSpy();
          }}
        />,
      );
    });
    it('renders the correct alert headline', () => {
      expect(
        view.getByRole('heading', {
          name: headline,
        }),
      ).to.exist;
    });
    it('clicking on the correct additional info component fires the passed in additionalInfoClickHandler', () => {
      expect(additionalInfoClickSpy.notCalled).to.be.true;
      fireEvent.click(
        view.getByRole('link', {
          name: /Learn how to verify your identity on VA.gov/i,
        }),
      );
      expect(additionalInfoClickSpy.calledOnce).to.be.true;
    });
  });
});
