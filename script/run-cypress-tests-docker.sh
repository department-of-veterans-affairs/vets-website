if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  yarn cy:run --config baseUrl=http://vets-website:3001
fi
