import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { agent, attorney, org, vso } from '../fixtures/sparseFormDataExamples';
import AddressAuthorizationPolicy from '../../components/AddressAuthorizationPolicy';

describe('<AddressAuthorizationPolicy>', () => {
  const getProps = ({ formData = {} } = {}) => {
    return {
      mockStore: {
        getState: () => ({
          form: {
            data: formData,
          },
        }),
        subscribe: () => {},
        dispatch: () => ({}),
      },
    };
  };

  it('should render component', () => {
    const { mockStore } = getProps({ formData: vso });

    const { container } = render(
      <Provider store={mockStore}>
        <AddressAuthorizationPolicy />
      </Provider>,
    );
    expect(container).to.exist;
  });

  context('when the selected representative is an organization', () => {
    it('should use the 21-22 policy', () => {
      const { mockStore } = getProps({ formData: org });

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy />
        </Provider>,
      );

      const usedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122"]',
      );
      const unusedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122a"]',
      );

      expect(usedPolicy).to.exist;
      expect(unusedPolicy).not.to.exist;
    });
  });

  context('when the selected representative is a vso representative', () => {
    it('should use the 21-22 policy', () => {
      const { mockStore } = getProps({ formData: vso });

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy />
        </Provider>,
      );

      const usedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122"]',
      );
      const unusedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122a"]',
      );

      expect(usedPolicy).to.exist;
      expect(unusedPolicy).not.to.exist;
    });
  });

  context('when the selected representative is an attorney', () => {
    it('should use the 21-22a policy', () => {
      const { mockStore } = getProps({ formData: attorney });

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy />
        </Provider>,
      );

      const usedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122a"]',
      );
      const unusedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122"]',
      );

      expect(usedPolicy).to.exist;
      expect(unusedPolicy).not.to.exist;
    });
  });

  context('when the selected representative is a claims agent', () => {
    it('should use the 21-22a policy', () => {
      const { mockStore } = getProps({ formData: agent });

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy />
        </Provider>,
      );

      const usedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122a"]',
      );
      const unusedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122"]',
      );

      expect(usedPolicy).to.exist;
      expect(unusedPolicy).not.to.exist;
    });
  });

  context('when there is no selected representative', () => {
    it('should use the 21-22a policy', () => {
      const { mockStore } = getProps();

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy />
        </Provider>,
      );

      const usedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122a"]',
      );
      const unusedPolicy = container.querySelector(
        '[data-testid="address-authorization-policy-2122"]',
      );

      expect(usedPolicy).to.exist;
      expect(unusedPolicy).not.to.exist;
    });
  });
});
