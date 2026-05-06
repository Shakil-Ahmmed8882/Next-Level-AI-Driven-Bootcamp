type GenericArray<T> = Array<T>;

const numberArray: GenericArray<number> = [1, 2, 3, 4, 5];
const stringArray: GenericArray<string> = ['a', 'b', 'c', 'd'];

type GenericTuple<X, Y> = [X, Y];

type Coordinates<X, Y> = [X, Y];

const point1: Coordinates<number, number> = [343, 34834];
const point2: Coordinates<string, string> = ['343', '34834'];
const point3: Coordinates<boolean, boolean> = [true, false];

type User = {
  name: string;
  age: number;
  nationality: string;
};

const userList: GenericArray<User> = [
  { name: 'John', age: 30, nationality: 'American' },
  { name: 'Jane', age: 25, nationality: 'British' },
  { name: 'Jack', age: 35, nationality: 'Canadian' },
  { name: 'Shakil', age: 24, nationality: 'Bangladeshi' },
];