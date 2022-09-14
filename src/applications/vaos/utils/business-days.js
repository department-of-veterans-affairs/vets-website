import moment from 'moment';

const Saturday = 6;
const Sunday = 0;

moment.fn.addBusinessDay = function addBusinessDay(number) {
  if (!this.isValid()) {
    return this;
  }

  this.add(number, 'days');

  if (this.day() === Saturday) this.add(2, 'days');
  if (this.day() === Sunday) this.add(1, 'days');

  return this;
};

moment.fn.addBusinessMonth = function addBusinessMonth(number) {
  if (!this.isValid()) {
    return this;
  }

  this.add(number, 'month').startOf('month');
  if (this.day() === 6) this.add(2, 'days');
  if (this.day() === 0) this.add(1, 'days');

  return this;
};

export default moment;
