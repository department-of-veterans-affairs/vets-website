import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';

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
    it('when provided without arial label', () => {
      const title = 'a title';
      const abbr = 'an abbr';
      const { getAllByText, getByRole } = render(
        <MhvSecondaryNavItem
          title={title}
          abbreviation={abbr}
          icon="home"
          href="/my-health"
        />,
      );
      expect(getAllByText(title).length).to.eql(1);
      expect(getAllByText(abbr).length).to.eql(1);
      expect(getByRole('link').getAttribute('aria-label')).to.be.null;
    });

    it('when provided with aria label', () => {
      const title = 'a title';
      const abbr = 'an abbr';
      const ariaLabel = 'a label';
      const { getAllByText, getByLabelText } = render(
        <MhvSecondaryNavItem
          title={title}
          abbreviation={abbr}
          ariaLabel={ariaLabel}
          icon="home"
          href="/my-health"
        />,
      );
      expect(getAllByText(title).length).to.eql(1);
      expect(getAllByText(abbr).length).to.eql(1);
      expect(getByLabelText(ariaLabel)).to.exist;
    });

    it('when not provided', () => {
      const title = 'a title';
      const ariaLabel = 'a label';
      const { getAllByText, getByRole } = render(
        <MhvSecondaryNavItem
          title={title}
          icon="home"
          href="/my-health"
          ariaLabel={ariaLabel}
        />,
      );
      // The title and abbreviation are the same
      expect(getAllByText(title).length).to.eql(2);
      expect(getByRole('link').getAttribute('aria-label')).to.be.null;
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

  describe('reports custom events to GA', async () => {
    it('when a link is clicked', async () => {
      const href = '#/my-health/unit-test';
      const title = 'MhvSecondaryNavItem GA Event test';

      const event = {
        event: 'nav-mhv-secondary',
        action: 'click',
        'nav-link-text': title,
        'nav-link-url': href,
        'nav-link-location': 'MHV secondary nav',
      };

      const recordEventSpy = sinon.spy();
      const props = { href, title, recordEvent: recordEventSpy };

      const { getByRole } = render(<MhvSecondaryNavItem {...props} />);
      await userEvent.click(getByRole('link'));
      await waitFor(() => {
        expect(recordEventSpy.calledOnce).to.be.true;
        expect(recordEventSpy.calledWith(event)).to.be.true;
      });
    });
  });
});
