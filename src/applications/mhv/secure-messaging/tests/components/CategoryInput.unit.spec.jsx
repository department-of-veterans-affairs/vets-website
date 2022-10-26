import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { expect } from 'chai';
import reducer from '../../reducers';
import CategoryInput from '../../components/ComposeForm/CategoryInput';
import { categories } from '../fixtures/compose-categories.json';

describe('CategoryInput component', () => {
  const initialState = { sm: { categories: { categories } } };
  let screen = null;
  beforeEach(() => {
    screen = renderInReduxProvider(<CategoryInput />, {
      initialState,
      reducers: reducer,
    });
  });

  it('should render without errors', () => {
    expect(screen.getByTestId('compose-message-categories')).not.to.be.empty;
  });

  it('should contain all category options', async () => {
    const values = screen
      .getAllByTestId('compose-category-radio-button')
      ?.map(el => el.value);
    expect(values).to.be.not.empty;
    expect(values).deep.equal(categories);
  });
});
