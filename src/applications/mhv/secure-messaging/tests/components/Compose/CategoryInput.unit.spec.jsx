import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import categories from '../../fixtures/categories-response.json';
import reducer from '../../../reducers';
import CategoryInput from '../../../components/ComposeForm/CategoryInput';
import { Paths, ErrorMessages } from '../../../util/constants';
import { RadioCategories } from '../../../util/inputContants';

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

  it('should have category checked when category prop is present', async () => {
    const selectedCategory = RadioCategories.OTHER.value;
    await renderWithStoreAndRouter(
      <CategoryInput category={selectedCategory} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const selectedRadioOption = document.querySelector(
      `va-radio-option[label="${RadioCategories.OTHER.label}: ${
        RadioCategories.OTHER.description
      }"]`,
    );

    const uncheckedCategories = document.querySelectorAll(
      'va-radio-option[checked="false"]',
    );

    expect(selectedRadioOption).to.have.attribute('checked', 'true');
    expect(uncheckedCategories).to.have.lengthOf(categories.length - 1);
  });

  it('should display an error when error prop is present', async () => {
    const categoryError = ErrorMessages.ComposeForm.CATEGORY_REQUIRED;
    const screen = await renderWithStoreAndRouter(
      <CategoryInput categoryError={categoryError} />,
      {
        initialState,
        reducers: reducer,
        path: Paths.COMPOSE,
      },
    );
    const vaRadio = screen.getByTestId('compose-message-categories');
    expect(vaRadio).to.have.attribute('error', categoryError);
  });
});
