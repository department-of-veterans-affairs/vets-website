import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';

import DependentListLoopForm from '../../../../components/FormFields/DependentListLoopForm';

describe('hca <DependentListLoopForm>', () => {
  const getData = ({ page, loggedIn = false, data = {} }) => ({
    props: {
      data,
      page,
      onChange: () => {},
      onSubmit: () => {},
    },
    mockStore: {
      getState: () => ({
        form: {
          data: {},
          loadedData: {
            metadata: {},
          },
          lastSavedDate: null,
          migrations: [],
          prefillTransformer: null,
        },
        user: {
          login: { currentlyLoggedIn: loggedIn },
          profile: {
            loading: false,
            loa: { current: null },
            savedForms: [],
            prefillsAvailable: [],
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    },
  });

  context('when on the personal information form page', () => {
    const { props, mockStore } = getData({
      page: { id: 'basic', title: '%s\u2019s basic information' },
    });

    it('should render with a generic title', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <DependentListLoopForm {...props} />
        </Provider>,
      );
      const form = container.querySelector('.rjsf');
      const title = container.querySelector('#root__title');
      expect(form).to.exist;
      expect(title).to.contain.text('Dependent\u2019s basic information');
    });
  });

  context('when on a form page after the personal information page', () => {
    const { props, mockStore } = getData({
      data: { fullName: { first: 'Mary', last: 'Smith' } },
      page: { id: 'additional', title: '%s\u2019s additional information' },
    });

    it('should render with a title specific to the dependent name', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <DependentListLoopForm {...props} />
        </Provider>,
      );
      const form = container.querySelector('.rjsf');
      const title = container.querySelector('#root__title');
      expect(form).to.exist;
      expect(title).to.contain.text('Mary Smith\u2019s additional information');
    });
  });

  context('when the user is logged out', () => {
    const { props, mockStore } = getData({
      page: { id: 'basic', title: '%s\u2019s basic information' },
    });

    it('should not render the save-in-progress warning', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <DependentListLoopForm {...props} />
        </Provider>,
      );
      const alert = container.querySelector('[data-testid="hca-sip-warning"]');
      expect(alert).to.not.exist;
    });
  });

  context('when the user is logged in', () => {
    const { props, mockStore } = getData({
      page: { id: 'basic', title: '%s\u2019s basic information' },
      loggedIn: true,
    });

    it('should render the save-in-progress warning', () => {
      const { container } = render(
        <Provider store={mockStore}>
          <DependentListLoopForm {...props} />
        </Provider>,
      );
      const alert = container.querySelector('[data-testid="hca-sip-warning"]');
      expect(alert).to.exist;
    });
  });
});
