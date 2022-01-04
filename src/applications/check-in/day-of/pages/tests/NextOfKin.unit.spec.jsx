import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import NextOfKin from '../NextOfKin';

describe('check in', () => {
  describe('Next of Kin', () => {
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
    const nextOfKin = {
      address: {
        street1: '445 Fine Finch Fairway',
        street2: 'Apt 201',
        city: 'Fairfence',
        state: 'Florida',
        zip: '445545',
      },
      name: 'Kin, Next',
      relationship: 'child',
      phone: '5553334444',
      workPhone: '5554445555',
    };
    const demographicsStatus = {
      nextOfKinNeedsUpdate: true,
    };
    it('renders', () => {
      const component = render(
        <Provider store={store}>
          <NextOfKin
            nextOfKin={nextOfKin}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.queryByText('Not available')).to.be.null;
    });

    it('shows "Not available" for unavailable fields', () => {
      const partialNextOfKin = {
        address: nextOfKin.address,
        phone: nextOfKin.phone,
      };

      const component = render(
        <Provider store={store}>
          <NextOfKin
            nextOfKin={partialNextOfKin}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      expect(component.getByText('445 Fine Finch Fairway')).to.exist;
      expect(component.getByText('555-333-4444')).to.exist;
      expect(component.queryByText('Kin, Next')).to.be.null;
      expect(component.queryByText('5554445555')).to.be.null;
      expect(component.getAllByText('Not available')).to.exist;
    });

    it('passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <NextOfKin
            nextOfKin={nextOfKin}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );
    });

    it('goes to the error page when the next of kin data is unavailable', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {},
      };

      render(
        <Provider store={store}>
          <NextOfKin
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      sinon.assert.calledOnce(push);
    });

    it('shows the loading indicator', () => {
      const { container } = render(
        <Provider store={store}>
          <NextOfKin isLoading demographicsStatus={demographicsStatus} />
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
          <NextOfKin
            nextOfKin={nextOfKin}
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('no-button').click();
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
          <NextOfKin
            nextOfKin={nextOfKin}
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
    });

    it('has a clickable yes button with update page enabled', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {
          token: 'token-123',
        },
      };

      const component = render(
        <Provider store={store}>
          <NextOfKin
            nextOfKin={nextOfKin}
            isUpdatePageEnabled
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
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
          <NextOfKin
            nextOfKin={nextOfKin}
            router={mockRouter}
            demographicsStatus={demographicsStatus}
          />
        </Provider>,
      );

      expect(
        component.getByText('Is this your current next of kin information?'),
      ).to.exist;
      component.getByTestId('yes-button').click();
    });
    it('skips to the next page when needs update is false', () => {
      const push = sinon.spy();
      const mockRouter = {
        push,
        params: {},
      };

      const { rerender } = render(
        <Provider store={store}>
          <NextOfKin
            router={mockRouter}
            nextOfKin={nextOfKin}
            demographicsStatus={{ nextOfKinNeedsUpdate: false }}
          />
        </Provider>,
      );
      // this is testing something in the useEffect of the component and we need to
      // rerender the component to gurauntee the useEffect runs
      rerender(
        <Provider store={store}>
          <NextOfKin
            router={mockRouter}
            nextOfKin={nextOfKin}
            demographicsStatus={{ nextOfKinNeedsUpdate: false }}
          />
        </Provider>,
      );

      expect(push.called).to.be.true;
    });
  });
});
