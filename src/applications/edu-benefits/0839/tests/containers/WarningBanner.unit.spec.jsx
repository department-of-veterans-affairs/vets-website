import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WarningBanner from '../../containers/WarningBanner';

const mockStore = configureStore([]);

describe('WarningBanner Component', () => {
  let store;

  describe('for main institution (isArrayItem = false)', () => {
    it('does not render when institution is eligible', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: true,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('renders warning when institution is not YR eligible', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12X45678',
              yrEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
      expect(alert.textContent).to.include(
        "This facility code can't be accepted",
      );
    });

    it('renders warning when facility code has X in third position', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12X45678',
              yrEligible: true,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.textContent).to.include(
        "This facility code can't be accepted",
      );
    });

    it('does not render when institution is not found', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              institutionName: 'not found',
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render when facility code is not 8 characters', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '1234',
              yrEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render while loading', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12345678',
              yrEligible: false,
              isLoading: true,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('uses default dataPath when ui:options not provided', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12X45678',
              yrEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {};

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
    });
  });

  describe('for additional institution (isArrayItem = true)', () => {
    const mainInstitution = {
      facilityCode: '12345678',
      facilityMap: {
        branches: [
          { institution: { facilityCode: '11111111' } },
          { institution: { facilityCode: '22222222' } },
        ],
        extensions: [
          { institution: { facilityCode: '33333333' } },
          { institution: { facilityCode: '44444444' } },
        ],
      },
    };

    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { pathname: '/0' },
      });
    });

    it('renders warning when code has X in third position', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '12X45678',
                yrEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.textContent).to.include(
        "This facility code can't be accepted",
      );
      expect(alert.textContent).to.include('WEAMS 22-1998 Report');
    });

    it('does not render warning when code is not in branches or extensions', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '99999999',
                yrEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render when code is in branches', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                yrEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render when code is in extensions', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '33333333',
                yrEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render warning for second array item when code has no disqualifying conditions', () => {
      window.location.pathname = '/1';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '11111111',
                yrEligible: true,
                isLoading: false,
              },
              {
                facilityCode: '88888888',
                yrEligible: true,
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('does not render when institution is not found', () => {
      window.location.pathname = '/0';
      const state = {
        form: {
          data: {
            institutionDetails: mainInstitution,
            additionalInstitutionDetails: [
              {
                facilityCode: '12345678',
                institutionName: 'not found',
                isLoading: false,
              },
            ],
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'additionalInstitutionDetails',
          isArrayItem: true,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });
  });

  describe('edge cases', () => {
    it('handles missing formData gracefully', () => {
      const state = {
        form: {
          data: {},
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('handles missing form state gracefully', () => {
      const state = {};
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });

    it('handles empty facility code', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '',
              yrEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.not.exist;
    });
  });

  describe('alert attributes', () => {
    it('renders with correct alert attributes', () => {
      const state = {
        form: {
          data: {
            institutionDetails: {
              facilityCode: '12X45678',
              yrEligible: false,
              isLoading: false,
            },
          },
        },
      };
      store = mockStore(state);

      const uiSchema = {
        'ui:options': {
          dataPath: 'institutionDetails',
          isArrayItem: false,
        },
      };

      const { container } = render(
        <Provider store={store}>
          <WarningBanner uiSchema={uiSchema} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('error');
      expect(alert.hasAttribute('visible')).to.be.true;
      expect(alert.hasAttribute('background-only')).to.be.true;
      expect(alert.getAttribute('className')).to.equal('vads-u-margin-top--2');
    });
  });
});
