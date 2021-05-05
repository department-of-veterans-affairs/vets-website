const getType = (clinic, options = { titleCase: false }) => {
  if (!clinic) {
    return null;
  }
  const { titleCase } = options;
  const { type } = clinic;
  if (!type || !type.length) {
    return null;
  }

  const { coding } = type[0];
  if (!coding || !coding.length) {
    return null;
  }

  const { display } = coding[0];

  if (!display) {
    return null;
  }

  return titleCase
    ? display.charAt(0).toUpperCase() + display.slice(1).toLowerCase()
    : display;
};

const getName = location => {
  return location?.name ? location.name : null;
};

const getPhoneNumber = (location, options = { separateExtension: false }) => {
  if (!location) {
    return null;
  }
  const { telecom } = location;
  if (!telecom || !telecom.length) {
    return null;
  }
  const rv = {};
  const phone = telecom.find(com => com.system === 'phone');
  if (!phone?.value) {
    return null;
  }
  if (options.separateExtension) {
    // value(pin):"254-743-2867 x0002"
    const numbers = phone.value.split('x');
    rv.number = numbers[0].trim();
    rv.extension = numbers[1] ? `x${numbers[1]?.trim()}` : '';
  } else {
    rv.number = phone?.value ? phone.value : null;
  }
  return rv;
};
export { getType, getName, getPhoneNumber };
