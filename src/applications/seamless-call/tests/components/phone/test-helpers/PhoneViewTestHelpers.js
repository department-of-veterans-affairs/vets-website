export const getMuteButton = view => view.getByTestId('mute-button');

export const queryMuteButton = view => view.queryByTestId('mute-button');

export const getE2eEncryptedNotice = view =>
  view.getByText('End-to-end encrypted');

export const getShowKeypadButton = view =>
  view.getByTestId('show-keypad-button');

export const queryShowKeypadButton = view =>
  view.queryByTestId('show-keypad-button');

export const getHideKeypadButton = view =>
  view.getByTestId('hide-keypad-button');

export const queryHideKeypadButton = view =>
  view.queryByTestId('hide-keypad-button');

const getKey = (view, text) => view.getByTestId(`key-${text}`);

export const getKey1 = view => getKey(view, '1');

export const getKey2 = view => getKey(view, '2');

export const getKey3 = view => getKey(view, '3');

export const getKey4 = view => getKey(view, '4');

export const getKey5 = view => getKey(view, '5');

export const getKey6 = view => getKey(view, '6');

export const getKey7 = view => getKey(view, '7');

export const getKey8 = view => getKey(view, '8');

export const getKey9 = view => getKey(view, '9');

export const getKey0 = view => getKey(view, '0');

export const getStarKey = view => getKey(view, '*');

export const getHashKey = view => getKey(view, '#');

export const getKeypadPresses = (view, keypadPresses) =>
  view.getByText(keypadPresses);
