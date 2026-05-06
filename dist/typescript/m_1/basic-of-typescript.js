const course = "TypeScript Basics  - Learn the fundamentals of TypeScript";
const age = 33;
console.log({ course, age });
// Basic TypeScript Practice
// 1. Primitive types
let isActive = true;
// 2. Arrays
let scores = [90, 85, 88];
// 3. Tuple
let userTuple = ["Alice", 30];
// 4. Enum
var Role;
(function (Role) {
    Role[Role["Admin"] = 0] = "Admin";
    Role[Role["User"] = 1] = "User";
    Role[Role["Guest"] = 2] = "Guest";
})(Role || (Role = {}));
let userRole = Role.Admin;
// 5. Function with types
function add(a, b) {
    return a + b;
}
// 6. Optional parameter
function greet(name, title) {
    return title ? `${title} ${name}` : name;
}
// 8. Object using interface
const user1 = {
    id: 1,
    name: "John",
};
let userId = "abc123";
// 10. Union type + narrowing
function printId(id) {
    if (typeof id === "string") {
        console.log(id.toUpperCase());
    }
    else {
        console.log(id.toFixed(2));
    }
}
// 11. Generics
function identity(value) {
    return value;
}
// 12. Generic usage
let result1 = identity(10);
let result2 = identity("Hello");
// 13. Arrow function
const multiply = (x, y) => x * y;
// 14. Class
class Person {
    name;
    age;
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getAge() {
        return this.age;
    }
}
// 15. Instance
const person = new Person("Mike", 28);
console.log(person.getAge());
// 16. Async function
async function fetchData() {
    return "Data loaded";
}
// 17. Promise usage
fetchData().then((data) => console.log(data));
// 18. Type assertion
let value = "123";
let strLength = value.length;
const config = { apiKey: "xyz" };
// 20. Basic usage calls
console.log(add(5, 3));
console.log(greet("Shakil"));
printId(101);
printId("ts-2026");
export {};
//# sourceMappingURL=basic-of-typescript.js.map