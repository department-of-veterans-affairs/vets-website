import environment from '../../../platform/utilities/environment';
// These pages are old va.gov pages that we are redirecting to
// pages that we control
import redirects from './otherDomainRedirects.json';

/*
 * Redirect to a www.va.gov page if we're on a page that's being
 * replaced
 */
export default function redirectIfNecessary(currentWindow) {
  const matchedRedirect = redirects
    .find(redirect =>
      redirect.domain.toLowerCase() === currentWindow.location.host.toLowerCase() &&
      redirect.src.toLowerCase() === currentWindow.location.pathname.toLowerCase()
    );

  if (matchedRedirect) {
    // eslint-disable-next-line no-param-reassign
    currentWindow.location.href = `${environment.BASE_URL}${matchedRedirect.dest}`;
  }
}

