import React from 'react';
import { isFunction } from 'lodash';
import { render } from '@testing-library/react';

export function renderHook(renderCallback, options = {}) {
  const { initialProps, ...renderOptions } = options;
  const result = React.createRef();

  function TestComponent({ renderCallbackProps }) {
    const pendingResult = renderCallback(renderCallbackProps);

    React.useEffect(() => {
      result.current = pendingResult;
    });

    return null;
  }

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

export const getVaButtonByText = (text, view) => {
  return view.container.querySelector(`va-button[text="${text}"]`);
};

export const getVaLinkByText = (text, view) => {
  return view.container.querySelector(`va-link[text="${text}"]`);
};

export const reduceActions = arg1 => arg2 => {
  const actions = isFunction(arg1) ? arg2 : arg1;
  const reducer = actions === arg1 ? arg2 : arg1;
  return actions.reduce((acc, cur, i) => [...acc, reducer(acc[i], cur)], [
    reducer(undefined, { type: '@@empty' }),
  ]);
};
