import download from 'downloadjs';

const isInternetExplorer = !!navigator.msSaveBlob;

if (isInternetExplorer) {
  document.addEventListener('click', event => {
    const { target } = event;

    if (target?.tagName === 'A' && target?.hasAttribute('download')) {
      const url = target.getAttribute('href');
      const isSameOrigin = url?.startsWith(window.location.origin);

      if (isSameOrigin) {
        event.preventDefault();

        // Attempt to download the file.
        const request = download(url);

        // If we aren't able to, resort to opening the download link in a new tab.
        request.onerror = () => window.open(url, '_blank');
      }
    }
  });
}
