import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import VeteranProfileInformation from '../../../../components/FormPages/VeteranProfileInformation';

describe('ezr VeteranProfileInformation page', () => {
  const getData = ({ dob = null, gender = null }) => ({
    props: {
      goBack: sinon.spy(),
      goForward: sinon.spy(),
    },
    mockStore: {
      getState: () => ({
        form: {
          data: {
            veteranSocialSecurityNumber: '211111111',
          },
        },
        user: {
          profile: {
            userFullName: {
              first: 'John',
              middle: 'David',
              last: 'Smith',
            },
            dob,
            gender,
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  describe('when the component renders', () => {
    context('default behavior', () => {
      it('should render full name and social security number', () => {
        const { props, mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selectors = {
          name: container.querySelector('[data-testid="ezr-veteran-fullname"]'),
          ssn: container.querySelector('[data-testid="ezr-veteran-ssn"]'),
        };
        expect(selectors.name).to.exist;
        expect(selectors.ssn).to.exist;
        expect(selectors.name).to.contain.text('John David Smith');
        expect(selectors.ssn).to.contain.text('●●●–●●–1111');
      });

      it('should render form navigation buttons', () => {
        const { props, mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
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

    context('when date of birth is not in the profile data', () => {
      it('should not render date of birth list item', () => {
        const { props, mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-dob"]',
        );
        expect(selector).to.not.exist;
      });
    });

    context('when date of birth is in the profile data', () => {
      it('should render date of birth list item', () => {
        const { props, mockStore } = getData({ dob: '1990-11-24' });
        const { container } = render(
          <Provider store={mockStore}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-dob"]',
        );
        expect(selector).to.exist;
        expect(selector).to.contain.text('11/24/1990');
      });
    });

    context('when gender is not in the profile data', () => {
      it('should not render gender list item', () => {
        const { props, mockStore } = getData({});
        const { container } = render(
          <Provider store={mockStore}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-gender"]',
        );
        expect(selector).to.not.exist;
      });
    });

    context('when gender is in the profile data', () => {
      it('should render gender list item', () => {
        const { props, mockStore } = getData({ gender: 'M' });
        const { container } = render(
          <Provider store={mockStore}>
            <VeteranProfileInformation {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="ezr-veteran-gender"]',
        );
        expect(selector).to.exist;
        expect(selector).to.contain.text('Male');
      });
    });
  });

  describe('when the `Back` button is clicked', () => {
    it('should call the `goBack` method', () => {
      const { props, mockStore } = getData({ dob: '1990-11-24', gender: 'M' });
      const { container } = render(
        <Provider store={mockStore}>
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
      const { props, mockStore } = getData({ dob: '1990-11-24', gender: 'M' });
      const { container } = render(
        <Provider store={mockStore}>
          <VeteranProfileInformation {...props} />
        </Provider>,
      );
      const selector = container.querySelector('.usa-button-primary');
      fireEvent.click(selector);
      expect(props.goForward.called).to.be.true;
    });
  });
});
