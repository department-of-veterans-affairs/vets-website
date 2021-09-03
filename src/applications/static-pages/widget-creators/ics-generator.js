export default function icsCreate() {
  const calendarLink = document.getElementById('add-to-calendar-link');

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

  if (calendarLink) {
    import(/* webpackChunkName: "ics-js" */ 'ics-js').then(ICS => {
      const cal = new ICS.VCALENDAR();
      const event = new ICS.VEVENT();
      const addToCalendarLink = document.getElementById('add-to-calendar-link');
      const startSecondsString = addToCalendarLink.getAttribute('data-start');
      const startMS = parseInt(startSecondsString, 10) * 1000;
      const startDateObj = new Date(startMS);
      const endSecondsString = addToCalendarLink.getAttribute('data-end');
      const endMS = parseInt(endSecondsString, 10) * 1000;
      const endDateObj = new Date(endMS);
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

      function calDown(e) {
        // window.open(`data:text/calendar;charset=utf8,${calURI}`);
        const filename = `${title}.ics`;
        download(filename, calLink);
        e.preventDefault();
      }

      calendarLink.addEventListener('click', calDown);
    });
  }
}
