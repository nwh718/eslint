const { divide } = require('./utils/math');

try {
    console.log('Testing divide(10, 0):');
    const result = divide(10, 0);
    console.log('Result:', result);
} catch (error) {
    console.log('Error caught:', error.message);
    console.log('Expected: "Error: division by zero"');
}
