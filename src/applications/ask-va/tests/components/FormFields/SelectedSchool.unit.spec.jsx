import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SelectedSchool from '../../../components/FormFields/SelectedSchool';

const mockStore = configureStore([]);

describe('SelectedSchool Component', () => {
  let store;

  const renderComponent = school => {
    store = mockStore({
      form: {
        data: {
          school,
        },
      },
    });

    return render(
      <Provider store={store}>
        <SelectedSchool />
      </Provider>,
    );
  };

  it('should render with a valid school', () => {
    const { getByText } = renderComponent('Sample School');

    expect(getByText('Sample School')).to.exist;
  });

  it('should render undefined if school is undefined', () => {
    const { container } = renderComponent(undefined);

    const spanElement = container.querySelector('span.vads-u-margin-left--2p5');
    expect(spanElement).to.exist;
    expect(spanElement.textContent).to.eq('undefined');
  });
});
