import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { agent, attorney, org, vso } from '../fixtures/sparseFormDataExamples';
import OutsideVAAuthorizationUnsureNote from '../../components/OutsideVAAuthorizationUnsureNote';

describe('<OutsideVAAuthorizationUnsureNote>', () => {
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
        <OutsideVAAuthorizationUnsureNote />
      </Provider>,
    );
    expect(container).to.exist;
  });

  context('when the selected representative is an attorney', () => {
    it('should include "Attorney"', () => {
      const { mockStore } = getProps({ formData: attorney });

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Attorney');
    });
  });

  context('when the selected representative is a claims agent', () => {
    it('should include "Claims Agent"', () => {
      const { mockStore } = getProps({ formData: agent });

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Claims Agent');
    });
  });

  context('when the selected representative is a vso representative', () => {
    it('should include "VSO Representative"', () => {
      const { props, mockStore } = getProps({ formData: vso });

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
      const { mockStore } = getProps({ formData: org });

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('Organization');
    });
  });

  context('when there is no selected rep', () => {
    it('should include "VSO Representative"', () => {
      const { mockStore } = getProps();

      const { container } = render(
        <Provider store={mockStore}>
          <OutsideVAAuthorizationUnsureNote />
        </Provider>,
      );

      const content = $('p', container);

      expect(content.textContent).to.contain('VSO Representative');
    });
  });
});
