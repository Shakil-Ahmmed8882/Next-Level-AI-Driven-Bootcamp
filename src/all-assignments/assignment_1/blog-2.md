# Building Reusable Components with Generics: Type-Safe Flexibility

## Introduction

One of TypeScript's most powerful features is Generics. Generics allow you to build components and functions that work with any data type while maintaining strict type safety. Instead of choosing a single type when you create a function, you can write code that works with multiple types—and TypeScript will ensure type correctness regardless of what gets passed in. This post explores how Generics eliminate code duplication and enable flexible, reusable solutions.

## The Problem: Code Duplication Without Generics

Without Generics, you'd need to write separate functions for different types:

```typescript
function getFirstString(arr: string[]): string {
  return arr[0];
}

function getFirstNumber(arr: number[]): number {
  return arr[0];
}

function getFirstBoolean(arr: boolean[]): boolean {
  return arr[0];
}
```

This approach quickly becomes unmaintainable. Every new type requires a new function. Changes to the logic must be applied to every copy.

## The Solution: Generic Functions

Generics use angle brackets `<T>` to represent a type variable that TypeScript will infer automatically:

```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst([1, 2, 3]); // T = number, returns number
getFirst(["a", "b", "c"]); // T = string, returns string
getFirst([true, false]); // T = boolean, returns boolean
```

TypeScript infers `T` based on what you pass in. You get the same function with complete type safety for all types.

## Generic Constraints: Safety Without Flexibility

Sometimes you want to constrain a generic type to ensure it has certain properties:

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

logLength("hello"); // ✓ strings have length
logLength([1, 2, 3]); // ✓ arrays have length
logLength(42); // ✗ error: numbers don't have length
```

The `extends` keyword restricts `T` to types that have a `length` property.

## Multiple Generics: Working with Multiple Types

You can use multiple generic parameters when working with different types:

```typescript
function combine<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

combine("hello", 42); // [string, number]
combine([1, 2], { name: "Alice" }); // [number[], object]

function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: "Alice" }, { age: 25 });
// merged has type: { name: string } & { age: number }
```

## Generic Interfaces: Type-Safe Data Structures

Build flexible data structures that maintain type safety:

```typescript
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

class Box<T> implements Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const stringBox = new Box<string>("hello");
stringBox.getValue(); // type: string

const numberBox = new Box<number>(42);
numberBox.getValue(); // type: number
```

## Generic Classes: Reusable Implementations

Create classes that work with any type while maintaining type safety:

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
numberStack.pop(); // type: number | undefined

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.pop(); // type: string | undefined
```

## Real-World Example: API Response Handler

```typescript
interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  error?: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { status: "success", data: data as T };
  } catch (err) {
    return { status: "error", error: String(err) };
  }
}

interface User {
  id: number;
  name: string;
}

const response = await fetchData<User>("/api/users/1");
if (response.status === "success" && response.data) {
  console.log(response.data.name); // type: string
}
```

## Generic Default Values

You can provide default types for generics:

```typescript
interface Pair<T = string, U = number> {
  first: T;
  second: U;
}

const pair1: Pair = { first: "hello", second: 42 }; // T=string, U=number
const pair2: Pair<boolean, string> = { first: true, second: "world" };
```

## Keyof Constraint: Working with Object Properties

Ensure a generic stays bound to an object's properties:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 25 };
getProperty(person, "name"); // ✓ "name" exists on person
getProperty(person, "email"); // ✗ error: "email" doesn't exist
```

## Conclusion

Generics are the backbone of reusable, type-safe TypeScript code. They eliminate code duplication by allowing a single function or class to work with any data type, while TypeScript ensures that the types remain correct throughout your application. Whether you're building data structures, handling API responses, or creating utility functions, Generics let you write flexible code without sacrificing safety. Master Generics, and you'll write cleaner, more maintainable code that scales as your project grows.
