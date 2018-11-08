function createAppRedirectHtml(vetsGovSrc, vaGovDest, vaGovHost) {
  return (
    `` +
    `<!doctype html>
<head>
  <script nonce="**CSP_NONCE**">
    function requiresSignIn(newPath) {
      var pathsRequiringSignIn = [
        '/track-claims',
        '/my-va',
        '/download-va-letters',
        '/profile',
        '/account',
        '/get-veteran-id-cards/apply',
        '/health-care/health-records'
      ];

      for (var i=0; i < pathsRequiringSignIn.length; i++) {
        var reactPath = pathsRequiringSignIn[i];
        if (newPath.indexOf(reactPath) >= 0) return true;
      }
    }
    var pathname = window.location.pathname;
    var newPath = pathname.replace('${vetsGovSrc}', '${vaGovDest}');
    var finalUrl = '${vaGovHost}' + newPath;
    var redirectUrl = finalUrl + window.location.search;

    if (requiresSignIn(newPath)) {
      redirectUrl = '${vaGovHost}?next=' + encodeURIComponent(newPath + window.location.search);
    }
    document.write('<meta http-equiv=refresh content="0; url=' + redirectUrl + '">');
    document.write('<link rel=canonical href="' + finalUrl + '">');
  </script>
  <title>Page Moved</title>
</head>
<body>
</body>
`
  );
}

module.exports = createAppRedirectHtml;
