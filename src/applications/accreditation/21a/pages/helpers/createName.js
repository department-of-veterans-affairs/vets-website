const makePossessive = name => {
  return name.endsWith('s') ? `${name}'` : `${name}'s`;
};

export const createName = ({
  firstName,
  lastName,
  suffix,
  fallback,
  isPossessive = true,
}) => {
  let baseName;

  if (firstName && lastName) {
    baseName = `${firstName} ${lastName}${suffix ? `, ${suffix}` : ''}`;
  } else if (firstName) {
    baseName = firstName;
  } else {
    baseName = fallback;
  }

  if (isPossessive) {
    return makePossessive(baseName);
  }

  return baseName;
};
