const getName = organization => {
  return organization?.name ? organization.name : null;
};

const getPhoneNumber = (
  organization,
  options = { separateExtension: false },
) => {
  if (!organization) {
    return null;
  }
  const { telecom } = organization;
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

const getId = organization => {
  return organization?.id ? organization.id : null;
};

const getFacilityIdentifier = organization => {
  if (!organization) {
    return null;
  }

  const { identifier } = organization;
  if (!identifier?.length) {
    return null;
  }
  const fid = identifier.find(
    f =>
      f.system ===
      'https://api.va.gov/services/fhir/v0/r4/NamingSystem/va-facility-identifier',
  );

  return fid?.value ? fid.value : null;
};
export { getId, getName, getPhoneNumber, getFacilityIdentifier };
