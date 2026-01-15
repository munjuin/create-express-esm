interface User {
  id: number;
  name: string;
  role: string;
}

export const findAllUsers = async (): Promise<User[]> => {
  return [
    { id: 1, name: "Developer", role: "Fullstack" },
    { id: 2, name: "Genius AI", role: "Assistant" }
  ];
};