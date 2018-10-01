import { isLoggedIn } from '../../platform/user/selectors';

export default function createMyVALoginWidget(store) {
  const root = document.getElementById('myva-login');
  let unsubscribe;
  const homePageStoreListener = () => {
    if (root && isLoggedIn(store.getState())) {
      root.innerHTML = '<a href="/dashboard" class="homepage-button primary-darker">' +
        '<div class="icon-wrapper">' +
        '<i class="fa fa-user-circle-o homepage-button-icon-sign-in"></i>' +
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
