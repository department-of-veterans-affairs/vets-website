import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';
import { waitFor, fireEvent } from '@testing-library/dom';
import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import ExpressCareInfoPage from '../../containers/ExpressCareInfoPage';
import NewExpressCareRequestLayout from '../../containers/NewExpressCareRequestLayout';
import { createTestStore } from '../mocks/setup';
import { getParentSiteMock } from '../mocks/v0';
import { mockParentSites, mockSupportedFacilities } from '../mocks/helpers';

const initialState = {
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

const parentSite983 = {
  id: '983',
  attributes: {
    ...getParentSiteMock().attributes,
    institutionCode: '983',
    authoritativeName: 'Some VA facility',
    rootStationCode: '983',
    parentStationCode: '983',
  },
};

describe('VAOS integration: Express Care info page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should render info page when there are active windows', async () => {
    mockParentSites(['983'], [parentSite983]);
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          id: '983',
          attributes: {
            rootStationCode: '983',
            institutionCode: '983',
            parentSiteCode: '983',
            expressTimes: {
              start: '00:00',
              end: '23:59',
              timezone: 'UTC',
              offsetUtc: '-00:00',
            },
          },
        },
      ],
    });
    const router = {
      push: sinon.spy(),
    };
    const store = createTestStore(initialState);
    const screen = renderInReduxProvider(
      <NewExpressCareRequestLayout>
        <ExpressCareInfoPage router={router} />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    expect(await screen.findByText(/How Express Care Works/i)).to.exist;
    expect(
      screen.getByText(
        /You can request Express Care between 12:00 and 11:59 p.m. UTC./i,
      ),
    ).to.exist;
    fireEvent.click(screen.getByText('Cancel'));
    expect(router.push.calledWith('/')).to.be.true;

    fireEvent.click(screen.getByText(/^Continue/));
    expect(router.push.calledWith('/new-express-care-request/form')).to.be.true;
  });

  it('should redirect home when there is not an active window', async () => {
    mockParentSites(['983'], [parentSite983]);
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          id: '983',
          attributes: {
            rootStationCode: '983',
            institutionCode: '983',
            parentSiteCode: '983',
            expressTimes: {
              start: moment.utc().subtract(1, 'hours'),
              end: moment.utc().subtract(2, 'hours'),
              timezone: 'UTC',
              offsetUtc: '-00:00',
            },
          },
        },
      ],
    });
    const router = {
      push: sinon.spy(),
    };
    const store = createTestStore(initialState);
    const screen = renderInReduxProvider(
      <NewExpressCareRequestLayout router={router}>
        <ExpressCareInfoPage router={router} />
      </NewExpressCareRequestLayout>,
      {
        store,
      },
    );

    await waitFor(() => expect(router.push.called).to.be.true);
    expect(router.push.firstCall.args[0]).to.equal('/');
    expect(screen.queryByText(/How Express Care Works/i)).to.not.exist;
  });
});
