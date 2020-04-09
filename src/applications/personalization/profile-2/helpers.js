import moment from 'moment';

const asyncReturn = (returnValue, delay = 300) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(returnValue);
    }, delay);
  });

export const asyncFetchMilitaryInformation = () =>
  asyncReturn({
    serviceHistory: [
      { branchOfService: 'Army', beginDate: moment(), endDate: moment() },
      {
        branchOfService: 'Air Force',
        beginDate: moment(),
        endDate: moment(),
      },
      {
        branchOfService: 'Marine Corps',
        beginDate: moment(),
        endDate: moment(),
      },
      {
        branchOfService: 'Air Force',
        beginDate: moment(),
        endDate: moment(),
      },
    ],
  });
