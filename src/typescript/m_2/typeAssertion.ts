// Type Assertion Practice in TypeScript

// 1. Basic assertion
let value: unknown = "Hello TypeScript";

let strLength: number = (value as string).length;
// alternative syntax (not recommended in TSX/React)
// let strLength2: number = (<string>value).length;

// 2. Assertion with DOM elements
const input = document.getElementById("user-input") as HTMLInputElement;

if (input) {
  input.value = "Shakil";
}

// 3. Assertion with union types
type ID = string | number;

let userId: ID = "abc123";

// assert when you are sure
let idLength = (userId as string).length;

// safer way (preferred)
if (typeof userId === "string") {
  console.log(userId.length);
}

// 4. Assertion in function
function process(value: unknown) {
  const str = value as string;
  console.log(str.toUpperCase());
}

// 5. Non-null assertion (!)
const el = document.getElementById("app")!;
el.innerHTML = "App Loaded";

// ⚠️ dangerous if element doesn't exist

// 6. Avoid overusing assertions
// bad practice
let data: any = "123";
let num: number = data as number; // unsafe

// better approach
let safeData: unknown = "123";
if (typeof safeData === "number") {
  let safeNum: number = safeData;
}

// 7. Usage
console.log(strLength);
process("hello");