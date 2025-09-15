import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import ComposeMessageButton from '../../../components/MessageActionButtons/ComposeMessageButton';
import reducers from '../../../reducers';
import * as threadDetailsActions from '../../../actions/threadDetails';

describe('ComposeMessageButton component', () => {
  const initialState = {
    sm: {
      folders: {
        folderList: [],
        folder: null,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<ComposeMessageButton />, {
      initialState: state,
      reducers,
      path: '/',
    });
  };

  afterEach(() => {
    sinon.restore();
  });

  it('renders without errors', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('renders the compose message link with correct text', () => {
    const screen = setup();
    const composeLink = screen.getByText('Start a new message');
    expect(composeLink).to.exist;
    expect(composeLink.closest('a')).to.have.class('compose-message-link');
  });

  it('has correct data-testid attribute', () => {
    const screen = setup();
    const composeLink = screen.getByTestId('compose-message-link');
    expect(composeLink).to.exist;
  });

  it('has correct href pointing to compose path', () => {
    const screen = setup();
    const composeLink = screen.getByTestId('compose-message-link');
    expect(composeLink).to.have.attribute('href', '/compose');
  });

  it('applies correct CSS classes', () => {
    const screen = setup();
    const composeLink = screen.getByTestId('compose-message-link');
    expect(composeLink).to.have.class('compose-message-link');
    expect(composeLink).to.have.class('vads-c-action-link--green');
    expect(composeLink).to.have.class('vads-u-font-weight--bold');
    expect(composeLink).to.have.class('vads-u-padding-left--5');
  });

  it('dispatches clearDraftInProgress when clicked', () => {
    const clearDraftInProgressSpy = sinon.spy(
      threadDetailsActions,
      'clearDraftInProgress',
    );
    const screen = setup();
    const composeLink = screen.getByTestId('compose-message-link');
    
    fireEvent.click(composeLink);
    
    expect(clearDraftInProgressSpy.called).to.be.true;
  });

  it('container has correct styling classes', () => {
    const screen = setup();
    const container = screen.getByTestId('compose-message-link').parentElement;
    expect(container).to.have.class('vads-u-margin-top--1');
    expect(container).to.have.class('vads-u-font-size--lg');
  });
});