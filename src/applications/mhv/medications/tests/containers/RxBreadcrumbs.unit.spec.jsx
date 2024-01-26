import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../reducers';
import RxBreadcrumbs from '../../containers/RxBreadcrumbs';

describe('Medications Breadcrumbs', () => {
  const setup = () => {
    return renderWithStoreAndRouter(<RxBreadcrumbs />, {
      initialState: {
        rx: {
          breadcrumbs: {
            list: [
              {
                url: '/my-health/medications/about',
                label: 'About medications',
              },
              {
                url: '/my-health/medications/1',
                label: 'Medications',
              },
            ],
            location: {
              url: `/my-health/medications/prescription/000`,
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

  it('Find prescription label', () => {
    const screen = setup();
    expect(screen.getByText('Prescription Name')).to.exist;
  });
  it('Find medications label', () => {
    const screen = setup();
    expect(screen.getByText('Medications')).to.exist;
  });
  it('Find about label', () => {
    const screen = setup();
    expect(screen.getByText('About medications')).to.exist;
  });
});
