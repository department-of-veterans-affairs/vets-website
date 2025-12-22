import React from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { inbox } from '../fixtures/folder-inbox-response.json';
import messageResponse from '../fixtures/message-response.json';
import folderList from '../fixtures/folder-response.json';
import { Paths } from '../../util/constants';
import reducer from '../../reducers';
import FolderThreadListView from '../../containers/FolderThreadListView';
import {
  drupalStaticData,
  userProfileFacilities,
} from '../fixtures/cerner-facility-mock-data.json';

// This is being deprecated in favor of a shared CernerFacilitiesAlert component
describe.skip('Cerner Facility Alert', () => {
  const initialStateMock = {
    sm: {
      messageDetails: { message: messageResponse },
      folders: { folder: inbox, folderList },
    },
    drupalStaticData,
    user: {
      profile: {
        facilities: [],
      },
    },
    featureToggles: [],
  };

  const setup = (
    state = initialStateMock,
    path = Paths.INBOX,
    facilities = { facilities: [] },
  ) => {
    return renderWithStoreAndRouter(<FolderThreadListView testing />, {
      initialState: { ...state, user: { ...state.user, profile: facilities } },
      reducers: reducer,
      path,
    });
  };

  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch').resolves({
      ok: true,
      status: 204,
      json: () => Promise.resolve({}),
    });
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it(`does not render CernerFacilityAlert if cernerFacilities is empty`, async () => {
    const screen = setup();

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it(`renders CernerFacilityAlert with list of facilities if cernerFacilities.length > 1`, async () => {
    const userFacilities = userProfileFacilities.filter(
      f => f.isCerner === false,
    );

    const screen = setup(initialStateMock, Paths.INBOX, {
      facilities: [
        ...userFacilities,
        { facilityId: '668', isCerner: true },
        { facilityId: '687', isCerner: true },
        { facilityId: '692', isCerner: true },
      ],
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    expect(screen.getByText('VA Spokane health care')).to.exist;
    expect(screen.getByText('VA Walla Walla health care')).to.exist;
    expect(screen.getByText('VA Southern Oregon health care')).to.exist;
    expect(screen.queryByText('VA Puget Sound health care')).to.not.exist;
    expect(
      screen.getByText(
        'Some of your secure messages may be in a different portal. To view or manage secure messages at these facilities, go to My VA Health:',
      ),
    ).to.exist;
  });

  it(`renders CernerFacilityAlert with 1 facility if cernerFacilities.length === 1`, async () => {
    const screen = setup(initialStateMock, Paths.INBOX, {
      facilities: userProfileFacilities.filter(f => f.facilityId === '668'),
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;

    expect(
      screen.getByTestId('single-cerner-facility-text').textContent,
    ).to.contain(
      'Some of your secure messages may be in a different portal. To send a secure message to a provider at VA Spokane health care, go to My VA Health.',
    );
    expect(screen.queryByRole('ul')).to.not.exist;
  });

  it('does not send AAL request when the link is clicked and feature toggle disabled', async () => {
    const screen = setup(initialStateMock, Paths.INBOX, {
      facilities: userProfileFacilities.filter(f => f.facilityId === '668'),
    });
    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    const link = screen.getByTestId('cerner-facility-action-link');
    expect(link).to.exist;
    fetchStub.resetHistory();
    fireEvent.click(link);
    await waitFor(() => {
      expect(fetchStub.calledOnce).to.be.false;
    });
  });

  it('sends AAL request when the link is clicked and feature toggle enabled', async () => {
    const customState = {
      ...initialStateMock,
    };
    customState.featureToggles[
      FEATURE_FLAG_NAMES.mhvSecureMessagingMilestone2AAL
    ] = true;

    const screen = setup(customState, Paths.INBOX, {
      facilities: userProfileFacilities.filter(f => f.facilityId === '668'),
    });
    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    const link = screen.getByTestId('cerner-facility-action-link');
    expect(link).to.exist;
    fetchStub.resetHistory();
    fireEvent.click(link);
    await waitFor(() => {
      expect(fetchStub.calledOnce).to.be.true;
    });
    expect(fetchStub.firstCall.args[0]).to.contain('/my_health/v1/aal');
    expect(fetchStub.firstCall.args[1].method).to.equal('POST');
    expect(fetchStub.firstCall.args[1].body).to.equal(
      '{"aal":{"activityType":"Messaging","action":"Launch My VA Health","performerType":"Self","status":"1"},"product":"sm"}',
    );
  });
});
