import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import EmergencyContact from '../EmergencyContact';

describe('check in', () => {
  describe('EmergencyContact', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
            currentPage: 'first-page',
          },
        },
      };
      store = mockStore(initState);
    });
    const data = {
      address: {
        street1: '445 Fine Finch Fairway',
        street2: 'Apt 201',
        city: 'Fairfence',
        state: 'Florida',
        zip: '445545',
      },
      name: 'Leslie',
      relationship: 'Aunt',
      phone: '5553334444',
      workPhone: '5554445555',
    };
    const demographicsStatus = {
      emergencyContactNeedsUpdate: true,
    };
    it('renders', () => {
      const component = render(
        <Provider store={store}>
          <EmergencyContact
            emergencyContact={data}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(component.getByText('Is this your current emergency contact?')).to
        .exist;
    });

    it('shows emergency contact felids, with message for empty data', () => {
      const partialData = {
        ...data,
        phone: '',
        relationship: '',
      };

      const component = render(
        <Provider store={store}>
          <EmergencyContact
            emergencyContact={partialData}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('Leslie')).to.exists;
      expect(component.queryByText('555-333-4444')).to.be.null;
      expect(component.queryByText('Aunt')).to.be.null;
      expect(component.getAllByText('Not available').length).to.equal(2);
    });

    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <EmergencyContact
            emergencyContact={data}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );
    });

    it('goes to the error page when the data is unavailable', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {},
      };

      render(
        <Provider store={store}>
          <EmergencyContact
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(push.calledOnce).to.be.true;
    });

    it('shows the loading indicator', () => {
      const { container } = render(
        <Provider store={store}>
          <EmergencyContact isLoading demographicsStatus={demographicsStatus} />
        </Provider>,
      );

      expect(container.querySelector('va-loading-indicator')).to.have.attribute(
        'message',
        'Loading your appointments for today',
      );
    });

    it('has a clickable no button', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };

      const component = render(
        <Provider store={store}>
          <EmergencyContact
            emergencyContact={data}
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      component.getByTestId('no-button').click();
      expect(push.calledOnce).to.be.true;
    });

    it('has a clickable yes button', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };

      const component = render(
        <Provider store={store}>
          <EmergencyContact
            emergencyContact={data}
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      component.getByTestId('yes-button').click();
      expect(push.calledOnce).to.be.true;
    });

    it('skips to the next page when needs update is false', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {},
      };

      const { rerender } = render(
        <Provider store={store}>
          <EmergencyContact
            router={mockRouter}
            emergencyContact={data}
            demographicsStatus={{ emergencyContactNeedsUpdate: false }}
          />
        </Provider>,
      );

      rerender(
        <Provider store={store}>
          <EmergencyContact
            router={mockRouter}
            emergencyContact={data}
            demographicsStatus={{ emergencyContactNeedsUpdate: false }}
          />
        </Provider>,
      );

      expect(push.called).to.be.true;
    });
  });
});
