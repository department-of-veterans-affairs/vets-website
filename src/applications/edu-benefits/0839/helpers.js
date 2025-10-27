export const validateInitials = (inputValue, firstName, lastName) => {
  if (!inputValue || inputValue.length === 0) {
    return '';
  }

  const lettersOnlyPattern = /^[A-Za-z]+$/;
  if (!lettersOnlyPattern.test(inputValue)) {
    return 'Please enter your initials using letters only';
  }

  let lastName2;

  const hyphenIndex = lastName.indexOf('-');
  if (hyphenIndex !== -1) {
    lastName2 = lastName.substring(hyphenIndex + 1);
  }

  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const lastInitial2 = lastName2?.charAt(0).toUpperCase();

  const inputFirst = inputValue.charAt(0);
  const inputSecond = inputValue.charAt(1);

  if (inputFirst !== firstInitial || inputSecond !== lastInitial) {
    return `Initials must match your name: ${firstName} ${lastName}`;
  }

  if (inputValue.length === 3) {
    const inputThird = inputValue.charAt(2);

    if (inputThird !== lastInitial2) {
      return `Initials must match your name: ${firstName} ${lastName}`;
    }
  }

  return '';
};
export const getAcademicYearDisplay = () => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${currentYear + 1}`;
};
