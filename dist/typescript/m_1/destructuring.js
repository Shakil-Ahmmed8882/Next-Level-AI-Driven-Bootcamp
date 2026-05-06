// Destructuring Practice in TypeScript
// 1. Array destructuring
const numbers = [10, 20, 30, 40];
const [first, second] = numbers;
const [one, , three] = numbers; // skip value
// with rest
const [head, ...tail] = numbers;
// 2. Object destructuring
const user = {
    id: 1,
    name: "Shakil",
    age: 25,
    country: "Bangladesh",
    role: "admin",
};
const { name, age } = user;
// rename variables
const { name: userName, country } = user;
// default value
const { role = "guest" } = user;
// 3. Nested destructuring
const product = {
    id: 101,
    details: {
        title: "Laptop",
        price: 1200,
    },
};
const { details: { title, price }, } = product;
// 4. Function parameter destructuring
function printUser({ name, age }) {
    console.log(`${name} is ${age} years old`);
}
// 5. Array in function param
function getCoords([x, y]) {
    console.log(`X: ${x}, Y: ${y}`);
}
// 6. Usage
console.log(first, second);
console.log(one, three);
console.log(head, tail);
console.log(userName, age, country, role);
console.log(title, price);
printUser(user);
getCoords([23.8, 90.4]);
export {};
//# sourceMappingURL=destructuring.js.map