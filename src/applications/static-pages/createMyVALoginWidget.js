import { isLoggedIn } from '../../platform/user/selectors';

export default function createMyVALoginWidget(store) {
  const root = document.getElementById('myva-login');
  let unsubscribe;
  const homePageStoreListener = () => {
    if (root && isLoggedIn(store.getState())) {
      root.innerHTML = '<button class="homepage-button primary-darker">' +
        '<a href="/dashboard">' +
        '<div class="icon-wrapper">' +
        '<i class="fa fa-user-circle"></i>' +
        '</div>' +
        '<div class="button-inner">' +
        '<p>Go to your personalized “My VA” page</p>' +
        '</div>' +
        '</a>';
      unsubscribe();
    }
  };
  unsubscribe = store.subscribe(homePageStoreListener);
}
