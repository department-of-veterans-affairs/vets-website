export const keyMap = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40
};

export function getDirection(code) {
  if (code === keyMap.UP) return -1;
  if (code === keyMap.DOWN) return 1;
  return false;
}

export function getSelection(options, queryType) {
  let selection = options[0];
  if (queryType) {
    const selectionType = queryType;
    selection = options.reduce((acc, elem) => {
      if (elem.id && elem.id === selectionType) acc = elem; // eslint-disable-line no-param-reassign
      return acc;
    }, selection);
  }
  return { selection, id: options.indexOf(selection) };
}

export function isSelect(code) {
  return code === keyMap.ENTER || code === keyMap.SPACE;
}

export function isTraverse(keyEvent) {
  const { keyCode: code } = keyEvent;
  const result = code === keyMap.UP || code === keyMap.DOWN;
  if (result) keyEvent.preventDefault();
  return result;
}

export function isEscape(keyEvent) {
  const { keyCode: code } = keyEvent;
  const result = code === keyMap.ESCAPE || code === keyMap.TAB;
  if (code === keyMap.ESCAPE) keyEvent.preventDefault();
  return result;
}

export function isToggle(keyEvent, isActive) {
  const { keyCode: code } = keyEvent;
  const toggles = [keyMap.ENTER, keyMap.SPACE];
  const isToggleKey = toggles.includes(code);
  const shouldOpen = !isActive && code === keyMap.DOWN;
  const shouldClose = isActive && isEscape(keyEvent);
  const result = isToggleKey || shouldClose || shouldOpen;
  if (isToggleKey) {
    keyEvent.preventDefault();
  }
  return result;
}

export function noServices(type, facilityType) {
  return type === 'service' && !['benefits', 'vet_center'].includes(facilityType);
}

export function getServices(facilityType, benefitsServices, vetCenterServices) {
  let services;
  switch (facilityType) {
    case 'benefits':
      services = Object.keys(benefitsServices);
      break;
    case 'vet_center':
      services = ['All', ...vetCenterServices];
      break;
    default:
      return null;
  }
  return services;
}
