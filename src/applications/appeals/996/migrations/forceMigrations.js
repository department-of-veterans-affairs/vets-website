import { forceV2Migration } from './01-lighthouse-v2-updates';
import { forceRepPhoneFix } from './02-rep-phone-fix';

export default formData =>
  [forceV2Migration, forceRepPhoneFix].reduce(
    (result, migration) => migration(result),
    formData,
  );
