function createStandardRedirectHtml(vaGovDest) {
  return (
    `` +
    `<!doctype html>
<head>
  <meta http-equiv=refresh content="1; url=${vaGovDest}">
  <link rel=canonical href="${vaGovDest}">
  <title>Page Moved</title>
</head>
<body>
  New location: <a href="${vaGovDest}">${vaGovDest}</a>
</body>
`
  );
}

module.exports = createStandardRedirectHtml;
