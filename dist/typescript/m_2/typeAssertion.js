// Type Assertion Practice in TypeScript
// 1. Basic assertion
let value = "Hello TypeScript";
let strLength = value.length;
// alternative syntax (not recommended in TSX/React)
// let strLength2: number = (<string>value).length;
// 2. Assertion with DOM elements
const input = document.getElementById("user-input");
if (input) {
    input.value = "Shakil";
}
let userId = "abc123";
// assert when you are sure
let idLength = userId.length;
// safer way (preferred)
if (typeof userId === "string") {
    console.log(userId.length);
}
// 4. Assertion in function
function process(value) {
    const str = value;
    console.log(str.toUpperCase());
}
// 5. Non-null assertion (!)
const el = document.getElementById("app");
el.innerHTML = "App Loaded";
// ⚠️ dangerous if element doesn't exist
// 6. Avoid overusing assertions
// bad practice
let data = "123";
let num = data; // unsafe
// better approach
let safeData = "123";
if (typeof safeData === "number") {
    let safeNum = safeData;
}
// 7. Usage
console.log(strLength);
process("hello");
export {};
//# sourceMappingURL=typeAssertion.js.map