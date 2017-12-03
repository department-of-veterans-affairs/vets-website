export const keyMap = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40
};

export function getSelection(options, queryType) {
  /* eslint-disable no-param-reassign */
  let selection = options[0];
  if (queryType) {
    const selectionType = queryType;
    options = options.filter(item => !!item);
    selection = options.reduce((acc, elem) => {
      if (elem.id && elem.id === selectionType) acc = elem;
      return acc;
    }, selection);
  }
  return { selection, id: options.indexOf(selection) };
  /* eslint-enable no-param-reassign */
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

export function isToggle(keyEvent, isActive) {
  const { keyCode: code } = keyEvent;
  const toggles = [keyMap.ENTER, keyMap.SPACE];
  const shouldOpen = !isActive && code === keyMap.DOWN;
  const shouldClose = isActive && [keyMap.ESCAPE, keyMap.TAB].includes(code);
  const result = toggles.includes(code) || shouldClose || shouldOpen;
  if (result) {
    keyEvent.preventDefault();
  }
  return result;
}

export function shouldToggle(keyEvent, isActive) {
  const toggle = isToggle(keyEvent);
  let result;
  if (toggle && !isActive) result = 'open';
  if (toggle && isActive) result = 'close';
  return result;
}

export function pluralize(string) {
  const plural = string.slice(-1) === 'y' ? `${string.slice(0, -1)}ies` : `${string}s`;
  return plural;
}

export function getOtherType(type) {
  const alternatives = new Map([['facility', 'service'], ['service', 'facility']]);
  return alternatives.get(type);
}

export function noServices(type, facilityType) {
  return !['benefits', 'vet_center'].includes(facilityType);
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
