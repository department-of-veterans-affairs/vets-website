import React from 'react';

import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { NoRep } from '../components/cards/NoRep';

describe('NoRep component', () => {
  context('when isWidget is true', () => {
    const defaultProps = {
      DynamicHeader: 'h2',
      isWidget: true,
    };

    it('renders with required props', () => {
      const { container, getByTestId } = render(<NoRep {...defaultProps} />);
      getByTestId('no-rep');
      const card = container.querySelector('va-card');
      expect(card).to.exist;
    });

    it('displays the correct heading', () => {
      const { container, getByText } = render(<NoRep {...defaultProps} />);
      const headerElement = $('.vads-u-font-size--h3', container);
      expect(headerElement).to.exist;
      getByText('You don’t have an accredited representative');
    });

    it('renders the correct heading level', () => {
      const { container } = render(
        <NoRep {...defaultProps} DynamicHeader="h3" />,
      );
      expect($('h3', container)).to.exist;
    });

    it('includes an icon in the header', () => {
      const { container } = render(<NoRep {...defaultProps} />);
      const icon = container.querySelector('va-icon[icon="account_circle"]');
      expect(icon).to.exist;
      expect(Number(icon.getAttribute('size'))).to.equal(4);
      expect(icon.getAttribute('srtext')).to.equal('Your representative');
    });

    it('includes a link to learn about accredited representatives', () => {
      const { container } = render(<NoRep {...defaultProps} />);
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.contain(
        '/resources/va-accredited-representative-faqs/',
      );
      expect(link.getAttribute('text')).to.equal(
        'Learn about accredited representatives',
      );
    });
  });

  context('when isWidget is false', () => {
    const defaultProps = {
      DynamicHeader: 'h2',
    };

    it('renders with required props', () => {
      const { container, getByTestId } = render(<NoRep {...defaultProps} />);
      getByTestId('no-rep');
      const card = container.querySelector('va-card');
      expect(card).to.not.exist;
    });

    it('displays no heading and the correct text', () => {
      const { container, getByText } = render(<NoRep {...defaultProps} />);
      const headerElement = $('.vads-u-font-size--h3', container);
      expect(headerElement).to.not.exist;
      getByText('You don’t have an accredited representative.');
      getByText(
        'An accredited attorney, claims agent, or Veterans Service Organization (VSO) representative can help you file a claim or request a decision review.',
      );
    });

    it('does not include an icon in the header', () => {
      const { container } = render(<NoRep {...defaultProps} />);
      const icon = container.querySelector('va-icon[icon="account_circle"]');
      expect(icon).to.not.exist;
    });

    it('includes a link to get help from an accredited representative', () => {
      const { container } = render(<NoRep {...defaultProps} />);
      const link = $('va-link', container);
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.contain(
        'get-help-from-accredited-representative',
      );
      expect(link.getAttribute('text')).to.equal(
        'Get help from an accredited representative or VSO',
      );
    });
  });
});
