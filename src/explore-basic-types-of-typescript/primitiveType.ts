// Non-Primitive Types Practice in TypeScript

// 1. Tuple
let userTuple: [number, string, boolean];
userTuple = [1, "Shakil", true];

// Access tuple elements
const userId = userTuple[0];
const userName = userTuple[1];
const isLoggedIn = userTuple[2];

// 2. Array (non-primitive)
let numbers: number[] = [10, 20, 30];
let names: Array<string> = ["Alice", "Bob"];

// 3. Object
let user: { id: number; name: string } = {
  id: 101,
  name: "John",
};

// 4. Interface
interface Product {
  id: number;
  title: string;
  price: number;
}

const product1: Product = {
  id: 1,
  title: "Laptop",
  price: 1200,
};

// 5. Nested Object
interface Order {
  orderId: number;
  product: Product;
}

const order: Order = {
  orderId: 5001,
  product: product1,
};

// 6. Function returning object
function getUser(): { id: number; name: string } {
  return { id: 2, name: "Alice" };
}

// 7. Tuple inside function
function getCoordinates(): [number, number] {
  return [23.8103, 90.4125];
}

// 8. Readonly Array
const readonlyNumbers: ReadonlyArray<number> = [1, 2, 3];

// 9. Using all
console.log(userTuple);
console.log(numbers);
console.log(user);
console.log(product1);
console.log(order);
console.log(getUser());
console.log(getCoordinates());