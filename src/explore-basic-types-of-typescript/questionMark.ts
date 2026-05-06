// ? : Ternery operator : Decision making 
// ?? : Nulish coalescing operator : Null or undefined check
// ?. : Optional chaining operator : Safe property access

// Ternary operator

const x = "fdf"; 

console.log(x ? "Value is truthy" : "Value is falsy"); // Output: Value is falsy
console.log(x ?? "Value is null or undefined"); // Output: Value is null or undefined
console.log(x?.toString() ?? "Cannot convert to string"); // Output: Cannot convert to string


// Operators Practice in TypeScript

// 1. Ternary Operator (decision making)
const age: number = 20;

const canVote: string = age >= 18 ? "Yes" : "No";

// avoid over-nesting (bad practice example)
// const result = condition1 ? (condition2 ? "A" : "B") : "C";

// 2. Nullish Coalescing (??)
// only checks for null or undefined (NOT falsy values like 0, "", false)

const inputValue: string | null = null;

const defaultValue = inputValue ?? "Default Value";

// difference from ||
const zeroValue: number = 0;
const wrongDefault = zeroValue || 100; // ❌ becomes 100
const correctDefault = zeroValue ?? 100; // ✅ stays 0

// 3. Optional Chaining (?.)
type User = {
  name: string;
  address?: {
    city?: string;
  };
};

const user1: User = {
  name: "Shakil",
};

// safe access
const city = user1.address?.city;

// without optional chaining → would crash
// const city = user1.address.city;

// 4. Combining ?. and ??
const userCity = user1.address?.city ?? "Unknown City";

// 5. Function example
function getUserName(user?: User): string {
  return user?.name ?? "Guest";
}

// 6. Usage
console.log(canVote);
console.log(defaultValue);
console.log(wrongDefault);
console.log(correctDefault);
console.log(city);
console.log(userCity);
console.log(getUserName(user1));
console.log(getUserName());