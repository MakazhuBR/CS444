export class LoginService {
    getName() {
      return "LoginService";
    }
  
    getUrl() {
      return '/upload'; // Note: added 'http://' to the URL
    }
  
    async handleLogin() {
      try {
        const response = await fetch(this.getUrl(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: formData
        });
  
        if (!response.ok) {
          throw new Error(`Error fetching data from server: ${response.statusText}`);
        }
  
        return response
      } catch (error) {
        this.handleError(error);
        throw error;
      }
    }
  
    getData(methodName, ...args) {
      if (typeof methodName === 'string') {
        if (typeof this[methodName] !== 'function') {
          throw new Error(`Service '${this.getName()}' does not have a method called '${methodName}'`);
        }
        return this[methodName](...args);
      } else {
        return methodName(...args);
      }
    }
  
    handleError(error) {
      console.error("Error in while uploading file", error);
      //TODO (add more error handling logic)
    }
  }
  
  // Example usage:
  // const emailVerificationService = new EmailVerificationService();
  // emailVerificationService.sendEmail("user@example.com")
  //   .then(response => console.log(response))
  //   .catch(error => console.error(error));
  