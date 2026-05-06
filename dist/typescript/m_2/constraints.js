const StudentsObject = (student) => {
    return student;
};
StudentsObject({
    name: 'John Doe',
    age: 20,
    grade: 'A', FDLKFJDLKFJ: 'DFKJDFLKJDLKFJ',
    KLDFJDLKJFDLJ: "FDLFKJDLKFJD"
});
function identity(value) {
    return value;
}
const result1 = identity("hello");
function getLength(item) {
    return item.length;
}
const len1 = getLength("TypeScript");
const len2 = getLength([1, 2, 3]);
function getProperty(obj, key) {
    return obj[key];
}
const user = {
    name: "Shakil",
    age: 25,
};
const userName = getProperty(user, "name");
function printUser(user) {
    return `${user.id}-${user.name}`;
}
const u = printUser({ id: 1, name: "John" });
export {};
//# sourceMappingURL=constraints.js.map