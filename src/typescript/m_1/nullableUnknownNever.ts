// Nullable, Unknown, Never in TypeScript

// 1. Nullable (null | undefined)
type NullableString = string | null | undefined;

let username: NullableString = null;

function printName(name: NullableString): void {
  if (name == null) {
    console.log("No name provided");
  } else {
    console.log(name.toUpperCase());
  }
}

// 2. Unknown (safe alternative to any)
let value: unknown;

value = "Hello";
value = 42;

// must narrow before using
if (typeof value === "string") {
  console.log(value.toUpperCase());
}

// unsafe (will error)
// console.log(value.toUpperCase());

// 3. Unknown with function
function processInput(input: unknown): void {
  if (typeof input === "number") {
    console.log(input * 2);
  } else if (typeof input === "string") {
    console.log(input.trim());
  } else {
    console.log("Unsupported type");
  }
}

// 4. Never (function that never returns)
function throwError(message: string): never {
  throw new Error(message);
}

// 5. Never with infinite loop
function infiniteLoop(): never {
  while (true) {}
}

// 6. Exhaustive check using never
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return 3.14 * 10 * 10;
    case "square":
      return 10 * 10;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

// 7. Usage
printName(username);
processInput("TypeScript");
processInput(10);

// throwError("Something went wrong"); // will stop execution