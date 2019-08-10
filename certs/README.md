# Self-signed certificates

_For development environment only_

The VA uses self-signed certificates with a non-globally trusted Root Certificate
authority. 


Used in src/site/stages/build/drupal/api.js line 54 if using the SOCKS proxy:
```
async proxyFetch(url, options = {}) {
      if (this.usingProxy) {
        // addCAs() is here because VA uses self-signed certificates with a
        // non-globally trusted Root Certificate Authority and we need to
        // tell our code to trust it, otherwise we get self-signed certificate errors.
        syswidecas.addCAs('certs/VA-Internal-S2-RCA1-v1.pem');
      }

      return fetch(
        url,
        Object.assign({}, options, {
          agent: this.usingProxy ? agent : undefined,
        }),
      );
    },
```
