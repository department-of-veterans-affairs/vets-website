const isBrowser = window => {
  const { userAgent } = window.navigator;
  const iOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
  const webkit = !!userAgent.match(/WebKit/i);
  const isMobileSafari = iOS && webkit && !userAgent.match(/CriOS/i);
  const isIE = !!window.navigator.msSaveOrOpenBlob;

  return {
    isIOS: iOS,
    isWebKit: webkit,
    isMobileSafari,
    isIE,
  };
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
