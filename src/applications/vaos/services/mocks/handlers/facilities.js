/* eslint-disable camelcase */
const facilitiesV2 = require('../v2/facilities.json');
const recentLocations = require('../v2/recent_locations.json');

const responses = {
  'GET /vaos/v2/facilities': (req, res) => {
    const { ids } = req.query;
    const { children } = req.query;
    const { sort_by } = req.query;

    if (sort_by === 'recentLocations') {
      return res.json({
        data: recentLocations?.data.filter(
          facility =>
            ids.includes(facility?.id) ||
            (children === 'true' &&
              ids?.some(id => facility?.id.startsWith(id))),
        ),
      });
    }

    return res.json({
      data: facilitiesV2.data.filter(
        facility =>
          ids.includes(facility.id) ||
          (children === 'true' && ids.some(id => facility.id.startsWith(id))),
      ),
    });
  },
  'GET /vaos/v2/facilities/:id': (req, res) => {
    return res.json({
      data: facilitiesV2.data.find(facility => facility.id === req.params.id),
    });
  },
};
module.exports = responses;
