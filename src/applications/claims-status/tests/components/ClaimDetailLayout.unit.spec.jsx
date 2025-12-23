import React from 'react';
import { expect } from 'chai';
import { within, waitFor } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimDetailLayout from '../../components/ClaimDetailLayout';
import { renderWithRouter } from '../utils';

const getStore = (featureToggles = {}, notifications = {}) =>
  createStore(() => ({
    featureToggles,
    disability: {
      status: {
        notifications: {
          message: null,
          additionalEvidenceMessage: null,
          type1UnknownErrors: null,
          ...notifications,
        },
      },
    },
  }));
describe('<ClaimDetailLayout>', () => {
  it('should render loading indicator', () => {
    const { container } = renderWithRouter(
      <Provider store={getStore()}>
        <ClaimDetailLayout loading />
      </Provider>,
    );

    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should render unavailable warning', () => {
    const claim = null;

    const container = renderWithRouter(
      <Provider store={getStore()}>
        <ClaimDetailLayout claim={claim} />
      </Provider>,
    );
    expect(container.getByRole('heading', { level: 1 })).to.contain.text(
      'We encountered a problem',
    );
    expect($('va-alert', container.container)).to.exist;
    expect(container.container.textContent).to.include(
      "We can't access your claim right now",
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

    const container = renderWithRouter(
      <Provider store={getStore()}>
        <ClaimDetailLayout claim={claim} />
      </Provider>,
    );

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
      <Provider store={getStore()}>
        <ClaimDetailLayout currentTab="Status" claim={claim} />
      </Provider>,
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
      <Provider store={getStore()}>
        <ClaimDetailLayout currentTab="Status" claim={claim} />
      </Provider>,
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
      <Provider store={getStore()}>
        <ClaimDetailLayout currentTab="Files" claim={claim} />
      </Provider>,
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
      <Provider store={getStore()}>
        <ClaimDetailLayout currentTab="Status" claim={claim}>
          <div className="child-content" />
        </ClaimDetailLayout>
      </Provider>,
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
      <Provider store={getStore()}>
        <ClaimDetailLayout message={message} claim={claim} />
      </Provider>,
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
      <Provider store={getStore()}>
        <ClaimDetailLayout currentTab="Files" claim={claim} message={message} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert');
    expect(alert).to.exist;
    const headline = alert.querySelector('h2');
    await waitFor(() => {
      expect(document.activeElement).to.equal(headline);
    });
  });

  describe('<ClaimsBreadcrumbs>', () => {
    it('should render default breadcrumbs for the Your Claims list page while loading', () => {
      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimDetailLayout loading />
        </Provider>,
      );
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
        <Provider store={getStore()}>
          <ClaimDetailLayout claim={claim} currentTab="Status" />
        </Provider>,
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
        <Provider store={getStore()}>
          <ClaimDetailLayout claim={null} currentTab="Status" />
        </Provider>,
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

  describe('Type 1 Unknown Error Alert', () => {
    const FEATURE_FLAG_KEY = 'cst_show_document_upload_status';
    const mockClaim = {
      attributes: {
        claimType: 'Compensation',
        claimDate: '2023-11-23',
        contentions: [{ name: 'Condition 1' }],
      },
    };

    const mockType1UnknownErrors = [
      { fileName: 'test-document.pdf', docType: 'Medical records' },
    ];

    it('should not render Type 1 Unknown error alert when feature flag is disabled', () => {
      const { container } = renderWithRouter(
        <Provider store={getStore({ [FEATURE_FLAG_KEY]: false })}>
          <ClaimDetailLayout currentTab="Files" claim={mockClaim} />
        </Provider>,
      );

      expect($('.claims-alert', container)).to.not.exist;
    });

    it('should render Type 1 Unknown error alert when feature flag is enabled and errors exist', () => {
      const { container: filesContainer } = renderWithRouter(
        <Provider
          store={getStore(
            { [FEATURE_FLAG_KEY]: true },
            { type1UnknownErrors: mockType1UnknownErrors },
          )}
        >
          <ClaimDetailLayout currentTab="Files" claim={mockClaim} />
        </Provider>,
      );

      const { container: statusContainer } = renderWithRouter(
        <Provider
          store={getStore(
            { [FEATURE_FLAG_KEY]: true },
            { type1UnknownErrors: mockType1UnknownErrors },
          )}
        >
          <ClaimDetailLayout currentTab="Status" claim={mockClaim} />
        </Provider>,
      );

      // Should show on Files tab
      expect($('.claims-alert', filesContainer)).to.exist;
      expect(filesContainer.textContent).to.include(
        'We need you to submit files by mail or in person',
      );

      // Should show on Status tab
      expect($('.claims-alert', statusContainer)).to.exist;
      expect(statusContainer.textContent).to.include(
        'We need you to submit files by mail or in person',
      );
    });

    it('should not render Type 1 Unknown error alert on Overview tab', () => {
      const { container } = renderWithRouter(
        <Provider
          store={getStore(
            { [FEATURE_FLAG_KEY]: true },
            { type1UnknownErrors: mockType1UnknownErrors },
          )}
        >
          <ClaimDetailLayout currentTab="Overview" claim={mockClaim} />
        </Provider>,
      );

      expect($('.claims-alert', container)).to.not.exist;
    });
  });
});
