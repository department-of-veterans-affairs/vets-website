import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ErrorNavCard from '../../components/ErrorNavCard';

describe('ErrorNavCard component', () => {
  describe('userActionable prop', () => {
    it('renders error code and phone number when userActionable is true', () => {
      const { container, getByText } = render(
        <ErrorNavCard title="Messages" code="801" userActionable />,
      );

      // Should show error code format
      expect(getByText(/Error 801:/)).to.exist;
      // Verify error message is displayed (check for key phrase, not entire content)
      expect(container.textContent).to.include('give you access to');

      // Should show phone number (check for key phrase, not entire content)
      expect(container.textContent).to.include('Call us at');
    });

    it('renders generic message when userActionable is false', () => {
      const { container, queryByText } = render(
        <ErrorNavCard title="Messages" code="900" userActionable={false} />,
      );

      // Should show generic message (check for key phrase, not entire content)
      expect(container.textContent).to.include('run into a problem');

      // Should NOT show error code
      expect(queryByText(/Error \d+:/)).to.not.exist;

      // Should NOT show phone number
      expect(container.textContent).to.not.include('Call us at');
    });

    it('defaults to userActionable=false when not provided', () => {
      const { container, queryByText } = render(
        <ErrorNavCard title="Medications" code="900" />,
      );

      // Should show generic message (check for key phrase, not entire content)
      expect(container.textContent).to.include('run into a problem');

      // Should NOT show error code
      expect(queryByText(/Error \d+:/)).to.not.exist;
    });
  });

  describe('different code values', () => {
    it('renders with code 801', () => {
      const { getByText } = render(
        <ErrorNavCard title="Messages" code="801" userActionable />,
      );

      expect(getByText(/Error 801:/)).to.exist;
    });

    it('renders with code 805', () => {
      const { getByText } = render(
        <ErrorNavCard title="Medications" code="805" userActionable />,
      );

      expect(getByText(/Error 805:/)).to.exist;
    });

    it('renders with code 806', () => {
      const { getByText } = render(
        <ErrorNavCard title="Medical records" code="806" userActionable />,
      );

      expect(getByText(/Error 806:/)).to.exist;
    });

    it('renders with code 807', () => {
      const { getByText } = render(
        <ErrorNavCard title="Messages" code="807" userActionable />,
      );

      expect(getByText(/Error 807:/)).to.exist;
    });

    it('renders with code 900 (non-user actionable)', () => {
      const { queryByText } = render(
        <ErrorNavCard title="Messages" code="900" userActionable={false} />,
      );

      // Should not show error code when userActionable is false
      expect(queryByText(/Error 900:/)).to.not.exist;
    });

    it('renders without code prop', () => {
      const { container } = render(
        <ErrorNavCard title="Messages" userActionable />,
      );

      // Should still render the component
      expect(container.textContent).to.include('Messages');
      // Error code format might show "Error :" or handle undefined
      expect(container.textContent).to.include('Error');
    });
  });

  describe('iconClasses prop variations', () => {
    it('uses default iconClasses when not provided', () => {
      const { container } = render(
        <ErrorNavCard title="Messages" code="801" userActionable />,
      );

      // Check that the icon container has the default class
      const iconContainer = container.querySelector('.vads-u-flex--auto');
      expect(iconContainer).to.exist;
      expect(iconContainer.className).to.include('vads-u-margin-right--1p5');
    });

    it('applies custom iconClasses prop', () => {
      const customIconClasses = 'custom-icon-class vads-u-margin-right--2';
      const { container } = render(
        <ErrorNavCard
          title="Messages"
          code="801"
          userActionable
          iconClasses={customIconClasses}
        />,
      );

      const iconContainer = container.querySelector('.vads-u-flex--auto');
      expect(iconContainer).to.exist;
      expect(iconContainer.className).to.include('custom-icon-class');
      expect(iconContainer.className).to.include('vads-u-margin-right--2');
    });

    it('applies multiple iconClasses', () => {
      const iconClasses = 'class1 class2 class3';
      const { container } = render(
        <ErrorNavCard
          title="Medications"
          code="805"
          userActionable={false}
          iconClasses={iconClasses}
        />,
      );

      const iconContainer = container.querySelector('.vads-u-flex--auto');
      expect(iconContainer).to.exist;
      expect(iconContainer.className).to.include('class1');
      expect(iconContainer.className).to.include('class2');
      expect(iconContainer.className).to.include('class3');
    });

    it('works with empty iconClasses string', () => {
      const { container } = render(
        <ErrorNavCard
          title="Messages"
          code="801"
          userActionable
          iconClasses=""
        />,
      );

      const iconContainer = container.querySelector('.vads-u-flex--auto');
      expect(iconContainer).to.exist;
      // Should still have the base classes
      expect(iconContainer.className).to.include('vads-u-flex--auto');
    });
  });

  describe('title handling', () => {
    it('renders title correctly', () => {
      const { getByText } = render(
        <ErrorNavCard title="Messages" code="801" userActionable />,
      );

      expect(getByText('Messages')).to.exist;
    });

    it('converts title to lowercase in error message when userActionable is true', () => {
      const { container } = render(
        <ErrorNavCard title="Messages" code="801" userActionable />,
      );

      // Verify title is converted to lowercase in error message (check for key phrase)
      expect(container.textContent).to.include('give you access to messages');
    });

    it('uses title as-is in generic message when userActionable is false', () => {
      const { container } = render(
        <ErrorNavCard
          title="Medical Records"
          code="900"
          userActionable={false}
        />,
      );

      // Verify title is used as-is (not lowercased) in generic message (check for key phrase)
      expect(container.textContent).to.include(
        'give you access to Medical Records',
      );
    });

    it('generates correct slug from title', () => {
      const { container } = render(
        <ErrorNavCard title="Medical Records" code="801" userActionable />,
      );

      // Slug should be generated from title
      const heading = container.querySelector('h2[id^="mhv-c-card-"]');
      expect(heading).to.exist;
      expect(heading.id).to.equal('mhv-c-card-medical-records');
    });

    it('handles title with special characters in slug generation', () => {
      const { container } = render(
        <ErrorNavCard title="Messages & Alerts!" code="801" userActionable />,
      );

      const heading = container.querySelector('h2[id^="mhv-c-card-"]');
      expect(heading).to.exist;
      // Special characters should be replaced with hyphens
      expect(heading.id).to.include('messages');
      expect(heading.id).to.include('alerts');
    });
  });

  describe('component structure', () => {
    it('renders with correct base classes', () => {
      const { container } = render(
        <ErrorNavCard title="Messages" code="801" userActionable />,
      );

      const card = container.firstChild;
      expect(card.className).to.include('vads-u-height--full');
      expect(card.className).to.include('vads-u-padding-x--4');
      expect(card.className).to.include(
        'vads-u-background-color--gray-lightest',
      );
    });

    it('renders va-icon component', () => {
      const { container } = render(
        <ErrorNavCard title="Messages" code="801" userActionable />,
      );

      const icon = container.querySelector('va-icon');
      expect(icon).to.exist;
      expect(icon.getAttribute('icon')).to.equal('error');
      expect(icon.getAttribute('size')).to.equal('4');
    });
  });
});
