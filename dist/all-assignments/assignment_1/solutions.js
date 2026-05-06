// Problem 1: Filter Even Numbers
function filterEvenNumbers(numbers) {
    return numbers.filter((num) => num % 2 === 0);
}
// Problem 2: Reverse String
function reverseString(str) {
    return str.split("").reverse().join("");
}
function checkType(value) {
    if (typeof value === "string") {
        return "String";
    }
    return "Number";
}
// Problem 4: Generic Function with Constraints
function getProperty(obj, key) {
    return obj[key];
}
function toggleReadStatus(book) {
    return {
        ...book,
        isRead: true,
    };
}
// Problem 6: Class with Inheritance
class Person {
    name;
    age;
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
class Student extends Person {
    grade;
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    getDetails() {
        return `Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
    }
}
// Problem 7: Array Intersection
function getIntersection(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.filter((num) => set2.has(num));
}
export {};
//# sourceMappingURL=solutions.js.map