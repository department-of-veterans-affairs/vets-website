# Facility Locator

The VA Facility Locator helps Veterans find VA health facilities, benefits offices, cemeteries, and Vet Centers.

## Quick Start

### Run with mock API (no backend needed)

```bash
USE_MOCKS=true yarn watch --env entry=facilities --env api=http://mock-vets-api.local
```

Then open http://localhost:3001/find-locations

### Run with real API

```bash
# Start vets-api locally first, then:
yarn watch --env entry=facilities
```

## Development

### Tech Stack

- React with Redux
- react-leaflet for maps
- Mapbox for geocoding/address autocomplete
- VA Design System web components

### Key Files

| Path | Description |
|------|-------------|
| `facility-locator-entry.jsx` | App entry point |
| `components/` | React components |
| `containers/` | Redux-connected containers |
| `reducers/` | Redux state management |
| `actions/` | API calls and Redux actions |
| `mocks/` | MSW mock handlers for local dev |

### Mock Data

The `mocks/` directory contains MSW (Mock Service Worker) handlers for local development without vets-api:

- `browser.js` - MSW setup and handlers
- `data/facilities.json` - Sample facility search results
- `data/geocoding.json` - Sample Mapbox geocoding response

To customize mock data, edit the JSON files in `mocks/data/`.

## Testing

### Unit Tests

```bash
yarn test:unit --app-folder facility-locator
```

### E2E Tests

```bash
# Start the app first
yarn watch --env entry=facilities

# Run Cypress tests
yarn cy:run --spec "src/applications/facility-locator/tests/e2e/**/*.cypress.spec.js"
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /facilities_api/v2/va` | Search for VA facilities |
| `GET /facilities_api/v2/va/:id` | Get facility details |
| `GET /v0/feature_toggles` | Feature flags |
| `GET /data/cms/vamc-ehr.json` | VAMC EHR system data |

## Feature Flags

Feature toggles are managed via vets-api. When running with mocks, all toggles default to disabled. To enable specific toggles, modify the mock handler in `mocks/browser.js`.
