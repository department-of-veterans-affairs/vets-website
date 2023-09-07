import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import VeteranProfileInformation from '../../../../components/FormPages/VeteranProfileInformation';
import { normalizeFullName } from '../../../../utils/helpers/general';

describe('ezr VeteranProfileInformation', () => {
  const middleware = [];
  const mockStore = configureStore(middleware);
  const defaultData = {
    user: {
      profile: {
        userFullName: {
          first: 'John',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.',
        },
      },
    },
  };
  const props = { goBack: sinon.spy(), goForward: sinon.spy() };

  describe('when the component renders', () => {
    describe('default behavior', () => {
      it('should render full name from the profile data', () => {
        const store = mockStore(defaultData);
        const { container } = render(
          <Provider store={store}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-fullname"]',
        );
        expect(selector).to.exist;
        expect(selector).to.contain.text(
          normalizeFullName(defaultData.user.profile.userFullName, true),
        );
      });

      it('should render form navigation buttons', () => {
        const store = mockStore(defaultData);
        const { container } = render(
          <Provider store={store}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const formNav = {
          back: container.querySelector('.usa-button-secondary'),
          continue: container.querySelector('.usa-button-primary'),
        };
        expect(formNav.back).to.exist;
        expect(formNav.continue).to.exist;
      });
    });

    describe('when date of birth is not in the profile data', () => {
      const store = mockStore(defaultData);

      it('should only reference `name` in the opening paragraph', () => {
        const { container } = render(
          <Provider store={store}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-profile-intro"]',
        );
        expect(selector).to.contain.text(
          'Here’s the name we have on file for you.',
        );
      });

      it('should not render date of birth container', () => {
        const { container } = render(
          <Provider store={store}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-dob"]',
        );
        expect(selector).to.not.exist;
      });
    });

    describe('when date of birth is in the profile data', () => {
      const data = {
        ...defaultData,
        user: {
          ...defaultData.user,
          profile: {
            ...defaultData.user.profile,
            dob: '1990-11-24',
          },
        },
      };
      const store = mockStore(data);

      it('should reference `personal information` in the opening paragraph', () => {
        const { container } = render(
          <Provider store={store}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-profile-intro"]',
        );
        expect(selector).to.contain.text(
          'This is the personal information we have on file for you.',
        );
      });

      it('should render date of birth container', () => {
        const { container } = render(
          <Provider store={store}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-dob"]',
        );
        expect(selector).to.exist;
        expect(selector).to.contain.text('November 24, 1990');
      });
    });
  });

  describe('when the `Back` button is clicked', () => {
    it('should call the `goBack` method', () => {
      const store = mockStore(defaultData);
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.usa-button-secondary');
      fireEvent.click(selector);
      expect(props.goBack.called).to.be.true;
    });
  });

  describe('when the `Continue` button is clicked', () => {
    it('should call the `goForward` method', () => {
      const store = mockStore(defaultData);
      const { container } = render(
        <Provider store={store}>
          <VeteranProfileInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.true;
    });
  });
});
