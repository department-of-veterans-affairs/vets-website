export const keyMap = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  UP: 38,
  DOWN: 40
};

export function getFacility(options, currentQuery) {
  let selection = options[0];
  if (currentQuery.facilityType) {
    const { facilityType } = currentQuery;
    selection = options.filter(elem => elem.id && elem.id === facilityType);
  }
  return selection;
}

export function getService(options, currentQuery) {
  let selection = options[0];
  if (currentQuery.serviceType) {
    const { serviceType } = currentQuery;
    selection = options.filter(elem => elem.id && elem.id === serviceType);
  }
  return selection;
}

export function getDirection(code) {
  if (code === keyMap.UP) return -1;
  if (code === keyMap.DOWN) return 1;
  return false;
}

export function isTraverse(code) {
  return code === keyMap.UP || code === keyMap.DOWN;
}

export function isEscape(code) {
  return code === keyMap.ESCAPE || code === keyMap.TAB;
}

export function isToggle(code) {
  return code === keyMap.ENTER;
}

export function resetMenus(facilityMenuOpen, serviceMenuOpen) {
  const result = [];
  if (facilityMenuOpen) {
    result.push('facility');
  }
  if (serviceMenuOpen) {
    result.push('service');
  }
  return result;
}

export function shouldToggle(code, isActive) {
  const toggle = isToggle(code);
  const shouldOpen = isTraverse(code) || toggle;
  const shouldClose = isEscape(code) || toggle;
  if (shouldOpen && !isActive) return 'open';
  if (shouldClose && isActive) return 'close';
  return false;
}

export function isSelect(code) {
  return code === keyMap.ENTER;
}

