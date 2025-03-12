import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import YourSchool from '../../../components/FormFields/YourSchool';

const mockStore = configureStore([]);

describe('YourSchool Component', () => {
  let store;

  const renderComponent = schoolInfo => {
    store = mockStore({
      form: {
        data: {
          schoolInfo,
        },
      },
    });

    return render(
      <Provider store={store}>
        <YourSchool />
      </Provider>,
    );
  };

  it('should render with school data', () => {
    const school = {
      schoolFacilityCode: '12345',
      schoolName: 'Test School',
    };

    const { getByText } = renderComponent(school);

    expect(getByText('12345 - Test School')).to.exist;
  });
});
