// Regex Breakdown
// SSN: \b(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}\b
// EMAIL: [A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}
// PHONE: (\+\d{1,2}\s)?\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b
const regExp = /(\b(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}\b)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})|(\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b)/gim;
export default function piiReplace(message) {
  if (message.match(regExp)) {
    return message.replace(regExp, '****');
  }
  return message;
}
