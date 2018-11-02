function createAppRedirectHtml(vetsGovSrc, vaGovDest, vaGovHost) {
  return (
    `` +
    `<!doctype html>
<head>
  <script>
    var pathname = window.location.pathname; 
    var newPath = pathname.replace('${vetsGovSrc}', '${vaGovDest}');
    var fullUrl = '${vaGovHost}' + newPath + window.location.search;
    document.write('<meta http-equiv=refresh content="0; url=' + fullUrl + '">');
  </script>
  <link rel=canonical href="${vaGovDest}">
  <title>Page Moved</title>
</head>
<body>
  New location: <a href="${vaGovDest}">${vaGovDest}</a>
</body>
`
  );
}

module.exports = createAppRedirectHtml;
