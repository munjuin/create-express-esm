// 나중에는 여기서 Model(DB)을 호출합니다.
export const findAllUsers = async () => {
  // 비즈니스 로직 처리...
  return [
    { id: 1, name: "Developer Lee", role: "Fullstack" },
    { id: 2, name: "Genius AI", role: "Assistant" }
  ];
};