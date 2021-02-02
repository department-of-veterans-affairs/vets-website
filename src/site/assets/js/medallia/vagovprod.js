// Medallia Embed Script
(function(g) {
  var isStaging = window.location.host.includes('staging');
  if (!isStaging) return

  var teamSitePathnames = [
    // `/ORMDI` redirects to include a trailing slash (`/ORMDI/`)
    // TODO: Update regex to reject `/ormdi/*` (for example, `/ormdi/foo`)
    /\/ormdi\//i,
    /\/ormdi\/NoFEAR_Select.asp/i,
    /\/ormdi\/Contact_Us.asp/i,
    /\/ormdi\/EEOcomplaint.asp/i,
    /\/ormdi\/HPP.asp/i,
    /\/ormdi\/Diversity_Inclusion.asp/i,
    /\/ormdi\/Reasonable_Accommodations1.asp/i,
    // `/adr` redirects to include a trailing slash (`/adr/`)
    // TODO: Update regex to reject `/adr/*` (for example, `/adr/foo`)
    /\/adr\//i,
  ];
  var pathname = window.location.pathname;
  var isApprovedPathname = teamSitePathnames.some(x => x.test(pathname))
  if (!isApprovedPathname) return

  var d = document,
    am = d.createElement('script'),
    h = d.head || d.getElementsByTagName('head')[0],
    fsr = 'fsReady',
    aex = {
      src: 'https://resource.digital.voice.va.gov/wdcvoice/5/onsite/embed.js',
      type: 'text/javascript',
      async: 'true',
    };
  for (var attr in aex) {
    am.setAttribute(attr, aex[attr]);
  }
  h.appendChild(am);
  g[fsr] ||
    (g[fsr] = function() {
      var aT = '__' + fsr + '_stk__';
      g[aT] = g[aT] || [];
      g[aT].push(arguments);
    });
})(window);

