import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import sinon from 'sinon';
import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import CategoryInput from '../../../components/ComposeForm/CategoryInput';
import { Paths, ErrorMessages } from '../../../util/constants';
import { Categories } from '../../../util/inputContants';

describe('CategoryInput component', () => {
  const initialState = {
    sm: {},
  };

  it('renders without errors', () => {
    const screen = renderWithStoreAndRouter(
      <CategoryInput categories={categories} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    expect(screen);
  });

  it('should contain va select dropdown component', () => {
    const screen = renderWithStoreAndRouter(
      <CategoryInput categories={categories} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const categorySelect = screen.getByTestId('compose-message-categories');
    expect(categorySelect).not.to.be.empty;
  });

  it('should contain all category options', async () => {
    const screen = renderWithStoreAndRouter(
      <CategoryInput categories={categories} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const values = await screen
      .getAllByTestId('compose-category-dropdown-select')
      ?.map(el => el.value);
    expect(values).to.be.not.empty;
    expect(values).deep.equal(categories);
  });

  it('should have correct name attribute on select element', async () => {
    const screen = renderWithStoreAndRouter(
      <CategoryInput categories={categories} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const selectElement = screen.getByTestId('compose-message-categories');

    expect(selectElement).to.have.attribute(
      'name',
      'compose-message-categories',
    );
  });

  it('should have category selected when category prop is present', async () => {
    const selectedCategory = Categories.OTHER.value;
    const screen = await renderWithStoreAndRouter(
      <CategoryInput category={selectedCategory} categories={categories} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const selectElement = screen.getByTestId('compose-message-categories');

    expect(selectElement).to.have.attribute('value', selectedCategory);
  });

  it('should display an error when error prop is present', async () => {
    const categoryError = ErrorMessages.ComposeForm.CATEGORY_REQUIRED;
    const screen = await renderWithStoreAndRouter(
      <CategoryInput categoryError={categoryError} categories={categories} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const vaSelect = screen.getByTestId('compose-message-categories');
    expect(vaSelect).to.have.attribute('error', categoryError);
  });

  it('should call setCategory when a selection is made', async () => {
    const setCategory = sinon.spy();
    const setCategoryError = sinon.spy();
    const setUnsavedNavigationError = sinon.spy();

    const screen = renderWithStoreAndRouter(
      <CategoryInput
        categories={categories}
        setCategory={setCategory}
        setCategoryError={setCategoryError}
        setUnsavedNavigationError={setUnsavedNavigationError}
      />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );

    const selectElement = screen.getByTestId('compose-message-categories');

    // Simulate selection event
    const event = new CustomEvent('vaSelect', {
      detail: { value: 'COVID' },
    });

    selectElement.dispatchEvent(event);

    expect(setCategory.calledWith('COVID')).to.be.true;
    expect(setUnsavedNavigationError.called).to.be.true;
  });
});
