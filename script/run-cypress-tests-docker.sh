if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  CYPRESS_BASE_URL=http://vets-website:3001 yarn cy:run
fi
