export function icsCreate(calendarLink) {
  import(/* webpackChunkName: "ics-js" */ 'ics-js').then(ICS => {
    const cal = new ICS.VCALENDAR();
    const event = new ICS.VEVENT();
    const addToCalendarLink = document.getElementById('add-to-calendar-link');
    const start = addToCalendarLink.getAttribute('data-start');
    const end = addToCalendarLink.getAttribute('data-end');
    const location = addToCalendarLink.getAttribute('data-location');
    const description = addToCalendarLink.getAttribute('data-description');

    cal.addProp('VERSION', 2);
    cal.addProp('PRODID', 'VA');
    event.addProp('UID');
    event.addProp('SUMMARY', [description]);
    event.addProp('LOCATION', [location]);
    event.addProp('DTSTAMP', start);
    event.addProp('DTSTART', start);
    event.addProp('DTEND', end);
    cal.addComponent(event);
    const calLink = cal.toString();
    const calURI = encodeURI(calLink);

    // Download the ics.
    function calDown(e) {
      window.open(`data:text/calendar;charset=utf8,${calURI}`);
      e.preventDefault();
    }

    calendarLink.addEventListener('click', calDown);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const calendarLink = document.getElementById('add-to-calendar-link');
  if (calendarLink) {
    icsCreate(calendarLink);
  }
});
