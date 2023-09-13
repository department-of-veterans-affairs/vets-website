import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import VaMedicalCenter from '../../../components/FormFields/VaMedicalCenter';

describe('CG <VaMedicalCenter>', () => {
  const apiRequestWithUrl = `${environment.API_URL}/v1/facilities/va`;

  describe('when the api server succeeds', () => {
    let server = null;

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

    it('should render as an empty select element', () => {
      const mockStore = {
        getState: () => ({
          form: {
            data: {
              veteranPreferredFacility: { veteranFacilityState: undefined },
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

      const view = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      expect(view.container.querySelector('va-select')).to.exist;
      expect(
        view.container.querySelector('#preferredFacility_vaMedicalFacility'),
      ).to.exist;
      expect(view.container.querySelector('option[value=""]')).to.exist;
    });

    it('should render a select element with options to select', async () => {
      const mockStore = {
        getState: () => ({
          form: {
            data: {
              veteranPreferredFacility: { veteranFacilityState: 'NY' },
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

      const view = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      await waitFor(() => {
        expect(view.container.querySelectorAll('option')[0]).to.contain.text(
          '',
        );
        expect(view.container.querySelectorAll('option')[1]).to.contain.text(
          'Batavia VA Medical Center',
        );
        expect(view.container.querySelectorAll('option')[2]).to.contain.text(
          'Canandaigua VA Medical Center',
        );
      });
    });

    it('should render a facility name in review mode', async () => {
      const mockStore = {
        getState: () => ({
          form: {
            data: {
              veteranPreferredFacility: { veteranFacilityState: 'NY' },
            },
          },
        }),
        subscribe: () => {},
        dispatch: () => {},
      };
      let props = {
        formContext: { reviewMode: false, submitted: undefined },
        id: 'preferredFacility_vaMedicalFacility',
        onChange: () => {},
        required: true,
        value: '',
      };

      const view = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      props = {
        ...props,
        formContext: { reviewMode: true, submitted: undefined },
        value: '528A5',
      };

      view.rerender(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      await waitFor(() => {
        expect(
          view.container.querySelector(
            '[data-testid="cg-facility-reviewmode"]',
          ),
        ).to.contain.text('Canandaigua VA Medical Center');
      });
    });
  });

  describe('when the api server has an error', () => {
    const error500 = {
      status: 500,
      error: 'Internal Server Error',
      exception: {},
    };
    let server = null;

    before(() => {
      server = setupServer(
        rest.get(`${apiRequestWithUrl}`, (req, res, ctx) => {
          return res(ctx.status(500), ctx.json(error500));
        }),
      );

      server.listen();
    });

    after(() => {
      server.close();
    });

    it('should render the error alert', async () => {
      const mockStore = {
        getState: () => ({
          form: {
            data: {
              veteranPreferredFacility: { veteranFacilityState: 'NY' },
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

      const view = render(
        <Provider store={mockStore}>
          <VaMedicalCenter {...props} />
        </Provider>,
      );

      await waitFor(() => {
        expect(view.container.querySelector('va-alert')).to.contain.text(
          'Something went wrong on our end',
        );
      });
    });
  });
});
