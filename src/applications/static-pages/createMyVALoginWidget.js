import { isLoggedIn } from '../../platform/user/selectors';
import { rootUrl } from '../../applications/personalization/dashboard/manifest.js';

export default function createMyVALoginWidget(store) {
  const root = document.getElementById('myva-login');
  let unsubscribe;
  const homePageStoreListener = () => {
    if (root && isLoggedIn(store.getState())) {
      root.innerHTML =
        `<a href="${rootUrl}" class="homepage-button">` +
        '<div class="icon-wrapper">' +
        '<i class="fa fa-user-circle-o homepage-button-icon"></i>' +
        '</div>' +
        '<div class="button-inner">' +
        '<span>Go to your personalized “My VA” page</span>' +
        '</div>' +
        '</a>';
      unsubscribe();
    }
  };
  unsubscribe = store.subscribe(homePageStoreListener);
}
