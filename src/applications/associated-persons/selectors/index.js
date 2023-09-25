const selectEmergencyContacts = state =>
  state?.associatedPersons?.emergencyContacts || false;

const selectNextOfKin = state => state?.associatedPersons?.nextOfKin || false;

export { selectEmergencyContacts, selectNextOfKin };
