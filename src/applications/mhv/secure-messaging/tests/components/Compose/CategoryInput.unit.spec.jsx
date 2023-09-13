import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import CategoryInput from '../../../components/ComposeForm/CategoryInput';
import { Paths } from '../../../util/constants';

describe('CategoryInput component', () => {
  const initialState = {
    sm: {
      categories: { categories },
    },
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(<CategoryInput />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });
    expect(screen);
  });

  it('should contain va radio button component', () => {
    const screen = renderWithStoreAndRouter(<CategoryInput />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });
    const categoryRadioInputs = screen.getByTestId(
      'compose-message-categories',
    );
    expect(categoryRadioInputs).not.to.be.empty;
  });

  it('should contain all category options', async () => {
    const screen = renderWithStoreAndRouter(<CategoryInput />, {
      initialState,
      reducers: reducer,
      path: Paths.COMPOSE,
    });
    const values = await screen
      .getAllByTestId('compose-category-radio-button')
      ?.map(el => el.value);
    expect(values).to.be.not.empty;
    expect(values).deep.equal(categories);
  });
});
