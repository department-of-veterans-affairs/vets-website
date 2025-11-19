import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PrivateMedicalProvidersConditions from '../../../components/confirmationFields/PrivateMedicalProvidersConditions';

const mockStore = configureStore([]);

describe('PrivateMedicalProvidersConditions', () => {
  it('should return formatted conditions data when matching disabilities exist', () => {
    const formData = {
      backcondition: true,
      kneecondition: true,
      none: false,
    };

    const store = mockStore({
      form: {
        data: {
          newDisabilities: [
            { condition: 'back condition' },
            { condition: 'knee condition' },
            { condition: 'shoulder condition' },
          ],
        },
      },
    });

    let result;
    // Wrap in Provider to give component access to Redux store
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    expect(result.data).to.deep.equal(['Back Condition', 'Knee Condition']);
    expect(result.label).to.equal('What conditions were you treated for?');
  });

  it('should filter out "none" key from conditions', () => {
    const formData = {
      backcondition: true,
      none: false,
    };

    const store = mockStore({
      form: {
        data: {
          newDisabilities: [{ condition: 'back condition' }],
        },
      },
    });

    let result;
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    expect(result.data).to.deep.equal(['Back Condition']);
  });

  it('should return empty array when no conditions are selected', () => {
    const formData = {
      none: false,
    };

    const store = mockStore({
      form: {
        data: {
          newDisabilities: [
            { condition: 'back condition' },
            { condition: 'knee condition' },
          ],
        },
      },
    });

    let result;
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    expect(result.data).to.deep.equal([]);
  });

  it('should handle empty formData', () => {
    const formData = null;

    const store = mockStore({
      form: {
        data: {
          newDisabilities: [{ condition: 'back condition' }],
        },
      },
    });

    let result;
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    expect(result.data).to.deep.equal([]);
  });

  it('should handle missing newDisabilities in Redux state', () => {
    const formData = {
      backcondition: true,
    };

    const store = mockStore({
      form: {
        data: {},
      },
    });

    let result;
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    expect(result.data).to.deep.equal([]);
  });

  it('should only include conditions that match sippableId', () => {
    const formData = {
      backcondition: true,
      kneecondition: true,
    };

    const store = mockStore({
      form: {
        data: {
          newDisabilities: [
            { condition: 'back condition' },
            { condition: 'knee-condition' },
            { condition: 'shoulder condition' },
          ],
        },
      },
    });

    let result;
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    // sippableId removes non-word characters, so 'knee-condition' becomes 'kneecondition'
    // capitalizeEachWord capitalizes each word (after spaces and hyphens)
    expect(result.data).to.deep.equal(['Back Condition', 'Knee-Condition']);
  });

  it('should capitalize each word in condition names', () => {
    const formData = {
      posttraumaticstressdisorderptsd: true,
    };

    const store = mockStore({
      form: {
        data: {
          newDisabilities: [
            { condition: 'post traumatic stress disorder (PTSD)' },
          ],
        },
      },
    });

    let result;
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    // capitalizeEachWord only capitalizes first letter, preserving existing capitalization
    expect(result.data).to.deep.equal([
      'Post Traumatic Stress Disorder (PTSD)',
    ]);
  });

  it('should handle conditions with false values', () => {
    const formData = {
      backcondition: true,
      kneecondition: false,
      shouldercondition: true,
    };

    const store = mockStore({
      form: {
        data: {
          newDisabilities: [
            { condition: 'back condition' },
            { condition: 'knee condition' },
            { condition: 'shoulder condition' },
          ],
        },
      },
    });

    let result;
    const TestWrapper = () => {
      result = PrivateMedicalProvidersConditions({ formData });
      return null;
    };

    render(
      <Provider store={store}>
        <TestWrapper />
      </Provider>,
    );

    expect(result.data).to.deep.equal(['Back Condition', 'Shoulder Condition']);
  });
});
