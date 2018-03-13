import claimsAppeals from '../../claims-status/reducers';
import prescriptions from '../../rx/reducers';

export default {
  ...claimsAppeals,
  ...prescriptions,
};
