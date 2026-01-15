export const findAllUsers = async () => {
  // 실제 DB 연동 전 샘플 데이터
  return [
    { id: 1, name: "Developer", role: "Fullstack" },
    { id: 2, name: "Gemius AI", role: "Assistant" }
  ];
};