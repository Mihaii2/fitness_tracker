const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  // Utility functions for fitness tracker
  const getSteps = () => {
    // Logic to get steps data from database or API
    return 10000;
  };

  const getCaloriesBurned = () => {
    // Logic to calculate calories burned based on steps
    const steps = getSteps();
    return steps * 0.05;
  };

  // Generate HTML response with fitness tracker data
  const htmlResponse = `
    <h1>Fitness Tracker</h1>
    <p>Welcome to the Fitness Tracker website!</p>
    <p>Steps: ${getSteps()}</p>
    <p>Calories Burned: ${getCaloriesBurned()}</p>
  `;

  res.end(htmlResponse);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
