# B7A1 Assignment: Advanced Problem Solving with TypeScript & OOP

This assignment demonstrates fundamental TypeScript concepts including data typing, interfaces, class inheritance, type checking, and data structure manipulation.

## 📁 File Structure

```
├── solutions.ts          # All 7 problem solutions
├── blog-1.md             # Blog: any vs unknown and type narrowing
├── blog-2.md             # Blog: Generics for reusable components
└── README.md             # This file
```

## 💻 Solutions Overview

### Problem 1: Filter Even Numbers
Filters an array to return only even numbers.

### Problem 2: Reverse String
Reverses a string by splitting, reversing, and joining characters.

### Problem 3: Type Guards with Union Types
Uses type guards to distinguish between string and number types.

### Problem 4: Generic Function with Constraints
Implements a generic property getter with keyof constraints to ensure type safety.

### Problem 5: Interface and Object Spread
Creates Book objects with an added `isRead` property while preserving original properties.

### Problem 6: Class Inheritance
Demonstrates inheritance with Person base class and Student subclass with detailed output.

### Problem 7: Array Intersection
Finds common elements between two arrays using Set for efficient lookup.

## 📝 Blog Posts

### Blog 1: Why `any` is a Type Safety Hole
Explores why `any` defeats TypeScript's purpose and how `unknown` is safer. Covers:
- Problems with `any` type
- Benefits of `unknown`
- Type narrowing techniques (typeof, instanceof, type predicates)
- Real-world API response handling example

### Blog 2: Building Reusable Components with Generics
Demonstrates how Generics enable flexible, type-safe code reuse. Covers:
- Problems solved by Generics
- Generic functions and constraints
- Generic interfaces and classes
- Real-world API response handler example
- Default generic values and keyof constraints

## 🚀 Usage

All solutions are exported from `solutions.ts` and can be imported and used as follows:

```typescript
import { 
  filterEvenNumbers, 
  reverseString, 
  checkType, 
  getProperty, 
  toggleReadStatus,
  Student,
  getIntersection 
} from './solutions';

// Example usage
const evens = filterEvenNumbers([1, 2, 3, 4, 5, 6]); // [2, 4, 6]
const reversed = reverseString("typescript"); // "tpircsepyt"
const student = new Student("Alice", 20, "A");
console.log(student.getDetails()); // "Name: Alice, Age: 20, Grade: A"
```

## ✅ Requirements Met

- ✓ All functions use exact names from problem specifications
- ✓ Output matches sample output exactly
- ✓ Clean, meaningful variable and class names
- ✓ No unnecessary comments or console.log statements
- ✓ Returns values instead of printing
- ✓ Two comprehensive blog posts in Markdown format
- ✓ Proper file structure and naming conventions
