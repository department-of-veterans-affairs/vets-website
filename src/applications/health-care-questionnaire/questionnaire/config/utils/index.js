const createPathFromTitle = title => title.toLowerCase().replace(/ /g, '-');
const TITLES = Object.freeze({
  demographics: 'Veteran information',
  reasonForVisit: 'Prepare for your appointment',
});
export { createPathFromTitle, TITLES };
