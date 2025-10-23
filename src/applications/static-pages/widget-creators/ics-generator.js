export const icsCreate = selector => {
  const calendarLinks = document.querySelectorAll(selector);

  // Download the ics.
  const download = (filename, text) => {
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
  };

  if (calendarLinks.length) {
    const setupCalEvent = (ICS, $calLink) => {
      let calLinkHref = '';
      const cal = new ICS.VCALENDAR();
      const event = new ICS.VEVENT();
      const startSecondsString = $calLink.getAttribute('data-start');
      const startMS = parseInt(startSecondsString, 10) * 1000;
      const startDateObj = new Date(startMS);
      const endSecondsString = $calLink.getAttribute('data-end');
      const endMS = parseInt(endSecondsString, 10) * 1000;
      const endDateObj = new Date(endMS);
      const location = $calLink.getAttribute('data-location');
      const description = $calLink.getAttribute('data-description');
      const title = $calLink.getAttribute('data-subject');

      // Set up the calendar event.
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
      calLinkHref = cal.toString();

      function downloadCalEvent(e) {
        // window.open(`data:text/calendar;charset=utf8,${calURI}`);
        const filename = `${title}.ics`;
        download(filename, calLinkHref);
        e.preventDefault();
      }

      $calLink.addEventListener('click', downloadCalEvent);
    };

    import(/* webpackChunkName: "ics-js" */ 'ics-js').then(ICS =>
      calendarLinks.forEach($calLink => setupCalEvent(ICS, $calLink)),
    );
  }
};
