interface Service {
  getName(): string;
  getUrl(methodName: string): string; // Allow retrieving URL based on method name
  fetchData<T>(methodName: string, ...args: any[]): Promise<T>;
  handleError(error: any): void;
}

  