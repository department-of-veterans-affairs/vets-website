export const keyMap = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40
};

export function getSelection(options, queryType) {
  console.log('getting selection');
  console.log('options');
  console.log(options);
  /* eslint-disable no-param-reassign */
  let selection = options[0];
  if (queryType) {
    console.log('inside has queryType', queryType);
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
