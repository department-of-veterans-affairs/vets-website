import { isLoggedIn as isLoggedInSelector } from 'platform/user/selectors';
import { shouldUseProxyUrl } from 'platform/site-wide/ebenefits/selectors';
import { proxyUrl } from 'platform/site-wide/ebenefits/utilities';

export default function createMyVALoginWidget(store) {
  let unsubscribe;
  const updateEbenefitsLinks = () => {
    const state = store.getState();
    const isLoggedIn = isLoggedInSelector(state);
    const useProxyUrl = shouldUseProxyUrl(state);

    if (isLoggedIn && useProxyUrl) {
      const ebenefitsDomain = 'https://www.ebenefits.va.gov';
      const ebenefitsLinks = [
        ...document.querySelectorAll(`a[href^="${ebenefitsDomain}"]`),
      ];

      ebenefitsLinks.forEach(anchor => {
        const { href } = anchor;
        const path = href.replace(ebenefitsDomain, '');

        // eslint-disable-next-line no-param-reassign
        anchor.href = proxyUrl(path);
      });

      unsubscribe();
    }
  };
  unsubscribe = store.subscribe(updateEbenefitsLinks);
}
