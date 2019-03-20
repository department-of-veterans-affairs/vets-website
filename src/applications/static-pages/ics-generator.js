import * as ICS from 'ics-js';

export function icsCreate() {
  const cal = new ICS.VCALENDAR();
  const event = new ICS.VEVENT();

  let start;
  let end;
  let location;
  let description;

  if (document.getElementById('starttime')) {
    start = document.getElementById('starttime').value;
  }
  if (document.getElementById('endtime')) {
    end = document.getElementById('endtime').value;
  }
  if (document.getElementById('location')) {
    location = document.getElementById('location').value;
  }
  if (document.getElementById('description')) {
    description = document.getElementById('description').value;
  }

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

  if (document.getElementById('add-to-calendar-link')) {
    const clicker = document.getElementById('add-to-calendar-link');
    clicker.addEventListener('click', calDown);
  }
}

document.addEventListener('DOMContentLoaded', icsCreate);
