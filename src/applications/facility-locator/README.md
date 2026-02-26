# Facility Locator

Converting the facility locator prototype to a production-ready React app

This app uses react-leaflet and react-tabs node modules.

## Local Development

### Community Care Provider Search (PPMS)

When running locally, Community Care Provider searches use **mock data** by default (no VPN required).

**Mock Data Characteristics:**
- All provider names prefixed with `[MOCK]` for easy identification
- Results centered around Atlantic Highlands, NJ coordinates
- 3 pharmacies, 2 medical providers available
- 8 specialty types for service filtering

**API Endpoints:**
- `/facilities_api/v2/ccp?type=pharmacy` - Pharmacy search
- `/facilities_api/v2/ccp/provider?specialties[]=207R00000X` - Provider search (requires specialty)
- `/facilities_api/v2/ccp/urgent_care` - Urgent care search
- `/facilities_api/v2/ccp/specialties` - Available specialty codes

**Mock Data Location:** 
Mock responses are defined in the `vets-api-mockdata` repository under `ppms/` directory and enabled automatically in development via `Settings.ppms.mock = true`.

**To Use Real PPMS API:**
Set in `vets-api/config/settings.local.yml`:
```yaml
ppms:
  mock: false
```
(Requires VPN and network access to VA PPMS systems)
