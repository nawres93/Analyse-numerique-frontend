import { apiRequest } from "@/lib/api";


// ============================
// Interface Student
// ============================

export interface Student {

  id: string;

  full_name: string;

  email: string;

  role: string;

  progress: number;

  status: string;

}


// ============================
// Création étudiant
// ============================

export interface CreateStudent {

  full_name: string;

  email: string;

  password: string;

}


// ============================
// Modification étudiant
// ============================

export interface UpdateStudent {

  full_name?: string;

  email?: string;

  password?: string;

}



// ============================
// GET étudiants
// ============================

export async function getStudents(
  search?: string
): Promise<Student[]> {


  let url = "/admin/students";


  if(search && search.trim() !== ""){

    url += `?search=${encodeURIComponent(search)}`;

  }


  return apiRequest<Student[]>(url);

}



// ============================
// POST étudiant
// ============================

export async function createStudent(
  data: CreateStudent
): Promise<Student> {


  return apiRequest<Student>(
    "/admin/students",
    {
      method:"POST",
      body: JSON.stringify(data),
    }
  );

}



// ============================
// PUT étudiant
// ============================

export async function updateStudent(
  id:string,
  data:UpdateStudent
): Promise<Student>{


  return apiRequest<Student>(
    `/admin/students/${id}`,
    {
      method:"PUT",
      body:JSON.stringify(data),
    }
  );

}



// ============================
// DELETE étudiant
// ============================

export async function deleteStudent(
  id:string
){


  return apiRequest(
    `/admin/students/${id}`,
    {
      method:"DELETE",
    }
  );

}





// =====================================================
// ====================== COURSES ======================
// =====================================================



export interface Course {

  id: string;

  title: string;

  code: string;

  description?: string;

  status: string;

}



// ============================
// GET courses
// ============================

export async function getCourses(
  search?: string
): Promise<Course[]> {


  let url = "/admin/courses";


  if(search && search.trim() !== ""){

    url += `?search=${encodeURIComponent(search)}`;

  }


  return apiRequest<Course[]>(url);

}



// ============================
// CREATE course
// ============================

export async function createCourse(
  data: {
    title:string;
    code:string;
    description?:string;
    status?:string;
  }
): Promise<Course>{


  return apiRequest<Course>(
    "/admin/courses",
    {

      method:"POST",

      body:JSON.stringify(data),

    }
  );

}



// ============================
// UPDATE course
// ============================

export async function updateCourse(
  id:string,
  data:Partial<Course>
): Promise<Course>{


  return apiRequest<Course>(
    `/admin/courses/${id}`,
    {

      method:"PUT",

      body:JSON.stringify(data),

    }
  );

}



// ============================
// DELETE course
// ============================

export async function deleteCourse(
  id:string
){


  return apiRequest(
    `/admin/courses/${id}`,
    {

      method:"DELETE",

    }
  );

}


// =====================================================
// ====================== MODULES ======================
// =====================================================


export interface Module {

  id: string;

  title: string;

  code: string;

  description?: string;

  status: string;

  lessons?: number;

  resources?: number;

  visibility?: string;

}



// ============================
// GET modules
// ============================

export async function getModules(
  search?: string
): Promise<Module[]> {


  let url = "/admin/modules";


  if(search && search.trim() !== ""){

    url += `?search=${encodeURIComponent(search)}`;

  }


  return apiRequest<Module[]>(url);

}



// ============================
// CREATE module
// ============================

export async function createModule(
  data: {
    title:string;
    code:string;
    description?:string;
    status?:string;
  }
): Promise<Module>{


  return apiRequest<Module>(
    "/admin/modules",
    {

      method:"POST",

      body:JSON.stringify(data),

    }
  );

}



// ============================
// UPDATE module
// ============================

export async function updateModule(
  id:string,
  data:Partial<Module>
): Promise<Module>{


  return apiRequest<Module>(
    `/admin/modules/${id}`,
    {

      method:"PUT",

      body:JSON.stringify(data),

    }
  );

}



// ============================
// DELETE module
// ============================

export async function deleteModule(
  id:string
){


  return apiRequest(
    `/admin/modules/${id}`,
    {

      method:"DELETE",

    }
  );

}


export async function publishModule(
id:string
){

return apiRequest(
`/admin/modules/${id}/publish`,
{
method:"PUT"
}
);

}



// =====================================================
// ====================== QUIZZES =======================
// =====================================================

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  status: string;
  questions: number;
  time: number;
  attempts: number;
}


// ============================
// GET quizzes
// ============================

export async function getQuizzes(
  search?: string
): Promise<Quiz[]> {

  let url = "/admin/quizzes/";

  if (search && search.trim() !== "") {
    url += `?search=${encodeURIComponent(search)}`;
  }

  return apiRequest<Quiz[]>(url);
}


// ============================
// GET quiz by ID
// ============================

export async function getQuiz(
  id: string
): Promise<Quiz> {

  return apiRequest<Quiz>(
    `/admin/quizzes/${id}`
  );
}


// ============================
// CREATE quiz
// ============================

export async function createQuiz(
  data: {
    title: string;
    description?: string;
    status?: string;
    time?: number;
  }
): Promise<Quiz> {

  return apiRequest<Quiz>(
    "/admin/quizzes/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}


// ============================
// UPDATE quiz
// ============================

export async function updateQuiz(
  id: string,
  data: Partial<Quiz>
): Promise<Quiz> {

  return apiRequest<Quiz>(
    `/admin/quizzes/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}


// ============================
// DELETE quiz
// ============================

export async function deleteQuiz(
  id: string
) {

  return apiRequest(
    `/admin/quizzes/${id}`,
    {
      method: "DELETE",
    }
  );
}


// ============================
// PUBLISH quiz
// ============================

export async function publishQuiz(
  id: string
) {

  return apiRequest(
    `/admin/quizzes/${id}/publish`,
    {
      method: "PUT",
    }
  );
}

export interface AdminStats {
  total_students: number;
  active_users: number;
  total_modules: number;
  published_modules: number;
  total_quizzes: number;
  published_quizzes: number;
  completion_rate: number;
}

export interface UserGrowthItem {
  month: string;
  students: number;
}

export interface ModuleUsageItem {
  name: string;
  value: number;
}

export interface Analytics {
  user_growth: UserGrowthItem[];
  module_usage: ModuleUsageItem[];
  engagement: UserGrowthItem[];
  completion_rate: number;
  average_grade: number;
  total_attempts: number;
}

export interface Report {
  title: string;
  description: string;
  type: string;
}


export async function getAdminStats(): Promise<AdminStats> {
  return apiRequest<AdminStats>("/admin/stats");
}

export async function getAdminAnalytics(): Promise<Analytics> {
  return apiRequest<Analytics>("/admin/analytics");
}

export async function getAdminReports(): Promise<Report[]> {
  const response = await apiRequest<{ reports: Report[] }>("/admin/reports");

  return response.reports;
}