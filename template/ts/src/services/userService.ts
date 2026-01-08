// 유저 데이터 타입 정의
interface User {
  id: number;
  name: string;
  email: string;
}

export const fetchAllUsers = async (): Promise<User[]> => {
  // 실제 DB 연동 대신 샘플 데이터를 반환합니다.
  return [
    { id: 1, name: 'Owner', email: 'owner@example.com' },
    { id: 2, name: 'Gemini', email: 'gemini@ai.com' },
  ];
};