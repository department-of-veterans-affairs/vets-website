/**
 *
 *
 * @export
 * @class MockCommunityCareProvider
 */
export default class MockCommunityCareProvider {
  /**
   * Creates an instance of MockCommunityCareProvider.
   * @param {Object} props
   * @param {MockAppointment} props.address
   * @memberof MockCommunityCareProvider
   */
  constructor({ address }) {
    this.address = address;
    this.telecom = [
      {
        system: 'phone',
        value: '123-456-7890',
      },
    ];
    this.providers = [];
    this.providerName = ['Test User'];
    this.treatmentSpecialty = 'Optometrist';
  }

  setAddress(value) {
    this.address = value;
    return this;
  }

  setTelecom(value) {
    this.telecom = [{ system: 'phone', value }];
    return this;
  }

  setProviders(values) {
    this.providers = values;
    return this;
  }

  setProviderName(value) {
    this.providerName = value;
    return this;
  }

  setTreatmentSpecialty(value) {
    this.treatmentSpecialty = value;
    return this;
  }
}
