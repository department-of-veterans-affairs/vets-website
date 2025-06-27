# VA.gov Manifest Catalog MCP Server

MCP server for working with VA.gov application manifests and web component patterns.

## Features

- Find and search manifest.json files
- Generate manifest catalogs  
- Validate manifest structure
- Discover web component patterns
- Search applications by name, URL, or directory

## Setup

1. **Install**
   ```bash
   cd vets-website/mcp/va-manifest-mcp-server
   yarn install
   ```

2. **Configure Claude Desktop**
   
   Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "va-manifest-catalog": {
         "command": "node",
         "args": ["./mcp/va-manifest-mcp-server/index.js"]
       }
     }
   }
   ```

3. **Run** - Start Claude Desktop from your vets-website directory

## Usage

Just ask Claude:
- "Scan all manifests"
- "Search for health care applications"
- "Generate a manifest catalog"
- "Find React patterns"
- "Validate the appeals manifest"

## Tools

**Manifest Tools** (6)
- `scan_manifests` - Find all manifest.json files
- `generate_manifest_catalog` - Create catalog file
- `read_manifest_catalog` - Read existing catalog
- `search_applications` - Search by name/URL/path
- `validate_manifest` - Check manifest structure
- `get_application_info` - Get app details

**Pattern Tools** (5)
- `scan_web_component_patterns` - Find patterns
- `generate_web_component_patterns_catalog` - Create catalog
- `read_web_component_patterns_catalog` - Read catalog
- `search_web_component_patterns` - Search patterns
- `get_pattern_info` - Get pattern details

## Development

```bash
npm start          # Run server
npm run test:all   # Run tests
npm run dev        # Debug mode
```

## Requirements

- Node.js 14.15.0+
- Access to vets-website repository
- Claude Desktop

## License

MIT