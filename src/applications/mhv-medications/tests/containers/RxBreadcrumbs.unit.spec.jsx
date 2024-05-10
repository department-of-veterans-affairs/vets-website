import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import reducers from '../../reducers';
import RxBreadcrumbs from '../../containers/RxBreadcrumbs';
import { medicationsUrls } from '../../util/constants';

describe('Medications Breadcrumbs', () => {
  const initialState = {
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
      },
    },
  };
  const setup = (
    path = '/medications-new/prescription/000',
    state = initialState,
  ) => {
    return renderWithStoreAndRouter(<RxBreadcrumbs />, {
      initialState: state,
      reducers,
      path,
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('Make sure breadcrumbs render', () => {
    const screen = setup();
    const breadcrumbs = screen.getByTestId('rx-breadcrumb');
    expect(breadcrumbs).to.exist;
  });

  it('should render just one crumb(1 level deep) and not the whole crumb history', () => {
    const screen = setup();
    expect(screen.getByText('Back to Medications')).to.exist;
    expect(screen.queryByText('Back to About medications')).to.be.null;
  });

  it('should be able to click on back link and render previous crumb', () => {
    const screen = setup();
    const linkButton = screen.getByText('Back to Medications');
    fireEvent.click(linkButton);
    expect(screen.getByText('Back to About medications')).to.exist;
    expect(screen.queryByText('Back to Medications')).to.be.null;
  });

  it('should not render any crumbs when path is /about', () => {
    const screen = setup('/about', []);
    expect(screen.queryByText('Back to About medications')).to.be.null;
  });
});
