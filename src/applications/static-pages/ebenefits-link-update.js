import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import { shouldUseProxyUrl } from 'platform/site-wide/ebenefits/selectors';
import { proxyUrl, defaultUrl } from 'platform/site-wide/ebenefits/utilities';

export default function createMyVALoginWidget(store) {
  let unsubscribe;
  const updateEbenefitsLinks = () => {

    const state = store.getState();
    const isLoggedIn = isLoggedInSelector(state);
    const useProxyUrl = shouldUseProxyUrl(state);

    if (isLoggedIn && useProxyUrl) {

      const ebenefitsLinks = [
        ...document.querySelectorAll('a[href^="https://ebenefits.va.gov'),
      ];

      ebenefitsLinks.forEach(anchor => {
        const url = props.useProxyUrl ? proxyUrl : defaultUrl;
        const { href } = anchor;
        // modeled after <Ebenefits/>
      });

      unsubscribe();
    }
  };
  unsubscribe = store.subscribe(updateEbenefitsLinks);
}
