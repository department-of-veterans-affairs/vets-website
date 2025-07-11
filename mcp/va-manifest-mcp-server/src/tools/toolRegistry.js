/**
 * Tool Registry for dynamic tool registration and execution
 * Simplifies adding new tools and categories
 */
class ToolRegistry {
  constructor() {
    this.tools = new Map();
    this.categories = new Map();
  }

  /**
   * Register a tool category
   * @param {string} categoryName - Name of the category
   * @param {Object} toolClass - Tool class with static methods
   * @param {string} description - Category description
   */
  registerCategory(categoryName, toolClass, description) {
    // Get tool definitions from the class
    const tools = toolClass.getToolDefinitions();

    // Store category info
    this.categories.set(categoryName, {
      class: toolClass,
      description,
      tools: tools.map(t => t.name),
    });

    // Register each tool
    tools.forEach(toolDef => {
      this.registerTool(toolDef.name, toolClass, toolDef, categoryName);
    });
  }

  /**
   * Register an individual tool
   * @param {string} toolName - Name of the tool
   * @param {Object} toolClass - Tool class containing the method
   * @param {Object} definition - Tool definition
   * @param {string} category - Tool category
   */
  registerTool(toolName, toolClass, definition, category) {
    // Convert tool name to method name (e.g., "scan_manifests" -> "scanManifests")
    const methodName = ToolRegistry.toolNameToMethodName(toolName);

    this.tools.set(toolName, {
      class: toolClass,
      method: methodName,
      definition,
      category,
      execute: async args => {
        const method = toolClass[methodName];
        if (!method) {
          throw new Error(
            `Method ${methodName} not found in ${toolClass.name}`,
          );
        }
        return await method.call(toolClass, args);
      },
    });
  }

  /**
   * Convert snake_case tool name to camelCase method name
   * @param {string} toolName - Tool name in snake_case
   * @returns {string} - Method name in camelCase
   */
  static toolNameToMethodName(toolName) {
    return toolName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Get all tool definitions
   * @returns {Array} - Array of all tool definitions
   */
  getAllDefinitions() {
    return Array.from(this.tools.values()).map(tool => tool.definition);
  }

  /**
   * Execute a tool by name
   * @param {string} toolName - Name of the tool to execute
   * @param {Object} args - Arguments for the tool
   * @returns {Promise<Object>} - Tool execution result
   */
  async execute(toolName, args) {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Unknown tool: ${toolName}`);
    }
    return await tool.execute(args);
  }

  /**
   * Get tools organized by category
   * @returns {Object} - Tools organized by category
   */
  getByCategory() {
    const result = {};

    this.categories.forEach((categoryInfo, categoryName) => {
      result[categoryName] = {
        description: categoryInfo.description,
        tools: categoryInfo.tools.map(toolName => {
          const tool = this.tools.get(toolName);
          return {
            name: toolName,
            description: tool.definition.description,
          };
        }),
      };
    });

    return result;
  }

  /**
   * Get tool count information
   * @returns {Object} - Tool count summary
   */
  getInfo() {
    const categoryCounts = {};

    this.categories.forEach((info, name) => {
      categoryCounts[name] = {
        count: info.tools.length,
        tools: info.tools,
      };
    });

    return {
      totalTools: this.tools.size,
      categories: categoryCounts,
    };
  }
}

export default ToolRegistry;
