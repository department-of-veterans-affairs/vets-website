#!/usr/bin/env bash
set -e # halt script on error

bundle exec jekyll build
bundle exec htmlproof ./_site --only-4xx --check-favicon --check-html --allow-hash-href --href-ignore '/veterans-employment-center/','/gi-bill-comparison-tool/','/disability-benefits/learn/eligibility/.*','/disability-benefits/learn/','/disability-benefits/get/filing/','Employment-Resources/','/gibill/','/disability-benefits/filing/'
