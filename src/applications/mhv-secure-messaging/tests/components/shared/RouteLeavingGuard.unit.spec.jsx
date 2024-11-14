import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';
import RouteLeavingGuard from '../../../components/shared/RouteLeavingGuard';
import { ErrorMessages } from '../../../util/constants';
import reducer from '../../../reducers';
import Navigation from '../../../components/Navigation';
import inbox from '../../fixtures/folder-inbox-metadata.json';

describe('RouteLeavingGuard component', () => {
  const initialState = {
    sm: {
      folders: {
        folder: inbox,
      },
    },
  };

  const {
    cancelButtonText,
    confirmButtonText,
  } = ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT;

  const initialProps = {
    cancelButtonText,
    confirmButtonText,
    modalVisible: false,
    navigate: () => {},
    p1: 'p1',
    p2: 'p2',
    saveDraftHandler: () => {},
    shouldBlockNavigation: () => {},
    title: 'title',
    updateModalVisible: () => {},
    when: true,
  };

  const setup = (props = initialProps) => {
    return renderWithStoreAndRouter(
      <>
        <Navigation />
        <RouteLeavingGuard {...props} />
      </>,
      {
        initialState,
        reducers: reducer,
        path: '/compose',
      },
    );
  };

  it('triggers shouldBlock callback on navigating away ', async () => {
    const updateModalVisibleSpy = sinon.spy();
    const shouldBlockSpy = sinon.spy(() => {
      return true;
    });
    const saveDraftHandlerSpy = sinon.spy();
    const customProps = {
      ...initialProps,
      updateModalVisible: updateModalVisibleSpy,
      shouldBlockNavigation: shouldBlockSpy,
      saveDraftHandler: saveDraftHandlerSpy,
    };
    const screen = setup(customProps);
    await waitFor(() => {
      screen.getByText('Inbox');
    });
    await fireEvent.click(screen.getByText('Inbox'));
    expect(shouldBlockSpy.calledOnce).to.be.true;

    await fireEvent.click(
      document.querySelector(`[text="${confirmButtonText}"]`),
    );
    expect(saveDraftHandlerSpy.calledWith('manual')).to.be.true;
  });

  it('respond to closing modal', async () => {
    const updateModalVisibleSpy = sinon.spy();
    const customProps = {
      ...initialProps,
      modalVisible: true,
      updateModalVisible: updateModalVisibleSpy,
      saveError: {
        cancelButtonText,
        confirmButtonText,
        title: 'Unable to save draft',
      },
      savedDraft: true,
    };
    setup(customProps);
    await fireEvent.click(
      document.querySelector(`[text="${cancelButtonText}"]`),
    );
    expect(updateModalVisibleSpy.calledWith(false));
  });

  it(`not blocking navigation when criteria is satisfied`, async () => {
    const updateModalVisibleSpy = sinon.spy();
    const shouldBlockSpy = sinon.spy(() => {
      return false;
    });
    const customProps = {
      ...initialProps,
      updateModalVisible: updateModalVisibleSpy,
      shouldBlockNavigation: shouldBlockSpy,
    };
    const screen = setup(customProps);
    await waitFor(() => {
      screen.getByText('Inbox');
    });
    fireEvent.click(screen.getByText('Inbox'));
    expect(shouldBlockSpy.calledOnce).to.be.true;
  });

  it(`save draft handler not called if a secondary button name is not ${
    ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT.confirmButtonText
  }`, async () => {
    const updateModalVisibleSpy = sinon.spy();
    const shouldBlockSpy = sinon.spy(() => {
      return false;
    });
    const saveDraftHandlerSpy = sinon.spy();
    const customCancelButtonText = 'cancel';
    const customProps = {
      ...initialProps,
      cancelButtonText: customCancelButtonText,
      updateModalVisible: updateModalVisibleSpy,
      shouldBlockNavigation: shouldBlockSpy,
      saveDraftHandler: saveDraftHandlerSpy,
    };
    const screen = setup(customProps);
    await waitFor(() => {
      screen.getByText('Inbox');
    });
    fireEvent.click(screen.getByText('Inbox'));
    await fireEvent.click(
      document.querySelector(`[text="${customCancelButtonText}"]`),
    );
    expect(saveDraftHandlerSpy.calledOnce).to.be.false;
  });
});
