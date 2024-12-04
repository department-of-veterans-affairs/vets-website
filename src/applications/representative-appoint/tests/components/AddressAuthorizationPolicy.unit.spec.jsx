import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AddressAuthorizationPolicy from '../../components/AddressAuthorizationPolicy';

const attorney = {
  type: 'representative',
  attributes: {
    individualType: 'attorney',
  },
};

const vso = {
  type: 'representative',
  attributes: {
    individualType: 'veteran_service_officer',
  },
};

const org = {
  type: 'organization',
};

describe('<AddressAuthorizationPolicy>', () => {
  const getProps = ({
    submitted = false,
    setFormData = () => {},
    rep = {},
  } = {}) => {
    return {
      props: {
        formContext: {
          submitted,
        },
        formData: { 'view:selectedRepresentative': rep },
        setFormData,
      },
      mockStore: {
        getState: () => ({
          form: {
            data: { 'view:selectedRepresentative': rep },
          },
        }),
        subscribe: () => {},
        dispatch: () => ({
          setFormData: () => {},
        }),
      },
    };
  };

  it('should render component', () => {
    const { props, mockStore } = getProps({ rep: vso });

    const { container } = render(
      <Provider store={mockStore}>
        <AddressAuthorizationPolicy {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  context('when the selected representative is an organization', () => {
    it('should use the 21-22 policy', () => {
      const { props, mockStore } = getProps({ rep: org });

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy {...props} />
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
      const { props, mockStore } = getProps({ rep: vso });

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy {...props} />
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

  context(
    'when the selected representative is an attorney or claims agent',
    () => {
      it('should use the 21-22a policy', () => {
        const { props, mockStore } = getProps({ rep: attorney });

        const { container } = render(
          <Provider store={mockStore}>
            <AddressAuthorizationPolicy {...props} />
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
    },
  );

  context('when there is no selected representative', () => {
    it('should use the 21-22a policy', () => {
      const { props, mockStore } = getProps();

      const { container } = render(
        <Provider store={mockStore}>
          <AddressAuthorizationPolicy {...props} formData={{}} />
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
