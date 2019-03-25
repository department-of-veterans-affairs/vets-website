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
    event.addProp('DTSTAMP', new Date(`${start} UTC`), { VALUE: 'DATE-TIME' });
    event.addProp('DTSTART', new Date(`${start} UTC`), { VALUE: 'DATE-TIME' });
    event.addProp('DTEND', new Date(`${end} UTC`), { VALUE: 'DATE-TIME' });
    cal.addComponent(event);
    const calLink = cal.toString();

    // Download the ics.
    function calDown(e) {
      window.open(`data:text/calendar;charset=utf8,${calLink}`);
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
