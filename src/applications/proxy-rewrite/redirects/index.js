import environment from 'platform/utilities/environment';
// Currently we only have approval for disability related ones:
import crossDomainRedirects from './crossDomainRedirects.json';

/*
 * Redirect to a www.va.gov page if we're on a page that's being
 * replaced
 */
function redirectIfNecessary(currentWindow) {
  const matchedRedirect = crossDomainRedirects.find(
    redirect =>
      redirect.domain.replace('www.', '').toLowerCase() ===
        currentWindow.location.host.replace('www.', '').toLowerCase() &&
      redirect.src.toLowerCase() ===
        currentWindow.location.pathname.toLowerCase(),
  );

  if (matchedRedirect) {
    // eslint-disable-next-line no-param-reassign
    currentWindow.location.href = `${environment.BASE_URL}${
      matchedRedirect.dest
    }`;
  }
}

function localRedirectIfNecessary() {
  const target = new URLSearchParams(window.location.search).get('target');
  const matchedRedirect = crossDomainRedirects.find(
    redirect => `https://${redirect.domain}${redirect.src}` === target,
  );

  if (matchedRedirect) {
    // eslint-disable-next-line no-param-reassign
    window.location.href = `${environment.BASE_URL}${matchedRedirect.dest}`;
  }
}

export default (environment.isLocalhost()
  ? localRedirectIfNecessary
  : redirectIfNecessary);
