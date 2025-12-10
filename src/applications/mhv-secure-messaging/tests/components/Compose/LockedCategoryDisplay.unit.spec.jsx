import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import reducer from '../../../reducers';
import LockedCategoryDisplay from '../../../components/ComposeForm/LockedCategoryDisplay';
import { FormLabels, RxRenewalText } from '../../../util/constants';

describe('LockedCategoryDisplay component', () => {
  const initialState = {
    sm: {},
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    expect(screen).to.exist;
  });

  it('displays the correct label from FormLabels constant', () => {
    const screen = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    expect(screen.getByText(FormLabels.CATEGORY)).to.exist;
  });

  it('displays the correct locked category text from RxRenewalText constant', () => {
    const screen = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    const lockedDisplay = screen.getByTestId('locked-category-display');
    expect(lockedDisplay).to.exist;
    expect(lockedDisplay.textContent).to.equal(
      RxRenewalText.LOCKED_CATEGORY_DISPLAY,
    );
  });

  it('has data-dd-privacy="mask" attribute for PII protection', () => {
    const screen = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    const lockedDisplay = screen.getByTestId('locked-category-display');
    expect(lockedDisplay).to.have.attribute('data-dd-privacy', 'mask');
  });

  it('has data-dd-action-name attribute for Datadog tracking', () => {
    const screen = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    const lockedDisplay = screen.getByTestId('locked-category-display');
    expect(lockedDisplay).to.have.attribute(
      'data-dd-action-name',
      'Locked Category Display',
    );
  });

  it('applies bold font weight styling', () => {
    const screen = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    const lockedDisplay = screen.getByTestId('locked-category-display');
    expect(lockedDisplay).to.have.class('vads-u-font-weight--bold');
  });

  it('has correct container margin styling', () => {
    const { container } = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    const outerDiv = container.querySelector('.vads-u-margin-bottom--3');
    expect(outerDiv).to.exist;
  });

  it('has aria-label attribute for screen reader accessibility', () => {
    const { container } = renderWithStoreAndRouter(<LockedCategoryDisplay />, {
      initialState,
      reducers: reducer,
    });
    const dlElement = container.querySelector('dl');
    expect(dlElement).to.have.attribute('aria-label', 'Message category');
  });
});
