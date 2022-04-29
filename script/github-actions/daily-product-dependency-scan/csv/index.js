class Csv {
  constructor({ headings, rows }) {
    this.headings = headings;
    this.rows = rows;
  }

  generateOutput() {
    return [this.headings.all.join(','), ...this.rows.all].join('\n');
  }
}

module.exports = Csv;
