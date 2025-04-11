import React from 'react';
import { expect } from 'chai';
import { within, waitFor } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimDetailLayout from '../../components/ClaimDetailLayout';
import { renderWithRouter } from '../utils';

describe('<ClaimDetailLayout>', () => {
  it('should render loading indicator', () => {
    const { container } = renderWithRouter(<ClaimDetailLayout loading />);

    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render unavailable warning', () => {
    const claim = null;

    const container = renderWithRouter(<ClaimDetailLayout claim={claim} />);
    expect(container.getByRole('heading', { level: 2 })).to.contain.text(
      'Claim status is unavailable',
    );
  });

  it('should render when the claim was submitted', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2023-11-23',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };

    const container = renderWithRouter(<ClaimDetailLayout claim={claim} />);

    expect(container.getByRole('heading', { level: 1 })).to.contain.text(
      'Received on November 23, 2023',
    );
  });

  it('should render adding details info if open', () => {
    const claim = {
      attributes: {
        closeDate: null,
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
        status: 'INITIAL_REVIEW',
      },
    };

    const { getByText, container } = renderWithRouter(
      <ClaimDetailLayout currentTab="Status" claim={claim} />,
    );

    expect($('va-alert', container)).to.exist;
    getByText(
      "We can't show all of the details of your claim. Please check back later.",
    );
  });

  it('should not render adding details info if closed', () => {
    const claim = {
      attributes: {
        closeDate: '2023-04-28',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
        status: 'COMPLETE',
      },
    };

    const { container } = renderWithRouter(
      <ClaimDetailLayout currentTab="Status" claim={claim} />,
    );

    expect($('[data-test-id="adding-details"]', container)).to.not.exist;
  });

  it('should render 3 tabs', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2010-05-05',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };

    const { container } = renderWithRouter(
      <ClaimDetailLayout currentTab="Files" claim={claim} />,
    );

    const tabList = $('.tabs', container);
    expect(within(tabList).getAllByRole('listitem').length).to.equal(3);
  });

  it('should render normal info', () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2010-05-05',
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };

    const { container } = renderWithRouter(
      <ClaimDetailLayout currentTab="Status" claim={claim}>
        <div className="child-content" />
      </ClaimDetailLayout>,
    );

    expect($('[data-test-id="adding-details"]', container)).to.not.exist;
    expect($('.child-content', container)).to.exist;
  });

  it('should render message', () => {
    const claim = {
      attributes: {
        contentions: [{ name: 'Condition 1' }, { name: 'Condition 2' }],
      },
    };
    const message = {
      title: 'Test',
      body: 'Testing',
    };

    const { container } = renderWithRouter(
      <ClaimDetailLayout message={message} claim={claim} />,
    );

    expect($('.claims-alert', container)).to.exist;
  });

  it('should render Notification and set focus on it', async () => {
    const claim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2025-02-01',
      },
    };
    const message = {
      title: 'Test',
      body: 'Testing',
    };

    const { container } = renderWithRouter(
      <ClaimDetailLayout currentTab="Files" claim={claim} message={message} />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    await waitFor(() => {
      expect(document.activeElement).to.equal(selector);
    });
  });

  describe('<ClaimsBreadcrumbs>', () => {
    it('should render default breadcrumbs for the Your Claims list page while loading', () => {
      const { container } = renderWithRouter(<ClaimDetailLayout loading />);
      expect($('va-breadcrumbs', container)).to.exist;
    });
    it('should render breadcrumbs specific to the claim once loaded', () => {
      const claim = {
        attributes: {
          claimDate: '2024-09-04',
          claimType: 'Dependency',
          claimTypeCode: '130PSA',
        },
      };
      const { container } = renderWithRouter(
        <ClaimDetailLayout claim={claim} currentTab="Status" />,
      );

      expect($('va-breadcrumbs', container).breadcrumbList).to.eql([
        { href: '/', label: 'VA.gov home' },
        {
          href: '/your-claims',
          label: 'Check your claims and appeals',
          isRouterLink: true,
        },
        {
          href: '../status',
          label: 'Status of your request to add or remove a dependent',
          isRouterLink: true,
        },
      ]);
    });
    it('should render a default breadcrumb if the claim fails to load', () => {
      const { container } = renderWithRouter(
        <ClaimDetailLayout claim={null} currentTab="Status" />,
      );
      expect($('va-breadcrumbs', container).breadcrumbList).to.eql([
        { href: '/', label: 'VA.gov home' },
        {
          href: '/your-claims',
          label: 'Check your claims and appeals',
          isRouterLink: true,
        },
        {
          href: '../status',
          label: 'Status of your claim',
          isRouterLink: true,
        },
      ]);
    });
  });
});
