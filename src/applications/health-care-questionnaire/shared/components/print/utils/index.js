const isBrowser = window => {
  const rv = {
    isIOS: false,
    isWebKit: false,
    isMobileSafari: false,
    isIE: false,
  };
  if (!window || !window.navigator) {
    return rv;
  }
  const { userAgent, msSaveOrOpenBlob } = window.navigator;
  rv.isIE = !!msSaveOrOpenBlob;
  if (!userAgent) {
    return rv;
  }
  rv.isIOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
  rv.isWebKit = !!userAgent.match(/WebKit/i);
  rv.isMobileSafari = rv.isIOS && rv.isWebKit && !userAgent.match(/CriOS/i);
  return rv;
};

const openPdfInNewWindow = (
  window,
  blob,
  options = {
    fileName: 'Questionnaire Response',
    openInNewWindow: true,
  },
) => {
  const { document } = window;
  const URL = window.URL || window.webkitURL;
  const currentBrowser = isBrowser(window);

  if (currentBrowser.isIE) {
    window.navigator.msSaveOrOpenBlob(blob, `${options.fileName}.pdf`);
  } else {
    const url = URL.createObjectURL(blob, {
      type: 'application/pdf',
    });
    if (currentBrowser.isMobileSafari) {
      const downloadWindow = window.open();
      downloadWindow.location.href = url;
    }
    const anchor = document.createElement('a');

    if (!options.openInNewWindow && typeof anchor.download !== 'undefined') {
      anchor.download = options.fileName;
    }

    anchor.href = url;
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
};

export { openPdfInNewWindow, isBrowser };
