export class ServiceManager {
  constructor(registry) {
    this.registry = registry;
  }

  async initializeServices() {
    const services = this.registry.getAllServices();
    await Promise.all(services.map((service) => this.verifyServiceUrl(service)));
  }

  async verifyServiceUrl(service) {
    try {
      const response = await fetch(service.getUrl());
      if (!response.ok) {
        throw new Error(`Error verifying service URL for ${service.getName()}: ${response.statusText}`);
      }
    } catch (error) {
      service.handleError(error);
    }
  }

  async fetchData(serviceName, methodName, ...args) {
    const service = this.registry.getService(serviceName);
    if (!service) {
      throw new Error(`Service not found: ${serviceName}`);
    }
    return service.getData(methodName, ...args);
  }
}

// Example usage:
// const serviceRegistry = new ServiceRegistry(); // Assuming ServiceRegistry is properly imported
// const serviceManager = new ServiceManager(serviceRegistry);
// serviceManager.initializeServices()
//   .then(() => serviceManager.fetchData("serviceName"))
//   .then(data => console.log(data))
//   .catch(error => console.error(error));
