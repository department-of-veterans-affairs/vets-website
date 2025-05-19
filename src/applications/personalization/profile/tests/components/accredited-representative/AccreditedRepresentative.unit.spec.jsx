import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import AccreditedRepresentative from '../../../components/accredited-representative/AccreditedRepresentative';

describe('<AccreditedRepresentative />', () => {
  const oldLocation = global.window.location;
  const server = setupServer();

  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    global.window.location = oldLocation;
    server.close();
  });

  it('should render representative-related content when powerOfAttorney exists', async () => {
    global.window.location = new URL(
      'https://dev.va.gov/profile/accredited-representative',
    );

    server.use(
      rest.get(
        `https://dev-api.va.gov/representation_management/v0/power_of_attorney`,
        (req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              data: {
                id: '074',
                type: 'veteran_service_organizations',
                attributes: {
                  addressLine1: '1608 K St NW',
                  addressLine2: null,
                  addressLine3: null,
                  addressType: 'Domestic',
                  city: 'Washington',
                  countryName: 'United States',
                  countryCodeIso3: 'USA',
                  province: 'District Of Columbia',
                  internationalPostalCode: null,
                  stateCode: 'DC',
                  zipCode: '20006',
                  zipSuffix: '2801',
                  phone: '202-861-2700',
                  type: 'organization',
                  name: 'American Legion',
                  email: 'sample@test.com',
                },
              },
            }),
          ),
      ),
    );

    const { queryByText, container } = renderInReduxProvider(
      <AccreditedRepresentative />,
      {
        initialState: {
          user: {
            profile: {
              loa: { current: 3 },
              services: ['lighthouse', 'hca'],
            },
            vaProfile: { powerOfAttorney: { id: 'some-id' } },
          },
        },
      },
    );

    expect(queryByText(/Accredited Representative or VSO/)).to.not.be.null;

    await waitFor(() => {
      expect(
        container.querySelector('[data-widget-type="representative-status"]'),
      ).to.exist;
    });
  });

  it('should render no representative-related content when powerOfAttorney does not exist', async () => {
    const { queryByText, container } = renderInReduxProvider(
      <AccreditedRepresentative />,
      {
        initialState: {
          user: { profile: { loa: { current: 3 } } },
          vaProfile: { powerOfAttorney: { data: null } },
        },
      },
    );

    expect(queryByText(/Accredited Representative or VSO/)).to.not.be.null;

    await waitFor(() => {
      expect(queryByText(/You don’t have an accredited representative/i)).to
        .exist;
      expect(
        container.querySelector('[data-widget-type="representative-status"]'),
      ).to.exist;

      const link = container.querySelector('va-link');
      expect(
        link
          .getAttribute('href')
          ?.includes(`/resources/va-accredited-representative-faqs/`),
      ).to.be.true;
    });
  });

  it('should call repStatusLoader when there is a representative', async () => {
    const repStatusLoaderSpy = sinon.spy(
      require('platform/user/widgets/representative-status'),
      'default',
    );

    renderInReduxProvider(<AccreditedRepresentative />, {
      initialState: {
        vaProfile: {
          powerOfAttorney: { id: 'representative-id' },
        },
      },
    });

    expect(repStatusLoaderSpy.calledOnce).to.be.true;
    repStatusLoaderSpy.restore();
  });
});
