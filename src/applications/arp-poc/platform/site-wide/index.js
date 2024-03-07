import startHeader from '@department-of-veterans-affairs/platform-site-wide/header';
import startUserNavWidget from './user-nav';

export default function startSitewideComponents(commonStore) {
  startUserNavWidget(commonStore);
  startHeader(commonStore); // This includes the `VeteranCrisisLine` component.
}
