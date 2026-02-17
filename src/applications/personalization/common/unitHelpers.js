import { isFunction } from 'lodash';

export { renderHook } from '@testing-library/react-hooks';

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
