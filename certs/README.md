# Self-signed certificates

_For development environment only_

The VA uses self-signed certificates with a non-globally trusted Root Certificate
authority. 


Used in [the Drupal client](https://github.com/department-of-veterans-affairs/vets-website/blob/master/src/site/stages/build/drupal/api.js)'s `proxyFetch` function when using the SOCKS proxy.
