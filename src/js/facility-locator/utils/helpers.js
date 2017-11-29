export const keyMap = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40
};

export function getSelection(options, currentQuery, key) {
  let selection = options[0];
  if (currentQuery[key]) {
    const selectionType = currentQuery[key];
    selection = options.reduce((acc, elem) => {
      if (elem.id && elem.id === selectionType) acc = elem; // eslint-disable-line no-param-reassign
      return acc;
    }, selection);
  }
  return { selection, id: options.indexOf(selection) };
}

export function getDirection(code) {
  if (code === keyMap.UP) return -1;
  if (code === keyMap.DOWN) return 1;
  return false;
}

export function isSpace(code) {
  return code === keyMap.SPACE;
}

export function isSelect(code) {
  return code === keyMap.ENTER;
}

export function isTraverse(code) {
  return code === keyMap.UP || code === keyMap.DOWN;
}

export function isEscape(code) {
  const result = code === keyMap.ESCAPE || code === keyMap.TAB;
  if (code === keyMap.ESCAPE) event.preventDefault();
  return result;
}

export function isToggle(keyEvent) {
  const { keyCode: code } = keyEvent;
  const result = code === keyMap.ENTER || code === keyMap.SPACE;
  // To prevent unwanted scrolling and interaction with other elements
  if (result) {
    keyEvent.preventDefault();
    keyEvent.stopPropagation();
  }
  return result;
}

export function shouldToggle(keyEvent, isActive) {
  const { keyCode: code } = keyEvent;
  const toggle = isToggle(keyEvent);
  const shouldOpen = isTraverse(code) || toggle;
  const shouldClose = isEscape(code) || toggle;
  if (shouldOpen && !isActive) return 'open';
  if (shouldClose && isActive) return 'close';
  return false;
}

