export class ServiceRegistry {
  constructor() {
    this.services = {};
  }

  registerService(service) {
    this.services[service.getName()] = service;
  }

  getService(name) {
    return this.services[name];
  }

  getAllServices() {
    return Object.values(this.services); // Extract service objects from map
  }
}

// Example usage:
// const serviceRegistry = new ServiceRegistry();
// const someService = new SomeService(); // Assuming SomeService is a class that has a getName method
// serviceRegistry.registerService(someService);
// const retrievedService = serviceRegistry.getService("SomeService");
// console.log(retrievedService);
