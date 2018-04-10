import { apiRequest } from '../utils/helpers';

export function loadPrescription(id) {
  return dispatch => {
    const urls = [`/${id}`, `/${id}/trackings`];
    const errorHandler =
      () => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE' });

    dispatch({ type: 'LOADING_DETAIL' });

    // Fetch both the prescription and its tracking history and
    // wait for retrieval and read of both resources to resolve.
    Promise.all(urls.map(
      url => apiRequest(url, null, response => response, errorHandler)
    ))
      .then(data => dispatch({
        type: 'LOAD_PRESCRIPTION_SUCCESS',
        data: {
          rx: data[0].data,
          trackings: data[1].data
        }
      }))
      .catch(errorHandler);
  };
}

export function loadPrescriptions() {
  return ({
    type: 'LOAD_PRESCRIPTIONS_SUCCESS',
    active: true,
    data: JSON.parse(`
      {
      "data": [
        {
          "id": "14522559",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14522559,
            "prescriptionNumber": "2719725",
            "prescriptionName": "AMINOPHYLLINE 100 MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2018-08-08T18:58:02.000Z",
            "refillDate": "2018-08-08T04:00:00.000Z",
            "refillRemaining": 10,
            "facilityName": "DAYT29",
            "orderedDate": "2017-07-21T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-07-22T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14522559"
          }
        },
        {
          "id": "14555692",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14555692,
            "prescriptionNumber": "2719734",
            "prescriptionName": "CARBAMAZEPINE (TEGRETOL) 200MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-09-06T19:17:23.000Z",
            "refillDate": "2017-09-06T04:00:00.000Z",
            "refillRemaining": 10,
            "facilityName": "DAYT29",
            "orderedDate": "2017-08-14T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-08-15T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14555692"
          }
        },
        {
          "id": "14522553",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14522553,
            "prescriptionNumber": "2719719",
            "prescriptionName": "CORTISONE ACETATE 25MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-08-08T18:58:02.000Z",
            "refillDate": "2017-08-08T04:00:00.000Z",
            "refillRemaining": 9,
            "facilityName": "DAYT29",
            "orderedDate": "2017-07-19T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-07-20T04:00:00.000Z",
            "dispensedDate": "2017-08-02T04:00:00.000Z",
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14522553"
          }
        },
        {
          "id": "14555695",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14555695,
            "prescriptionNumber": "2719737",
            "prescriptionName": "DORZOLAMIDE/TIMOLOL 0.5% OPH SOLN 10ML",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-09-06T19:17:23.000Z",
            "refillDate": "2017-09-06T04:00:00.000Z",
            "refillRemaining": 10,
            "facilityName": "DAYT29",
            "orderedDate": "2017-08-14T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-08-15T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14555695"
          }
        },
        {
          "id": "14522558",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14522558,
            "prescriptionNumber": "2719724",
            "prescriptionName": "ERLOTINIB 150MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-08-08T18:58:02.000Z",
            "refillDate": "2017-08-08T04:00:00.000Z",
            "refillRemaining": 10,
            "facilityName": "DAYT29",
            "orderedDate": "2017-07-21T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-07-22T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14522558"
          }
        },
        {
          "id": "14555693",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14555693,
            "prescriptionNumber": "2719735",
            "prescriptionName": "ETHAMBUTOL HCL 400MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-09-06T19:17:23.000Z",
            "refillDate": "2017-09-06T04:00:00.000Z",
            "refillRemaining": 10,
            "facilityName": "DAYT29",
            "orderedDate": "2017-08-14T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-08-15T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14555693"
          }
        },
        {
          "id": "14245953",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14245953,
            "prescriptionNumber": "2719708",
            "prescriptionName": "FORMOTEROL FUMARATE 12MCG INHL CAP",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-06-13T16:17:21.000Z",
            "refillDate": "2017-06-13T04:00:00.000Z",
            "refillRemaining": 10,
            "facilityName": "DAYT29",
            "orderedDate": "2017-05-02T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-05-03T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14245953"
          }
        },
        {
          "id": "14522557",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14522557,
            "prescriptionNumber": "2719723",
            "prescriptionName": "IMIPRAMINE HCL 25MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-09-06T19:17:23.000Z",
            "refillDate": "2017-09-06T04:00:00.000Z",
            "refillRemaining": 10,
            "facilityName": "DAYT29",
            "orderedDate": "2017-07-21T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-07-22T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14522557"
          }
        },
        {
          "id": "14522556",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14522556,
            "prescriptionNumber": "2719722",
            "prescriptionName": "METOLAZONE 2.5MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-08-08T18:58:02.000Z",
            "refillDate": "2017-08-08T04:00:00.000Z",
            "refillRemaining": 9,
            "facilityName": "DAYT29",
            "orderedDate": "2017-07-19T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-07-20T04:00:00.000Z",
            "dispensedDate": "2017-08-02T04:00:00.000Z",
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14522556"
          }
        },
        {
          "id": "14522552",
          "type": "prescriptions",
          "attributes": {
            "prescriptionId": 14522552,
            "prescriptionNumber": "2719718",
            "prescriptionName": "METOLAZONE 5MG TAB",
            "refillStatus": "refillinprocess",
            "refillSubmitDate": "2017-10-10T20:09:26.000Z",
            "refillDate": "2017-10-10T04:00:00.000Z",
            "refillRemaining": 9,
            "facilityName": "DAYT29",
            "orderedDate": "2017-07-20T04:00:00.000Z",
            "quantity": 10,
            "expirationDate": "2018-07-21T04:00:00.000Z",
            "dispensedDate": null,
            "stationNumber": "989",
            "isRefillable": false,
            "isTrackable": false
          },
          "links": {
            "self": "https://staging-api.vets.gov/v0/prescriptions/14522552"
          }
        }
      ],
      "links": {
        "self": "https://staging-api.vets.gov/v0/prescriptions/active?sort=prescription_name",
        "first": "https://staging-api.vets.gov/v0/prescriptions/active?page=1&per_page=10&sort=prescription_name",
        "prev": null,
        "next": "https://staging-api.vets.gov/v0/prescriptions/active?page=2&per_page=10&sort=prescription_name",
        "last": "https://staging-api.vets.gov/v0/prescriptions/active?page=2&per_page=10&sort=prescription_name"
      },
      "meta": {
        "updatedAt": "Thu, 08 Mar 2018 15:34:59 EST",
        "failedStationList": "",
        "sort": {
          "prescriptionName": "ASC"
        },
        "pagination": {
          "currentPage": 1,
          "perPage": 10,
          "totalPages": 2,
          "totalEntries": 15
        }
      }
    }
`)
  });
}

export function refillPrescription(prescription) {
  if (prescription.prescriptionId) {
    const url = `/${prescription.prescriptionId}/refill`;

    window.dataLayer.push({
      event: 'rx-confirm-refill',
    });

    return dispatch => {
      dispatch({ type: 'REFILL_SUBMITTED' });

      apiRequest(
        url,
        { method: 'PATCH' },
        () => dispatch({
          type: 'REFILL_SUCCESS',
          prescription
        }),
        response => dispatch({
          type: 'REFILL_FAILURE',
          errors: response.errors,
          prescription
        })
      );
    };
  }

  return { type: 'REFILL_FAILURE' };
}

export function sortPrescriptions(sort, order = 'ASC') {
  return { type: 'SORT_PRESCRIPTIONS', sort, order };
}
