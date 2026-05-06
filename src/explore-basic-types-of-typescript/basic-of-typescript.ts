const course : string = "TypeScript Basics  - Learn the fundamentals of TypeScript";
const age : number = 33;
console.log({course, age});


// Basic TypeScript Practice

// 1. Primitive types
let isActive: boolean = true;

// 2. Arrays
let scores: number[] = [90, 85, 88];

// 3. Tuple
let userTuple: [string, number] = ["Alice", 30];

// 4. Enum
enum Role {
  Admin,
  User,
  Guest,
}
let userRole: Role = Role.Admin;

// 5. Function with types
function add(a: number, b: number): number {
  return a + b;
}

// 6. Optional parameter
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

// 7. Interface
interface User {
  id: number;
  name: string;
  email?: string;
}

// 8. Object using interface
const user1: User = {
  id: 1,
  name: "John",
};

// 9. Type alias
type ID = string | number;
let userId: ID = "abc123";

// 10. Union type + narrowing
function printId(id: ID) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(2));
  }
}

// 11. Generics
function identity<T>(value: T): T {
  return value;
}

// 12. Generic usage
let result1 = identity<number>(10);
let result2 = identity<string>("Hello");

// 13. Arrow function
const multiply = (x: number, y: number): number => x * y;

// 14. Class
class Person {
  constructor(public name: string, private age: number) {}

  getAge(): number {
    return this.age;
  }
}

// 15. Instance
const person = new Person("Mike", 28);
console.log(person.getAge());

// 16. Async function
async function fetchData(): Promise<string> {
  return "Data loaded";
}

// 17. Promise usage
fetchData().then((data) => console.log(data));

// 18. Type assertion
let value: any = "123";
let strLength: number = (value as string).length;

// 19. Readonly
interface Config {
  readonly apiKey: string;
}
const config: Config = { apiKey: "xyz" };

// 20. Basic usage calls
console.log(add(5, 3));
console.log(greet("Shakil"));
printId(101);
printId("ts-2026");