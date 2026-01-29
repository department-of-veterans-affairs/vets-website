import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';

/**
 * Custom renderHook utility for testing React hooks
 * @param {function} renderCallback - The hook to test
 * @param {Object} options - Options including initialProps and wrapper
 * @returns {Object} - { result, rerender, unmount }
 */
export function renderHook(renderCallback, options = {}) {
  const { initialProps, ...renderOptions } = options;
  const result = React.createRef();
  result.current = null;

  function TestComponent({ renderCallbackProps }) {
    const hookResult = renderCallback(renderCallbackProps);
    result.current = hookResult;

    React.useEffect(() => {
      result.current = hookResult;
    });

    return null;
  }

  TestComponent.propTypes = {
    renderCallbackProps: PropTypes.any,
  };

  const { rerender: baseRerender, unmount } = render(
    <TestComponent renderCallbackProps={initialProps} />,
    renderOptions,
  );

  function rerender(rerenderCallbackProps) {
    return baseRerender(
      <TestComponent renderCallbackProps={rerenderCallbackProps} />,
    );
  }

  return { result, rerender, unmount };
}
