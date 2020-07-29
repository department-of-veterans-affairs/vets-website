import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import { getParentSiteMock } from '../mocks/v0';
import { createTestStore } from '../mocks/setup';
import {
  mockParentSites,
  mockSupportedFacilities,
  mockRequestSubmit,
} from '../mocks/helpers';
import { FETCH_STATUS } from '../../utils/constants';
import ExpressCareFormPage from '../../containers/ExpressCareFormPage';
import ExpressCareConfirmationPage from '../../containers/ExpressCareConfirmationPage';
import { fetchExpressCareWindows } from '../../actions/expressCare';

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

describe('VAOS integration: Express Care form submission', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should show error page on failure', () => {});
  it('should show confirmation page on success', async () => {
    mockParentSites(['983'], [parentSite983]);
    mockSupportedFacilities({
      siteId: 983,
      parentId: 983,
      typeOfCareId: 'CR1',
      data: [
        {
          id: '983',
          attributes: {
            authoritativeName: 'Testing',
            rootStationCode: '983',
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
    const store = createTestStore({
      ...initialState,
      // Remove this mocking when we get a real page set up
      expressCare: {
        windowsStatus: FETCH_STATUS.notStarted,
        windows: null,
        localWindowString: null,
        minStart: null,
        maxEnd: null,
        data: {
          email: 'test@va.gov',
          phoneNumber: '5555555555',
          reasonForVisit: 'cough',
          additionalInformation: 'Whatever',
        },
        submitStatus: FETCH_STATUS.notStarted,
        successfulRequest: null,
      },
    });
    store.dispatch(fetchExpressCareWindows());
    const requestData = {
      id: 'testing',
      attributes: {
        typeOfCareId: 'CR1',
        email: 'test@va.gov',
        phoneNumber: '5555555555',
        reasonForVisit: 'cough',
        additionalInformation: 'Whatever',
        status: 'Submitted',
      },
    };
    mockRequestSubmit('va', requestData);

    const router = {
      push: sinon.spy(),
    };
    let screen = renderInReduxProvider(
      <ExpressCareFormPage router={router} />,
      {
        store,
      },
    );

    fireEvent.click(await screen.findByText(/submit express care/i));
    expect(screen.baseElement).to.contain.text(
      'Submitting your Express Care request',
    );
    await waitFor(() => expect(router.push.called).to.be.true);
    expect(router.push.firstCall.args[0]).to.equal(
      '/new-express-care-request/confirmation',
    );
    await cleanup();

    const responseData = JSON.parse(
      global.fetch
        .getCalls()
        .find(call => call.args[0].includes('appointment_requests')).args[1]
        .body,
    );

    expect(responseData).to.deep.include({
      ...requestData.attributes,
      typeOfCareId: 'CR1',
      facility: {
        facilityCode: '983',
        parentSiteCode: '983',
        name: 'Testing',
      },
    });

    screen = renderInReduxProvider(
      <ExpressCareConfirmationPage router={router} />,
      {
        store,
      },
    );
    expect(screen.baseElement).to.contain.text('Next step');
    expect(screen.baseElement).to.contain('.fa-exclamation-triangle');
    expect(screen.baseElement).to.contain(
      '.vads-u-border-color--warning-message',
    );

    expect(screen.baseElement).to.contain.text('Your contact details');
    expect(screen.baseElement).to.contain.text('5555555555');
    expect(screen.baseElement).to.contain.text('test@va.gov');

    expect(screen.baseElement).to.contain.text(
      'You shared these details about your concern',
    );
    expect(screen.baseElement).to.contain.text('Whatever');
  });

  it('should redirect home when there is no request to show', async () => {
    const store = createTestStore(initialState);
    store.dispatch(fetchExpressCareWindows());

    const router = {
      replace: sinon.spy(),
    };
    const screen = renderInReduxProvider(
      <ExpressCareConfirmationPage router={router} />,
      {
        store,
      },
    );

    await waitFor(() => expect(router.replace.called).to.be.true);
    expect(screen.baseElement.textContent).to.not.be.ok;
    expect(router.replace.firstCall.args[0]).to.equal(
      '/new-express-care-request',
    );
  });
});
