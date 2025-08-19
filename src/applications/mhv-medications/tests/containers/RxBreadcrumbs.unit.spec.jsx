import { expect } from 'chai';
import React from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import RxBreadcrumbs from '../../containers/RxBreadcrumbs';
import { medicationsUrls } from '../../util/constants';

describe('Medications Breadcrumbs', () => {
  const setup = (state = {}) => {
    return renderWithStoreAndRouterV6(<RxBreadcrumbs />, {
      initialState: {
        rx: {
          breadcrumbs: {
            list: [
              {
                url: `${medicationsUrls.MEDICATIONS_ABOUT}`,
                label: 'About medications',
              },
              {
                url: `${medicationsUrls.MEDICATIONS_URL}/1`,
                label: 'Medications',
              },
            ],
            location: {
              url: `${medicationsUrls.PRESCRIPTION_DETAILS}/000`,
              label: 'Prescription Name',
            },
          },
        },
        ...state,
      },
      reducers,
      initialEntries: ['/medications/prescription/000'],
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('Make sure breadcrumbs render', () => {
    const screen = setup();
    const breadcrumbs = screen.getByTestId('rx-breadcrumb-link');
    expect(breadcrumbs).to.exist;
  });

  it('Correct link is shown on documentation page', () => {
    const screen = renderWithStoreAndRouterV6(
      <Routes>
        <Route
          path="/prescription/:prescriptionId/documentation"
          element={<RxBreadcrumbs />}
        />
      </Routes>,
      {
        initialState: {
          featureToggles: {
            // eslint-disable-next-line camelcase
            mhv_medications_display_documentation_content: true,
          },
        },
        reducers,
        initialEntries: [`/prescription/5678/documentation`],
      },
    );
    const breadcrumbs = screen.getByTestId('rx-breadcrumb-link');
    // get the href of the link
    const href = breadcrumbs.getAttribute('href');
    expect(href).to.equal(`${medicationsUrls.PRESCRIPTION_DETAILS}/5678`);
  });

  it('Renders breadcrumb if Rx details call fails', () => {
    const screen = setup({
      rx: {
        prescriptions: {
          prescriptionDetails: undefined,
          apiError: true,
        },
      },
    });
    const breadcrumbs = screen.getByTestId('rx-breadcrumb-link');
    expect(breadcrumbs).to.exist;
  });

  it('Does not render breadcrumbs if Rx details call returns 404', () => {
    const screen = setup({
      rx: {
        prescriptions: {
          prescriptionDetails: undefined,
          apiError: { status: '404' },
        },
      },
    });
    const breadcrumbs = screen.getByTestId('rx-breadcrumb-link');
    expect(breadcrumbs).to.not.exist;
  });
});
