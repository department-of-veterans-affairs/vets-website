import prescriptions from '../tests/fixtures/presciptions.json';

export const mockGetPrescriptionList = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(prescriptions);
    }, 1000);
  });
};

export const mockGetPrescription = id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const prescription = prescriptions.find(rx => rx.id === +id);
      resolve(prescription);
    }, 1000);
  });
};
