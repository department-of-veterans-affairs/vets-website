export const getPhoneString = (phone = {}) =>
  `${phone?.areaCode || ''}${phone?.phoneNumber || ''}`;

const hashRegex = /#/g;
const phonePattern = '(###) ###-####';
export const getFormattedPhone = phone => {
  const fullString = getPhoneString(phone);
  if (fullString.length === 10) {
    let i = 0;
    return phonePattern.replace(hashRegex, () => fullString[i++] || '');
  }
  return fullString;
};
