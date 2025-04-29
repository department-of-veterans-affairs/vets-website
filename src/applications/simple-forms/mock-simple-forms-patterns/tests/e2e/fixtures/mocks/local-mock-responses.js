const user = require('./user.json');
const mockSubmit = require('./form-submit.json');

const responses = {
  'OPTIONS /v0/maintenance_windows': 'OK',
  'GET /v0/maintenance_windows': { data: [] },
  'GET /v0/user': user,
  'POST /simple_forms_api/v1/simple_forms': mockSubmit,
};

module.exports = responses;
