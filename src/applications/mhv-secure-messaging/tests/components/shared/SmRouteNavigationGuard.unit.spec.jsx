import React from 'react';
import { cleanup, fireEvent, waitFor } from '@testing-library/react';
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
    screen.unmount();
  });

  it('proceeds with navigating away if Cancel button is clicked', async () => {
    const cancelChangesSpy = sinon.spy();
    const customProps = {
      ...initialProps,
      onCancelButtonClick: cancelChangesSpy,
    };

    const screen = setup(customProps, Paths.CONTACT_LIST);

    await fireEvent.click(
      screen.getByTestId('sm-route-navigation-guard-cancel-button'),
    );
    expect(cancelChangesSpy.calledOnce).to.be.true;
    screen.unmount();
  });

  it('does not navigate away if Confirm button is clicked', async () => {
    const saveChangesSpy = sinon.spy();
    const customProps = {
      ...initialProps,
      onConfirmButtonClick: saveChangesSpy,
    };

    const screen = setup(customProps, Paths.CONTACT_LIST);

    await fireEvent.click(
      screen.getByTestId('sm-route-navigation-guard-confirm-button'),
    );
    expect(saveChangesSpy.calledOnce).to.be.true;
    screen.unmount();
  });

  it('should set window.onbeforeunload if "when" is true', async () => {
    const addEventListenerSpy = sinon.spy(window, 'addEventListener');
    const customProps = {
      ...initialProps,
      when: true,
    };
    const screen = setup(customProps, Paths.CONTACT_LIST);

    expect(screen);

    screen.findByTestId('select-all-Test-Facility-1-teams');

    await waitFor(() => {
      fireEvent(window, new Event('beforeunload'));
      expect(addEventListenerSpy.calledWith('beforeunload')).to.be.true;
      expect(window.onbeforeunload).to.be.a('function');
      const result = window.onbeforeunload();
      expect(result === undefined || typeof result === 'string').to.be.true;
    });

    addEventListenerSpy.restore();
    screen.unmount();
  });
});
