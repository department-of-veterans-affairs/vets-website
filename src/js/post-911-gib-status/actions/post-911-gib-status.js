// TODO: remove this hard-coded response once we can fetch from a vets-api endpoint
const chapter33EnrollmentResponse = {
  chapter33EducationInfo: {
    dateOfBirth: '1977-10-01T04:00:00.000+0000',
    firstName: 'Jean',
    lastName: 'Picard',
    regionalProcessingOffice: 'Central Office Washington, DC',
    vaFileNumber: '301010301',
    enrollmentList: [
      {
        beginDate: '2012-11-01T04:00:00.000+0000',
        endDate: '2012-12-01T05:00:00.000+0000',
        facilityCode: '11902614',
        facilityName: 'PURDUE UNIVERSITY',
        fullTimeHours: 12,
        intervalChoice: 'NO_RESTRICTIONS',
        participantId: '11170323',
        trainingType: 'UnderGrad',
        vacationDayCount: 0
      },
      {
        beginDate: '2012-08-01T04:00:00.000+0000',
        endDate: '2012-10-01T04:00:00.000+0000',
        facilityCode: '11902614',
        facilityName: 'PURDUE UNIVERSITY',
        fullTimeHours: 12,
        intervalChoice: 'NO_RESTRICTIONS',
        participantId: '11170323',
        trainingType: 'UnderGrad',
        vacationDayCount: 0
      },
      {
        beginDate: '2013-01-01T05:00:00.000+0000',
        endDate: '2013-02-01T05:00:00.000+0000',
        facilityCode: '11902614',
        facilityName: 'PURDUE UNIVERSITY',
        fullTimeHours: 12,
        intervalChoice: 'NO_RESTRICTIONS',
        participantId: '11170323',
        trainingType: 'UnderGrad',
        vacationDayCount: 0
      },
      {
        beginDate: '2013-04-01T04:00:00.000+0000',
        endDate: '2013-05-01T04:00:00.000+0000',
        facilityCode: '25047343',
        facilityName: 'COSMETOLOGY CAREER INSTITUTE',
        fullTimeHours: 22,
        participantId: '11180666',
        trainingType: 'NonCollege'
      }
    ]
  }
};

export function getEnrollmentData() {
  return (dispatch) => {
    return dispatch({
      type: 'GET_ENROLLMENT_DATA_SUCCESS',
      data: chapter33EnrollmentResponse.chapter33EducationInfo
    });
    /*
    apiRequest('/v0/post_911_gib_status/enrollment',
               null,
      (response) => {
        return dispatch({
          type: 'GET_ENROLLMENT_DATA_SUCCESS',
          data: response.data,
        });
      },
      () => dispatch({
        type: 'GET_ENROLLMENT_DATA_FAILURE'
      })
    );
    */
  };
}
