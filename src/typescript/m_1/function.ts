// Functions
// Arrow functions
// object function method
// loop callback function


// Functions Practice in TypeScript

// 1. Basic function
function add(a: number, b: number): number {
  return a + b;
}

// 2. Arrow function
const subtract = (a: number, b: number): number => {
  return a - b;
};

// 3. Short arrow function
const multiply = (a: number, b: number): number => a * b;

// 4. Object with method
const user = {
  name: "Shakil",
  age: 25,

  // method with 'this'
  greet(): string {
    return `Hello, my name is ${this.name}`;
  },

  // arrow inside method (note: no own 'this')
  getBirthYear: (): number => {
    const currentYear = new Date().getFullYear();
    return currentYear - 25; // static, not using this
  },
};

// 5. Loop with callback (forEach)
const numbers: number[] = [1, 2, 3, 4];

numbers.forEach((num: number): void => {
  console.log(`Number: ${num}`);
});

// 6. Map with callback
const doubled: number[] = numbers.map((num: number): number => {
  return num * 2;
});

// 7. Filter with callback
const evenNumbers: number[] = numbers.filter((num: number): boolean => {
  return num % 2 === 0;
});

// 8. Function as parameter (callback pattern)
function processNumbers(
  arr: number[],
  callback: (num: number) => number
): number[] {
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