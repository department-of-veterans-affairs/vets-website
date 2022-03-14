import 'platform/polyfills';
import './styles.scss';

// necessary styles for the search dropdown component
import './components/SearchDropdown/SearchDropdownStyles.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});
