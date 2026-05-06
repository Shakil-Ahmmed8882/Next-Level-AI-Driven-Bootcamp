// Spread & Rest Operator Practice in TypeScript
// 1. Spread with arrays (copy + merge)
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const mergedArray = [...arr1, ...arr2];
// shallow copy
const copiedArray = [...arr1];
// 2. Spread with objects
const user = {
    name: "Shakil",
    age: 25,
};
const updatedUser = {
    ...user,
    age: 26, // override
    country: "Bangladesh",
};
// 3. Spread in function call
function sum(a, b, c) {
    return a + b + c;
}
const nums = [10, 20, 30];
const total = sum(...nums);
// 4. Rest in function parameters
function addAll(...numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
const totalSum = addAll(1, 2, 3, 4, 5);
// 5. Rest with object destructuring
const product = {
    id: 1,
    title: "Laptop",
    price: 1200,
    brand: "Dell",
};
const { id, ...restProduct } = product;
// 6. Rest with array destructuring
const [first, ...restNumbers] = [100, 200, 300, 400];
// 7. Combining spread + rest
function logUsers(mainUser, secondUser, ...otherUsers) {
    console.log("Main:", mainUser);
    console.log("Second:", secondUser);
    console.log("Others:", otherUsers);
}
const users = ["Alice", "Bob", "Charlie"];
logUsers('Admin', 'Moderator', ...users);
console.log(mergedArray);
console.log(copiedArray);
console.log(updatedUser);
console.log(total);
console.log(totalSum);
console.log(restProduct);
console.log(first, restNumbers);
export {};
//# sourceMappingURL=spreadAndRest.js.map