# Comparison Tool

*Note:* This application is not part of the form system and is a custom application with VA.gov.


The comparison tool is populated by data that is uploaded through the [GI Bill Comparison Tool Dashboard
](https://va.gov/gids/).

Vets-website makes calls to [vets-api](https://github.com/department-of-veterans-affairs/vets-api) which then makes 
calls to [gibct-data-service](https://github.com/department-of-veterans-affairs/gibct-data-service) 

## Vets-api
Vets-website makes REST calls to vets-api below are the controllers and configuration that handles those calls.

- [V0 Controllers](https://github.com/department-of-veterans-affairs/vets-api/tree/master/app/controllers/v0/gids)
- [V1 Controllers](https://github.com/department-of-veterans-affairs/vets-api/tree/master/app/controllers/v1/gids)
- [Redis](https://github.com/department-of-veterans-affairs/vets-api/blob/master/app/models/gids_redis.rb)
- [Clients and configuration](https://github.com/department-of-veterans-affairs/vets-api/tree/master/lib/gi)


## Gibct-data-service
This service receives the calls from vets-api and returns data that was uploaded through its dashboard.

The institutions datatable is the main set of data.  This data is constructed from uploaded CSVs with Weams being the 
primary source of institution data.

- [V0 Controllers](https://github.com/department-of-veterans-affairs/gibct-data-service/tree/master/app/controllers/v0/)
- [V1 Controllers](https://github.com/department-of-veterans-affairs/gibct-data-service/tree/master/app/controllers/v1/)
- [Sample data](https://github.com/department-of-veterans-affairs/gibct-data-service/tree/master/sample_csvs)
