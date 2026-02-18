import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import YellowRibbonProgramTitle from '../../components/YellowRibbonProgramTitle';

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
      <YellowRibbonProgramTitle text="Tell us about your Yellow Ribbon Program contributions" />,
      initialState,
    );
    expect($('.yellow-ribbon-title', container)).to.include.text(
      'Tell us about your Yellow Ribbon Program contributions (U.S. schools)',
    );
    expect($('.yellow-ribbon-title', container)).to.not.include.text(
      'foreign schools',
    );
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
      <YellowRibbonProgramTitle text="Tell us about your Yellow Ribbon Program contributions" />,
      initialState,
    );
    expect($('.yellow-ribbon-title', container)).to.not.include.text(
      'U.S. schools',
    );
    expect($('.yellow-ribbon-title', container)).to.include.text(
      'foreign schools',
    );
  });
});
