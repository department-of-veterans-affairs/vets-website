import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import VaMedicalCenter from '../../../components/FormFields/VaMedicalCenter';

describe('hca <VaMedicalCenter>', () => {
  const apiRequestWithUrl = `${environment.API_URL}/v1/facilities/va`;
  let server = null;

  describe('when the form is not in review mode', () => {
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            'view:preferredFacility': {},
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const props = {
      formContext: { reviewMode: false, submitted: undefined },
      id: 'preferredFacility_vaMedicalFacility',
      onChange: () => {},
      required: true,
      value: undefined,
    };

    describe('when the component renders', () => {
      it('should render the input with empty option', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        const selectors = {
          input: container.querySelector(
            '#preferredFacility_vaMedicalFacility',
          ),
          options: container.querySelectorAll('option'),
        };
        expect(selectors.input).to.exist;
        expect(selectors.options).to.have.lengthOf(1);
        expect(selectors.options[0]).to.have.attr('value', '');
      });

      it('should not render the review mode facility name container', () => {
        const { container } = render(
          <Provider store={mockStore}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        const selector = container.querySelector(
          '[data-testid="hca-facility-name"]',
        );
        expect(selector).to.not.exist;
      });
    });

    describe('when the user has selected a facility state', () => {
      before(() => {
        server = setupServer(
          rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
            return res(
              ctx.json({
                data: [
                  {
                    id: 'vha_528A4',
                    attributes: {
                      name: 'Batavia VA Medical Center',
                    },
                  },
                  {
                    id: 'vha_528A5',
                    attributes: {
                      name: 'Canandaigua VA Medical Center',
                    },
                  },
                ],
              }),
            );
          }),
        );

        server.listen();
      });
      afterEach(() => server.resetHandlers());
      after(() => {
        server.close();
      });

      const store = {
        ...mockStore,
        getState: () => ({
          form: {
            data: {
              'view:preferredFacility': { 'view:facilityState': 'NY' },
            },
          },
        }),
      };

      it('should render the correct number of options', async () => {
        const { container } = render(
          <Provider store={store}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        const selector = container.querySelectorAll('option');
        waitFor(() => {
          expect(selector[0]).to.contain.text('');
          expect(selector[1]).to.contain.text('Batavia VA Medical Center');
          expect(selector[2]).to.contain.text('Canandaigua VA Medical Center');
        });
      });
    });

    describe('when the API server has an error', () => {
      before(() => {
        server = setupServer(
          rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
            return res(
              ctx.status(500),
              ctx.json({
                status: 500,
                error: 'Internal Server Error',
                exception: {},
              }),
            );
          }),
        );
        server.listen();
      });
      afterEach(() => server.resetHandlers());
      after(() => server.close());

      it('should render a server error alert', async () => {
        const { container } = render(
          <Provider store={mockStore}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        const selector = container.querySelector('va-alert');
        waitFor(() => {
          expect(selector).to.exist;
          expect(selector).to.contain.text('Something went wrong on our end');
        });
      });

      it('should not render the loading indicator', async () => {
        const { container } = render(
          <Provider store={mockStore}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        const selector = container.querySelector('va-loading-indicator');
        waitFor(() => {
          expect(selector).to.not.exist;
        });
      });

      it('should not render the select input', async () => {
        const { container } = render(
          <Provider store={mockStore}>
            <VaMedicalCenter {...props} />
          </Provider>,
        );
        const selector = container.querySelector('va-select');
        waitFor(() => {
          expect(selector).to.not.exist;
        });
      });
    });
  });

  describe('when the form is in review mode', () => {
    const mockStore = {
      getState: () => ({
        form: {
          data: {
            'view:preferredFacility': { 'view:facilityState': 'NY' },
          },
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };
    const props = {
      formContext: { reviewMode: true, submitted: undefined },
      id: 'preferredFacility_vaMedicalFacility',
      onChange: () => {},
      required: true,
      value: '528A5',
    };

    it('should render the correct facility name', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector(
        '[data-testid="hca-facility-name"]',
      );
      waitFor(() => {
        expect(selector).to.contain.text('Canandaigua VA Medical Center');
      });
    });

    it('should not render the loading indicator', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-loading-indicator');
      waitFor(() => {
        expect(selector).to.not.exist;
      });
    });

    it('should not render the select input', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-select');
      waitFor(() => {
        expect(selector).to.not.exist;
      });
    });

    it('should not render the server error alert', async () => {
      const { container } = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );
      const selector = container.querySelector('va-alert');
      waitFor(() => {
        expect(selector).to.not.exist;
      });
    });
  });
});
