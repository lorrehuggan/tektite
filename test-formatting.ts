const user = { name: "john", age: 25, email: "john@example.com" };

function getUserInfo(id: number): string {
  if (id < 1) {
    return "Invalid ID";
  }
  const result = `User: ${user.name}, Age: ${user.age}`;
  return result;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);

export { getUserInfo, user, doubled };
