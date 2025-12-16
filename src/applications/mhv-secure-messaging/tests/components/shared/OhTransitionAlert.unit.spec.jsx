/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/react';
import reducer from '../../../reducers';
import OhTransitionAlert from '../../../components/shared/OhTransitionAlert';
import { OhTransitionAlertContent } from '../../../util/constants';
import * as SmApi from '../../../api/SmApi';

describe('OhTransitionAlert component', () => {
  let sandbox;

  const initialState = {
    featureToggles: {
      loading: false,
      mhv_secure_messaging_milestone_2_aal: true,
    },
    sm: {
      folders: { folder: { folderId: 0, name: 'Inbox' } },
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const setup = (customState = {}) => {
    return renderWithStoreAndRouter(<OhTransitionAlert />, {
      initialState: { ...initialState, ...customState },
      reducers: reducer,
    });
  };

  it('renders the expandable alert with correct trigger text', () => {
    const { getByTestId } = setup();

    const alert = getByTestId('oh-transition-alert');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('trigger')).to.equal(
      OhTransitionAlertContent.TRIGGER,
    );
  });

  it('renders the alert body content', () => {
    const { getByTestId, getByText } = setup();

    const content = getByTestId('oh-transition-alert-content');
    expect(content).to.exist;

    expect(getByText(OhTransitionAlertContent.BODY)).to.exist;
    expect(getByText(OhTransitionAlertContent.QUESTION)).to.exist;
  });

  it('renders the Go to My VA Health link', () => {
    const { getByTestId } = setup();

    const link = getByTestId('oh-transition-alert-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      OhTransitionAlertContent.LINK_TEXT,
    );
    expect(link.getAttribute('type')).to.equal('secondary');
  });

  it('calls submitLaunchMyVaHealthAal when link is clicked and AAL is enabled', async () => {
    const submitAalStub = sandbox.stub(SmApi, 'submitLaunchMyVaHealthAal');

    const { getByTestId } = setup();

    const link = getByTestId('oh-transition-alert-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(submitAalStub.calledOnce).to.be.true;
    });
  });

  it('does not call submitLaunchMyVaHealthAal when AAL is disabled', async () => {
    const submitAalStub = sandbox.stub(SmApi, 'submitLaunchMyVaHealthAal');

    const { getByTestId } = setup({
      featureToggles: {
        loading: false,
        mhv_secure_messaging_milestone_2_aal: false,
      },
    });

    const link = getByTestId('oh-transition-alert-link');
    fireEvent.click(link);

    await waitFor(() => {
      expect(submitAalStub.called).to.be.false;
    });
  });

  it('has correct CSS classes for spacing', () => {
    const { getByTestId } = setup();

    const alert = getByTestId('oh-transition-alert');
    expect(alert.getAttribute('class')).to.include('vads-u-margin-bottom--3');
    expect(alert.getAttribute('class')).to.include('vads-u-margin-top--2');
  });
});
