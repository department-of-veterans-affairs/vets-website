import React from 'react';
import { cleanup, fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';
import reducer from '../../../reducers';
import inbox from '../../fixtures/folder-inbox-metadata.json';
import SmRouteNavigationGuard from '../../../components/shared/SmRouteNavigationGuard';
import { Paths } from '../../../util/constants';

describe('SmRouteNavigationGuard component', () => {
  const initialState = {
    sm: {
      folders: {
        folder: inbox,
      },
    },
  };

  const initialProps = {
    when: false,
    onConfirmNavigation: () => {},
    modalTitle: 'Are you sure you want to leave?',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  };

  const setup = (props = initialProps, initialPath) => {
    return renderWithStoreAndRouter(
      <>
        <SmRouteNavigationGuard {...props} />
      </>,
      {
        initialState,
        reducers: reducer,
        path: initialPath,
      },
    );
  };

  afterEach(() => {
    cleanup();
  });

  it('renders without errors', () => {
    const screen = setup(undefined, Paths.CONTACT_LIST);
    expect(screen);
  });

  it('proceeds with navigating away if Confirm button is clicked', async () => {
    const confirmNavigationSpy = sinon.spy();
    const customProps = {
      ...initialProps,
      onConfirmNavigation: confirmNavigationSpy,
    };

    const screen = setup(customProps, Paths.CONTACT_LIST);

    await fireEvent.click(
      screen.getByTestId('sm-route-navigation-guard-confirm-button'),
    );
    expect(confirmNavigationSpy.calledOnce).to.be.true;
  });

  it('does not navigate away if Cancel button is clicked', async () => {
    const confirmNavigationSpy = sinon.spy();
    const customProps = {
      ...initialProps,
      onConfirmNavigation: confirmNavigationSpy,
    };

    const screen = setup(customProps, Paths.CONTACT_LIST);

    await fireEvent.click(
      screen.getByTestId('sm-route-navigation-guard-cancel-button'),
    );
    expect(confirmNavigationSpy.calledOnce).to.be.false;
  });
});
