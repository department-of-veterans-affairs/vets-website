import { getProviderName } from '../../utils/appointment';
import Appointment from './Appointment';

export default class AppointmentCC extends Appointment {
  constructor(data) {
    super(data);

    // this.communityCareProvider= getCommunityCareProviderObject(appt),
    const providers = data.practitioners;

    this.practiceName = data.extension?.ccLocation?.practiceName;
    this.treatmentSpecialty = data.extension?.ccTreatingSpecialty;
    this.address = data.extension?.ccLocation?.address;
    this.telecom = data.extension?.ccLocation?.telecom;
    this.providers = (providers || []).map(provider => ({
      name: {
        firstName: provider.name?.given.join(' '),
        lastName: provider.name?.family,
      },
      providerName: provider.name
        ? `${provider.name.given.join(' ')} ${provider.name.family}`
        : null,
    }));
    this.providerName = providers !== undefined ? getProviderName(data) : null;
  }
}
