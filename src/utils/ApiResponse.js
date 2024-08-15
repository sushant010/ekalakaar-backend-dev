class ApiResponse {
  constructor(statusCode, data) {
    this.status = "success";
    this.statusCode = statusCode;
    this.results = Array.isArray(data) === true ? data.length : undefined;
    this.data = data;
  }
}

export default ApiResponse;
