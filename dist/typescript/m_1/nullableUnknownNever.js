// Nullable, Unknown, Never in TypeScript
let username = null;
function printName(name) {
    if (name == null) {
        console.log("No name provided");
    }
    else {
        console.log(name.toUpperCase());
    }
}
// 2. Unknown (safe alternative to any)
let value;
value = "Hello";
value = 42;
// must narrow before using
if (typeof value === "string") {
    console.log(value.toUpperCase());
}
// unsafe (will error)
// console.log(value.toUpperCase());
// 3. Unknown with function
function processInput(input) {
    if (typeof input === "number") {
        console.log(input * 2);
    }
    else if (typeof input === "string") {
        console.log(input.trim());
    }
    else {
        console.log("Unsupported type");
    }
}
// 4. Never (function that never returns)
function throwError(message) {
    throw new Error(message);
}
// 5. Never with infinite loop
function infiniteLoop() {
    while (true) { }
}
function getArea(shape) {
    switch (shape) {
        case "circle":
            return 3.14 * 10 * 10;
        case "square":
            return 10 * 10;
        default:
            const _exhaustive = shape;
            return _exhaustive;
    }
}
// 7. Usage
printName(username);
processInput("TypeScript");
processInput(10);
export {};
// throwError("Something went wrong"); // will stop execution
//# sourceMappingURL=nullableUnknownNever.js.map