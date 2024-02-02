import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import { inbox } from '../fixtures/folder-inbox-response.json';
import messageResponse from '../fixtures/message-response.json';
import folderList from '../fixtures/folder-response.json';
import { Paths } from '../../util/constants';
import reducer from '../../reducers';
import FolderThreadListView from '../../containers/FolderThreadListView';
import {
  drupalStaticData,
  cernerFacilities,
} from '../fixtures/cerner-facility-mock-data.json';

describe('Cerner Facility Alert', () => {
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
  };

  const setup = (
    state = initialStateMock,
    path = Paths.INBOX,
    facilities = { facilities: {}, cernerFacilities: {} },
  ) => {
    return renderWithStoreAndRouter(<FolderThreadListView testing />, {
      initialState: { ...state, sm: { ...state.sm, facilities } },
      reducers: reducer,
      path,
    });
  };

  it(`does not render CernerFacilityAlert if cernerFacilities is empty`, async () => {
    const screen = setup();

    expect(screen.queryByTestId('cerner-facilities-alert')).to.not.exist;
  });

  it(`renders CernerFacilityAlert with list of facilities if cernerFacilities.length > 1`, async () => {
    const customState = {
      ...initialStateMock,
      user: {
        profile: {
          facilities: [
            {
              facilityId: '463',
              isCerner: true,
            },
            {
              facilityId: '583',
              isCerner: true,
            },
            {
              facilityId: '668',
              isCerner: true,
            },
          ],
        },
      },
    };
    const screen = setup(customState, Paths.INBOX, {
      facilities: [],
      cernerFacilities,
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;
    expect(screen.getByText('VA Alaska health care')).to.exist;
    expect(screen.getByText('VA Indiana health care')).to.exist;
    expect(screen.getByText('VA Spokane health care')).to.exist;
  });

  it(`renders CernerFacilityAlert with 1 facility if cernerFacilities.length === 1`, async () => {
    const customState = {
      ...initialStateMock,
      user: {
        profile: {
          facilities: [
            {
              facilityId: '668',
              isCerner: true,
            },
          ],
        },
      },
    };
    const screen = setup(customState, Paths.INBOX, {
      facilities: [],
      cernerFacilities: [
        {
          uniqueId: '668',
        },
      ],
    });

    expect(screen.queryByTestId('cerner-facilities-alert')).to.exist;

    expect(
      screen.getByTestId('single-cerner-facility-text').textContent,
    ).to.contain(
      'To send a secure message to a provider at VA Spokane health care, go to My VA Health.',
    );
  });
});
