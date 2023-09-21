const selectEmergencyContacts = state =>
  state?.associatedPersons?.emergencyContacts || false;

export { selectEmergencyContacts };
