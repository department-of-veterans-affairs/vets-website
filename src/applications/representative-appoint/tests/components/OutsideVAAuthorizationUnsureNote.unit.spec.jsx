import React from 'react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import OutsideVAAuthorizationUnsureNote from '../../components/OutsideVAAuthorizationUnsureNote';

const attorney = {
  type: 'representative',
  attributes: {
    individualType: 'attorney',
  },
};

const agent = {
  type: 'representative',
  attributes: {
    individualType: 'claim_agents',
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

describe('<OutsideVAAuthorizationUnsureNote>', () => {
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
        <OutsideVAAuthorizationUnsureNote {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  context('when the selected representative is an attorney', () => {
    it('should include "Attorney"', () => {
      const { props, mockStore } = getProps({ rep: attorney });

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote {...props} />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Attorney');
    });
  });

  context('when the selected representative is a claims agent', () => {
    it('should include "Claims Agent"', () => {
      const { props, mockStore } = getProps({ rep: agent });

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote {...props} />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Claims Agent');
    });
  });

  context('when the selected representative is a vso representative', () => {
    it('should include "VSO Representative"', () => {
      const { props, mockStore } = getProps({ rep: vso });

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote {...props} />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('VSO Representative');
    });
  });

  context('when the selected representative is an organization', () => {
    it('should include "Organization"', () => {
      const { props, mockStore } = getProps({ rep: org });

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote {...props} />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Organization');
    });
  });

  context('when there is no selected rep', () => {
    it('should include "VSO Representative"', () => {
      const { props, mockStore } = getProps();

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote {...props} formData={{}} />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('VSO Representative');
    });
  });
});
