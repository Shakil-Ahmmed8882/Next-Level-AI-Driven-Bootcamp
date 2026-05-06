// Functions
// Arrow functions
// object function method
// loop callback function
// Functions Practice in TypeScript
// 1. Basic function
function add(a, b) {
    return a + b;
}
// 2. Arrow function
const subtract = (a, b) => {
    return a - b;
};
// 3. Short arrow function
const multiply = (a, b) => a * b;
// 4. Object with method
const user = {
    name: "Shakil",
    age: 25,
    // method with 'this'
    greet() {
        return `Hello, my name is ${this.name}`;
    },
    // arrow inside method (note: no own 'this')
    getBirthYear: () => {
        const currentYear = new Date().getFullYear();
        return currentYear - 25; // static, not using this
    },
};
// 5. Loop with callback (forEach)
const numbers = [1, 2, 3, 4];
numbers.forEach((num) => {
    console.log(`Number: ${num}`);
});
// 6. Map with callback
const doubled = numbers.map((num) => {
    return num * 2;
});
// 7. Filter with callback
const evenNumbers = numbers.filter((num) => {
    return num % 2 === 0;
});
// 8. Function as parameter (callback pattern)
function processNumbers(arr, callback) {
    return arr.map(callback);
}
const squared = processNumbers(numbers, (n) => n * n);
console.log(add(5, 3));
console.log(subtract(10, 4));
console.log(multiply(6, 2));
console.log(user.greet());
console.log(user.getBirthYear());
console.log(doubled);
console.log(evenNumbers);
console.log(squared);
export {};
//# sourceMappingURL=function.js.map