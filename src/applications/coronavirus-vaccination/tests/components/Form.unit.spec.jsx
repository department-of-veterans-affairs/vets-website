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

    screen.getByText('Fill out the form below to sign up');
    screen.getByLabelText('Social Security number (SSN)');
    screen.getByLabelText('Last name', { exact: false });
    screen.getByLabelText('First name', { exact: false });
    screen.getByText('Date of birth', { exact: false });
    screen.getByLabelText('Email', { exact: false });
    screen.getByLabelText('Zip code', { exact: false });
    screen.getByText(
      'Will you be in this zip code for the next 6 to 12 months?',
      { exact: false },
    );
    screen.getByText(
      'Are you interested in getting a COVID-19 vaccine at VA?',
      { exact: false },
    );
  });

  it('prefills a form from a previous submission', async () => {
    resetFetch();

    const server = setupServer(
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

    await screen.findByText(
      'you provided the information below on December 10, 2020',
      { exact: false },
    );

    const firstName = await screen.findByLabelText('First name', {
      exact: false,
    });
    const lastName = await screen.findByLabelText('Last name', {
      exact: false,
    });

    expect(firstName.value).to.be.equal('Sean');
    expect(lastName.value).to.be.equal('Gptestkfive');

    server.close();
  });
});
