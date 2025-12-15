import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import YellowRibbonProgramDescription from '../../components/YellowRibbonProgramDescription';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      form: (
        state = initialState.form || {
          data: { institutionDetails: { isUsaSchool: true } },
        },
      ) => state,
    },
    preloadedState: initialState,
  });
};

describe('YellowRibbonProgramDescription', () => {
  const renderWithProvider = (component, initialState = {}) => {
    const store = createMockStore(initialState);
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('should render for US schools', () => {
    const initialState = {
      form: {
        data: {
          institutionDetails: {
            isUsaSchool: true,
          },
        },
      },
    };

    const { container } = renderWithProvider(
      <YellowRibbonProgramDescription />,
      initialState,
    );
    expect($('[data-testid="us-school-text"]', container)).to.exist;
    expect($('[data-testid="foreign-school-text"]', container)).to.not.exist;
  });

  it('should render for foreign schools', () => {
    const initialState = {
      form: {
        data: {
          institutionDetails: {
            isUsaSchool: false,
          },
        },
      },
    };

    const { container } = renderWithProvider(
      <YellowRibbonProgramDescription />,
      initialState,
    );
    expect($('[data-testid="us-school-text"]', container)).to.not.exist;
    expect($('[data-testid="foreign-school-text"]', container)).to.exist;
  });
});
