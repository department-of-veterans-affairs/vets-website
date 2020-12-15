import React from 'react';
import ReactDOM from 'react-dom';

// import { fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { expect } from 'chai';

import environment from 'platform/utilities/environment';
import { resetFetch } from 'platform/testing/unit/helpers';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import reducer from '../../reducers';

import FormContainer, { Form } from '../../components/Form';

describe('<Form/>', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Form
        formState={null}
        updateFormData={() => {}}
        router={{}}
        isLoggedIn={false}
        profile={{}}
      />,
      div,
    );
  });

  it('renders a form', async () => {
    const initialState = {
      user: {
        profile: {},
        login: {
          currentlyLoggedIn: false,
        },
      },
      coronavirusVaccinationApp: {
        formState: null,
      },
    };

    const screen = renderInReduxProvider(<FormContainer />, {
      initialState,
      reducers: reducer,
    });

    screen.getByText('Fill out the form below');
    screen.getByLabelText('Social Security number (SSN)');
    screen.getByLabelText('Last name', { exact: false });
    screen.getByLabelText('First name', { exact: false });
    screen.getByText('Date of birth');
    screen.getByLabelText('Email', { exact: false });
    screen.getByLabelText('Zip code', { exact: false });
    screen.getByText(
      'Do you plan to get a COVID-19 vaccine when one is available to you?',
      { exact: false },
    );
  });
});

describe('<Form/> prefills -> by old form data', () => {
  let server = null;

  before(() => {
    resetFetch();
    server = setupServer(
      rest.get(
        `${environment.API_URL}/covid_vaccine/v0/registration`,
        (req, res, ctx) => {
          return res(
            ctx.json({
              data: {
                id: 'FA82BF279B8673EDF2160765628666653290',
                type: 'covid_vaccine_v0_registration_submissions',
                attributes: {
                  createdAt: '2020-12-11T03:11:26.770Z',
                  vaccineInterest: 'Yes',
                  zipCode: '97214',
                  zipCodeDetails: null,
                  phone: '650-555-1212',
                  email: 'foo@bar.com',
                  firstName: 'Sean',
                  lastName: 'Gptestkfive',
                  birthDate: '1972-03-21',
                },
              },
            }),
          );
        },
      ),
    );

    server.listen();
  });

  after(() => {
    server.close();
  });

  it('prefills using old form data', async () => {
    const initialState = {
      user: {
        profile: {
          loa: {
            current: 3,
            highest: 3,
          },
        },
        login: {
          currentlyLoggedIn: true,
        },
      },
      coronavirusVaccinationApp: {
        formState: null,
      },
    };

    const screen = renderInReduxProvider(<FormContainer />, {
      initialState,
      reducers: reducer,
    });

    const firstName = await screen.findByLabelText('First name', {
      exact: false,
    });
    const lastName = await screen.findByLabelText('Last name', {
      exact: false,
    });

    expect(firstName.value).to.be.equal('Sean');
    expect(lastName.value).to.be.equal('Gptestkfive');
  });
});

describe('<Form/> prefills -> profile data ', () => {
  let server = null;

  before(() => {
    resetFetch();
    server = setupServer(
      rest.get(
        `${environment.API_URL}/covid_vaccine/v0/registration`,
        (req, res, ctx) => {
          return res(ctx.status('404'));
        },
      ),
    );
  });

  after(() => {
    server.close();
  });

  it('prefills from profile data', async () => {
    const doTest = async loa => {
      const initialState = {
        user: {
          profile: {
            userFullName: {
              first: 'Jim',
              last: 'Testing',
            },
            loa: {
              current: loa,
              highest: 3,
            },
          },
          login: {
            currentlyLoggedIn: true,
          },
        },
        coronavirusVaccinationApp: {
          formState: null,
        },
      };

      const screen = renderInReduxProvider(<FormContainer />, {
        initialState,
        reducers: reducer,
      });

      const firstName = await screen.findByLabelText('First name', {
        exact: false,
      });
      const lastName = await screen.findByLabelText('Last name', {
        exact: false,
      });

      expect(firstName.value).to.be.equal('Jim');
      expect(lastName.value).to.be.equal('Testing');
    };

    // Test LOA1 users where a request for a prev form is NOT sent
    await doTest(1);

    // Test LOA3 users where a request for a prev form is sent but finds nothing.
    await doTest(3);
  });
});
