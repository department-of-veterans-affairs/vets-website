import ReactTestUtils from 'react-dom/test-utils';

// simulate v1 forms library input change
export const simulateInputChange = (formDOM, querySelectorElement, value) => {
  return ReactTestUtils.Simulate.change(
    formDOM.querySelector(querySelectorElement),
    {
      target: {
        value,
      },
    },
  );
};
