import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DefinitionTester } from '~/platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('22-10297 Enter your full name page', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.identificationChapter.pages.applicantFullName;

  const initialState = {
    user: {
      profile: {
        dob: '1990-01-01',
        userFullName: {
          first: 'John',
          middle: 'A',
          last: 'Doe',
          suffix: '',
        },
        ssn: '123456789',
      },
    },
    form: {
      data: {},
    },
  };

  it('should render alert if age is over 62', () => {
    const testStore = mockStore({
      ...initialState,
      user: {
        ...initialState.user,
        profile: {
          ...initialState.user.profile,
          dob: '1950-01-01',
        },
      },
    });
    const { getByText } = render(
      <Provider store={testStore}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          data={{ dateOfBirth: '1950-01-01' }}
          definitions={formConfig.defaultDefinitions}
        />
      </Provider>,
    );
    expect(getByText(/You may not qualify/i)).to.exist;
  });
});
