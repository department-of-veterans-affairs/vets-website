const createPathFromTitle = title => title.toLowerCase().replace(/ /g, '-');
const TITLES = Object.freeze({
  demographics: 'Veteran Information',
  reasonForVisit: 'Prepare for Your Appointment',
});
export { createPathFromTitle, TITLES };
