// Non-Primitive Types Practice in TypeScript
// 1. Tuple
let userTuple;
userTuple = [1, "Shakil", true];
// Access tuple elements
const userId = userTuple[0];
const userName = userTuple[1];
const isLoggedIn = userTuple[2];
// 2. Array (non-primitive)
let numbers = [10, 20, 30];
let names = ["Alice", "Bob"];
// 3. Object
let user = {
    id: 101,
    name: "John",
};
const product1 = {
    id: 1,
    title: "Laptop",
    price: 1200,
};
const order = {
    orderId: 5001,
    product: product1,
};
// 6. Function returning object
function getUser() {
    return { id: 2, name: "Alice" };
}
// 7. Tuple inside function
function getCoordinates() {
    return [23.8103, 90.4125];
}
// 8. Readonly Array
const readonlyNumbers = [1, 2, 3];
// 9. Using all
console.log(userTuple);
console.log(numbers);
console.log(user);
console.log(product1);
console.log(order);
console.log(getUser());
console.log(getCoordinates());
export {};
//# sourceMappingURL=primitiveType.js.map