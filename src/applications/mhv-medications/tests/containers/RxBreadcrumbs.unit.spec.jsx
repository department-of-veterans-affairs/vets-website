import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import RxBreadcrumbs from '../../containers/RxBreadcrumbs';
import { medicationsUrls } from '../../util/constants';

describe('Medications Breadcrumbs', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<RxBreadcrumbs />, {
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
      },
      reducers,
      path: '/medications/prescription/000',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('Make sure breadcrumbs render', () => {
    const screen = setup();
    const breadcrumbs = screen.findByTestId('rx-breadcrumb');
    expect(breadcrumbs).to.exist;
  });
});
