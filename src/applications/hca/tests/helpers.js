import ReactTestUtils from 'react-dom/test-utils';

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
