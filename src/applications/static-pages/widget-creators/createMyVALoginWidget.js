import { isLoggedIn } from 'platform/user/selectors';
import { getAppUrl } from 'platform/utilities/registry-helpers';

const dashboardUrl = getAppUrl('dashboard');

export default function createMyVALoginWidget(store) {
  const root = document.getElementById('myva-login');
  let unsubscribe;
  const homePageStoreListener = () => {
    if (root && isLoggedIn(store.getState())) {
      root.innerHTML = `<a href="${dashboardUrl}" class="homepage-button">
        <div class="icon-wrapper"><i class="fas fa-user-circle homepage-button-icon"></i></div>
        <div class="button-inner"><span>Go to your personalized “My VA” page</span></div>
      </a>`;
      unsubscribe();
    }
  };
  unsubscribe = store.subscribe(homePageStoreListener);
}
