import createLoginWidget from '../login/login-entry';
import createCommonStore from './store';

export function renderCommonComponents(commonStore) {
  createLoginWidget(commonStore);
}

export default function initCommon(reducer) {
  const commonStore = createCommonStore(reducer);
  renderCommonComponents(commonStore);
  return commonStore;
}
