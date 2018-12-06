function createStandardRedirectHtml(vaGovDest) {
  return (
    `` +
    `<!doctype html>
<head>
  <meta http-equiv=refresh content="0; url=${vaGovDest}">
  <link rel=canonical href="${vaGovDest}">
  <title>Page Moved</title>
</head>
<body>
</body>
`
  );
}

module.exports = createStandardRedirectHtml;
