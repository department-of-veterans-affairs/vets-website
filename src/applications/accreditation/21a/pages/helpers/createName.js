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
  } else {
    baseName = fallback;
  }

  if (isPossessive) {
    return baseName.endsWith('s') ? `${baseName}'` : `${baseName}'s`;
  }

  return baseName;
};
