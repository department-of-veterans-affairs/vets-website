import environment from '../../../platform/utilities/environment';
// Currently we only have approval for disability related ones:
import clientSideRedirects from './clientSideRedirects.json';

/*
 * Redirect to a www.va.gov page if we're on a page that's being
 * replaced
 */
export default function redirectIfNecessary(currentWindow) {
  const matchedRedirect = clientSideRedirects.find(
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
