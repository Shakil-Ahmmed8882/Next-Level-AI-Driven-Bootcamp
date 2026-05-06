// Type Alias Practice in TypeScript

// 1. Basic type alias
type UserID = string | number;

let id1: UserID = "abc123";
let id2: UserID = 101;

// 2. Object type alias
type User = {
  id: UserID;
  name: string;
  age: number;
};

const user1: User = {
  id: 1,
  name: "Shakil",
  age: 25,
};

// 3. Function type alias
type AddFn = (a: number, b: number) => number;

const add: AddFn = (x, y) => x + y;

// 4. Union types
type Status = "success" | "error" | "loading";

let currentStatus: Status = "success";

// 5. Intersection types
type Admin = {
  role: string;
};

type AdminUser = User & Admin;

const admin: AdminUser = {
  id: "admin-1",
  name: "Root",
  age: 30,
  role: "superadmin",
};

// 6. Array type alias
type Numbers = number[];

const nums: Numbers = [1, 2, 3, 4];


console.log(id1, id2);
console.log(user1);
console.log(add(5, 3));
console.log(currentStatus);
console.log(admin);
console.log(nums);