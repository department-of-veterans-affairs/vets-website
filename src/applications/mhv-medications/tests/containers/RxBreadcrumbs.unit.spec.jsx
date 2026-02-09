import { expect } from 'chai';
import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import reducers from '../../reducers';
import RxBreadcrumbs from '../../containers/RxBreadcrumbs';
import { medicationsUrls } from '../../util/constants';

describe('Medications Breadcrumbs', () => {
  const prescriptionId = '000';
  const setup = (
    state = {},
    entries = [`${medicationsUrls.PRESCRIPTION_DETAILS}/${prescriptionId}`],
  ) => {
    return renderWithStoreAndRouterV6(<RxBreadcrumbs />, {
      initialState: {
        ...state,
      },
      reducers,
      initialEntries: entries,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders breadcrumbs on DETAILS route', () => {
    const screen = setup();
    const breadcrumbs = screen.getByTestId('rx-breadcrumb-link');
    expect(breadcrumbs).to.exist;
    expect(breadcrumbs.getAttribute('href')).to.equal(
      `${medicationsUrls.MEDICATIONS_URL}/`,
    );
    expect(breadcrumbs.getAttribute('text')).to.equal('Back to medications');
  });

  it('renders breadcrumbs on DOCUMENTATION route', () => {
    const screen = renderWithStoreAndRouterV6(
      <Routes>
        <Route
          path="/prescription/:prescriptionId/documentation"
          element={<RxBreadcrumbs />}
        />
      </Routes>,
      {
        initialState: {},
        reducers,
        initialEntries: [
          `${medicationsUrls.subdirectories.DETAILS}/${prescriptionId}${
            medicationsUrls.subdirectories.DOCUMENTATION
          }`,
        ],
      },
    );
    const breadcrumbs = screen.getByTestId('rx-breadcrumb-link');
    // get the href of the link
    const href = breadcrumbs.getAttribute('href');
    expect(href).to.equal(
      `${medicationsUrls.PRESCRIPTION_DETAILS}/${prescriptionId}`,
    );
    expect(breadcrumbs.getAttribute('text')).to.equal('Back');
  });

  it('renders breadcrumbs on BASE route', async () => {
    const screen = setup({}, [medicationsUrls.subdirectories.BASE]);

    await waitFor(() => {
      const element = $('va-breadcrumbs', screen.container);
      expect(element).to.exist;
      expect(element).to.have.attribute('data-testid', 'rx-breadcrumb');
      // Wait for the web component to fully hydrate its properties
      expect(element.breadcrumbList).to.exist;
    });
  });

  it('renders breadcrumbs on REFILL route', async () => {
    const screen = setup({}, [medicationsUrls.subdirectories.REFILL]);

    await waitFor(() => {
      const element = $('va-breadcrumbs', screen.container);
      expect(element).to.exist;
      expect(element).to.have.attribute('data-testid', 'rx-breadcrumb');
      expect(element.breadcrumbList).to.exist;
    });
  });

  it('renders nothing on unknown medications sub-route', () => {
    const screen = setup({}, [
      `${medicationsUrls.MEDICATIONS_URL}/no-page-here`,
    ]);

    expect(screen.queryByTestId('rx-breadcrumb-link')).to.be.null;
    expect(screen.queryByTestId('rx-breadcrumb')).to.be.null;
  });
});
