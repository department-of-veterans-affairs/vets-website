// configService.js
class ConfigService {
  constructor() {
    this.formConfig = {};
  }

  setFormConfig(config) {
    this.formConfig = { ...this.formConfig, ...config };
  }

  getFormConfig() {
    return this.formConfig;
  }
}

const configService = new ConfigService();
export default configService;
