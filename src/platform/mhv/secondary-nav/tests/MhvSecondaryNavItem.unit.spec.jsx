import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import MhvSecondaryNavItem from '../components/MhvSecondaryNavItem';

describe('MHV Secondary Navigation Item Component', () => {
  describe('adds a data-dd-action-name', () => {
    it('when provided', () => {
      const title = 'a title';
      const actionName = 'an action name';
      const { getByRole } = render(
        <MhvSecondaryNavItem
          actionName={actionName}
          title={title}
          icon="home"
          href="/my-health"
        />,
      );
      const result = getByRole('link');
      expect(result.getAttribute('data-dd-action-name')).to.equal(actionName);
    });
  });

  describe('handle abbreviations', () => {
    it('when provided', () => {
      const title = 'a title';
      const abbr = 'an abbr';
      const { getAllByText } = render(
        <MhvSecondaryNavItem
          title={title}
          abbreviation={abbr}
          icon="home"
          href="/my-health"
        />,
      );
      expect(getAllByText(title).length).to.eql(1);
      expect(getAllByText(abbr).length).to.eql(1);
    });

    it('when not provided', () => {
      const title = 'a title';
      const { getAllByText } = render(
        <MhvSecondaryNavItem title={title} icon="home" href="/my-health" />,
      );
      // The title and abbreviation are the same
      expect(getAllByText(title).length).to.eql(2);
    });
  });

  describe('handle headers', () => {
    it('set an item to be a header', () => {
      const { getByTestId } = render(
        <MhvSecondaryNavItem
          title="a title"
          icon="home"
          href="/my-health"
          isHeader
        />,
      );
      const item = getByTestId('mhv-sec-nav-item');
      expect(item.className).to.include('header');
    });

    it('set an item to not be a header', () => {
      const { getByTestId } = render(
        <MhvSecondaryNavItem title="a title" icon="home" href="/my-health" />,
      );
      const item = getByTestId('mhv-sec-nav-item');
      expect(item.className).to.not.include('header');
    });
  });

  describe('set item to active', () => {
    it('when not set to active', () => {
      const { getByTestId } = render(
        <MhvSecondaryNavItem title="a title" icon="home" href="/my-health" />,
      );
      const item = getByTestId('mhv-sec-nav-item');
      expect(item.className).to.not.include('active');
    });

    it('when set to active', () => {
      const { getByTestId } = render(
        <MhvSecondaryNavItem
          title="a title"
          icon="home"
          href="/my-health"
          isActive
        />,
      );
      const item = getByTestId('mhv-sec-nav-item');
      expect(item.className).to.include('active');
    });
  });
});
