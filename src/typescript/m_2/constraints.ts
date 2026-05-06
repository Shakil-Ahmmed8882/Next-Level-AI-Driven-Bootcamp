

type Student = {name: string, age: number, grade: string};
const StudentsObject = <T extends Student>(student: T) => {
    return student;
} 



StudentsObject({
    name: 'John Doe',
    age: 20,
    grade: 'A',FDLKFJDLKFJ: 'DFKJDFLKJDLKFJ', 
    KLDFJDLKJFDLJ: "FDLFKJDLKFJD"
})


function identity<T extends string>(value: T): T {
  return value;
}

const result1 = identity("hello");

type HasLength = {
  length: number;
};

function getLength<T extends HasLength>(item: T): number {
  return item.length;
}

const len1 = getLength("TypeScript");
const len2 = getLength([1, 2, 3]);

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const user = {
  name: "Shakil",
  age: 25,
};

const userName = getProperty(user, "name");

type User = {
  id: number;
  name: string;
};

function printUser<T extends User>(user: T): string {
  return `${user.id}-${user.name}`;
}

const u = printUser({ id: 1, name: "John" });