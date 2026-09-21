import { apiRequest } from "./api";

export interface Student {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  progress: number;
  created_at: string;
}

export interface StudentCreatePayload {
  full_name: string;
  email: string;
  password: string;
}

export type StudentUpdatePayload = Partial
  Pick<Student, "full_name" | "email" | "status" | "progress">
>;

export function fetchStudents(): Promise<Student[]> {
  return apiRequest<Student[]>("/admin/students");
}

export function createStudent(payload: StudentCreatePayload): Promise<Student> {
  return apiRequest<Student>("/admin/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStudent(
  id: string,
  payload: StudentUpdatePayload
): Promise<Student> {
  return apiRequest<Student>(`/admin/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteStudent(id: string): Promise<void> {
  await apiRequest<void>(`/admin/students/${id}`, { method: "DELETE" });
}