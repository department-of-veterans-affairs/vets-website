import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MhvSecondaryNavItem from '../components/MhvSecondaryNavItem';

describe('MHV Secondary Navigation Item Component', () => {
  describe('handle abbreviations', () => {
    it('when provided', () => {
      const title = 'a title';
      const abbr = 'an abbr';
      const { getByRole } = render(
        <MhvSecondaryNavItem
          title={title}
          abbreviation={abbr}
          iconClass="fas fa-home"
          href="/my-health"
        />,
      );
      const link = getByRole('link');
      expect(link.text.match(new RegExp(title, 'g'))?.length).to.eql(1);
      expect(link.text.match(new RegExp(abbr, 'g'))?.length).to.eql(1);
    });

    it('when not provided', () => {
      const title = 'a title';
      const { getByRole } = render(
        <MhvSecondaryNavItem
          title={title}
          iconClass="fas fa-home"
          href="/my-health"
        />,
      );
      const link = getByRole('link');
      // The title and abbreviation are always part of the link.
      expect(link.text.match(new RegExp(title, 'g'))?.length).to.eql(2);
    });
  });

  describe('set item to active', () => {
    it('when not set to active', () => {
      const { getByTestId } = render(
        <MhvSecondaryNavItem
          title="a title"
          iconClass="fas fa-home"
          href="/my-health"
        />,
      );
      const link = getByTestId('mhv-sec-nav-item');
      expect(link.className).to.not.include('active');
    });

    it('when set to active', () => {
      const { getByTestId } = render(
        <MhvSecondaryNavItem
          title="a title"
          iconClass="fas fa-home"
          href="/my-health"
          isActive
        />,
      );
      const link = getByTestId('mhv-sec-nav-item');
      expect(link.className).to.include('active');
    });
  });
});
