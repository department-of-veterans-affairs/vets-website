export function icsCreate(calendarLink) {
  import(/* webpackChunkName: "ics-js" */ 'ics-js').then(ICS => {
    const cal = new ICS.VCALENDAR();
    const event = new ICS.VEVENT();
    const addToCalendarLink = document.getElementById('add-to-calendar-link');
    const start = addToCalendarLink.getAttribute('data-start');
    const startDateObj = new Date(start);
    const end = addToCalendarLink.getAttribute('data-end');
    const endDateObj = new Date(end);
    const location = addToCalendarLink.getAttribute('data-location');
    const description = addToCalendarLink.getAttribute('data-description');
    const title = addToCalendarLink.getAttribute('data-subject');

    cal.addProp('VERSION', 2);
    cal.addProp('PRODID', 'VA');
    event.addProp('UID');
    event.addProp('SUMMARY', [title]);
    event.addProp('DESCRIPTION', [description]);
    event.addProp('LOCATION', [location]);
    event.addProp('DTSTAMP', startDateObj);
    event.addProp('DTSTART', startDateObj);
    event.addProp('DTEND', endDateObj);
    cal.addComponent(event);
    const calLink = cal.toString();

    // Download the ics.
    function download(filename, text) {
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        `data:text/calendar;charset=utf8,${encodeURIComponent(text)}`,
      );
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    function calDown(e) {
      // window.open(`data:text/calendar;charset=utf8,${calURI}`);
      const filename = `${title}.ics`;
      download(filename, calLink);
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
