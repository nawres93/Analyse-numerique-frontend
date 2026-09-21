import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  FileQuestion,
  TrendingUp,
  LogOut,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Upload,
  Plus,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  ShieldCheck,
  GraduationCap,
  Bell,
  Pencil,
  Trash2,
  Play,
  Database,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { RoleGate } from "@/components/site/RoleGate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";


import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  Student,
  getCourses, 
  createCourse,  // <--- AJOUT
  updateCourse, 
  deleteCourse,// <--- AJOUT
  Course,
  getModules,
  createModule,
  updateModule,
  publishModule,
  Module,
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  Quiz,
    getAdminStats,
  getAdminAnalytics,
  getAdminReports,
  AdminStats,
  Analytics,
  Report,
} from "@/services/adminService";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · NumLab" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RoleGate role="admin">
      <AdminPage />
    </RoleGate>
  ),
});

const themeColors = ["#e11d48", "#fb7185", "#0f172a", "#f59e0b"];

function AdminPage() {
  const { user, signOut } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(false); 
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [modules,setModules] = useState<Module[]>([]);


  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);

const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

const [adminStats, setAdminStats] =
  useState<AdminStats | null>(null);

const [analytics, setAnalytics] =
  useState<Analytics | null>(null);

const [reports, setReports] =
  useState<Report[]>([]);

  const adminUsage = analytics?.module_usage ?? [];
const adminGrowth = analytics?.user_growth ?? [];

const [isLoadingAnalytics, setIsLoadingAnalytics] =
  useState(false);
const [isCreateQuizDialogOpen, setIsCreateQuizDialogOpen] =
  useState(false);

const [isEditQuizDialogOpen, setIsEditQuizDialogOpen] =
  useState(false);

const [newQuiz, setNewQuiz] = useState({
  title: "",
  description: "",
  status: "Draft",
  time: 20,
});
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);

  const [editingModule, setEditingModule] = useState<Module | null>(null);
const [isEditModuleDialogOpen, setIsEditModuleDialogOpen] = useState(false);
const [selectedFile,setSelectedFile]=useState<File | null>(null);



  const [isCreateCourseDialogOpen, setIsCreateCourseDialogOpen] =
useState(false);


const [newCourse, setNewCourse] = useState({
  title:"",
  code:"",
  description:""
});

const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
// <--- AJOUT : État de chargement
  const [newStudent, setNewStudent] = useState({
    full_name: "",
    email: "",
    password: ""
  });

  const stats = [
  {
    icon: Users,
    label: "Total students",
    value: adminStats?.total_students?.toString() ?? "0",
    delta: "Total registered students",
  },
  {
    icon: ShieldCheck,
    label: "Active users",
    value: adminStats?.active_users?.toString() ?? "0",
    delta: "Currently active",
  },
  {
    icon: BookOpen,
    label: "Modules",
    value: adminStats?.total_modules?.toString() ?? "0",
    delta: `${adminStats?.published_modules ?? 0} published`,
  },
  {
    icon: FileQuestion,
    label: "Quizzes",
    value: adminStats?.total_quizzes?.toString() ?? "0",
    delta: `${adminStats?.published_quizzes ?? 0} published`,
  },
  {
    icon: TrendingUp,
    label: "Completion rate",
    value: `${adminStats?.completion_rate ?? 0}%`,
    delta: "Platform completion",
  },
];

  // MODIFICATION : On attend que l'utilisateur soit présent avant de lancer la requête
  useEffect(() => {
    if (user) {
      loadStudents(search);
      loadCourses(search);
      loadModules(search);
      loadQuizzes(search); // <--- AJOUT : Chargement des quizzes

      
    }
  }, [search, user]);
  
  useEffect(() => {

  if (!user) return;

  loadAdminAnalytics();

}, [user]);// <--- AJOUT de user dans les dépendances

  // MODIFICATION : Gestion propre du chargement et du message d'erreur
  async function loadStudents(searchValue?: string) {
    setIsLoadingStudents(true);
    try {
      const data = await getStudents(searchValue);
      console.log("API RESPONSE:", data);
      setStudents(Array.isArray(data) ? data : []); // Sécurité si l'API ne renvoie pas un tableau
    } catch (error: any) {
      console.error("Erreur de chargement des étudiants :", error);
      
      // Si le token est expiré ou invalide, on peut forcer la déconnexion locale
      if (error.message?.includes("Token") || error.message?.includes("401")) {
        signOut?.(); 
      }
    } finally {
      setIsLoadingStudents(false);
    }
  }



  async function handleUpdateStudent(e: React.FormEvent) {
  e.preventDefault();
  if (!editingStudent) return;

  try {
    await updateStudent(editingStudent.id, {
      full_name: editingStudent.full_name,
      email: editingStudent.email,
    });
    
    setIsEditDialogOpen(false);
    setEditingStudent(null);
    loadStudents(search); // Recharge la liste mise à jour
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
  }
}


  async function loadCourses(searchValue?: string) {
    setIsLoadingCourses(true);
    try {
      const data = await getCourses(searchValue);
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur de chargement des cours depuis FastAPI :", error);
    } finally {
      setIsLoadingCourses(false);
    }
  }


  async function loadModules(searchValue?:string){

  try{

    const data = await getModules(searchValue);

    setModules(
 data.map((m:any)=>({
   ...m,
   id:m.id ?? m._id
 }))
);

  }
  catch(error){

    console.error(
      "Erreur chargement modules :",
      error
    );

  }

}



async function loadQuizzes(searchValue?: string) {

  setIsLoadingQuizzes(true);

  try {

    const data = await getQuizzes(searchValue);

    console.log("QUIZZES API RESPONSE :", data);

    setQuizzes(
      Array.isArray(data)
        ? data.map((quiz: any) => ({
            ...quiz,
            id: quiz.id ?? quiz._id,
          }))
        : []
    );

  } catch (error) {

    console.error(
      "Erreur chargement quizzes :",
      error
    );

  } finally {

    setIsLoadingQuizzes(false);

  }
}


async function loadAdminAnalytics() {

  setIsLoadingAnalytics(true);

  try {

    const [
      statsData,
      analyticsData,
      reportsData
    ] = await Promise.all([

      getAdminStats(),

      getAdminAnalytics(),

      getAdminReports()

    ]);

    console.log("ADMIN STATS :", statsData);

    console.log(
      "ADMIN ANALYTICS :",
      analyticsData
    );

    console.log(
      "ADMIN REPORTS :",
      reportsData
    );

    setAdminStats(statsData);

    setAnalytics(analyticsData);

    setReports(reportsData);

  } catch (error) {

    console.error(
      "Erreur chargement Analytics / Reports :",
      error
    );

  } finally {

    setIsLoadingAnalytics(false);

  }
}



async function handleCreateQuiz() {
  try {
    console.log("CREATE QUIZ :", newQuiz);

    await createQuiz({
      title: newQuiz.title,
      description: newQuiz.description,
      status: newQuiz.status,
      time: newQuiz.time,
    });

    // Réinitialiser le formulaire
    setNewQuiz({
      title: "",
      description: "",
      status: "Draft",
      time: 20,
    });

    // Fermer le dialog
    setIsCreateQuizDialogOpen(false);

    // Recharger les quizzes depuis FastAPI
    await loadQuizzes(search);

    console.log("Quiz créé avec succès");

  } catch (error) {
    console.error("Erreur création quiz :", error);
  }
}

  async function handleUpdateCourse(e: React.FormEvent) {
    e.preventDefault();

    console.log("UPDATE COURSE :", editingCourse);
    if (!editingCourse) return;

    try {
      await updateCourse(editingCourse.id, {
        title: editingCourse.title,
        code: editingCourse.code,
        status: editingCourse.status,
      });
      
      setIsEditCourseDialogOpen(false);
      setEditingCourse(null);
      loadCourses(search); // Recharge depuis FastAPI
    } catch (error) {
      console.error("Erreur lors de la modification du cours :", error);
    }
  }


  async function handleCreateCourse(){

try{

await createCourse({
  ...newCourse,
  status:"Draft"
});


setNewCourse({
 title:"",
 code:"",
 description:""
});


setIsCreateCourseDialogOpen(false);


loadCourses(search);


}
catch(error){

console.error(
"Erreur création course",
error
);

}

}

function handleEditModule(mod: Module) {
  console.log("EDIT MODULE :", mod);

  setEditingModule({
    ...mod,
    id: mod.id ?? "",
    title: mod.title ?? "",
    code: mod.code ?? "",
    description: mod.description ?? "",
    status: mod.status ?? "Draft",
  });

  setIsEditModuleDialogOpen(true);
}

async function handleUpdateModule(e: React.FormEvent) {
  e.preventDefault();

  if (!editingModule) return;

  try {
    console.log("UPDATE MODULE :", editingModule);

    await updateModule(editingModule.id, {
      title: editingModule.title,
      code: editingModule.code,
      description: editingModule.description,
      status: editingModule.status,
    });

    setIsEditModuleDialogOpen(false);
    setEditingModule(null);

    await loadModules(search);

  } catch (error) {
    console.error("Erreur modification module :", error);
  }
}

function handlePreviewModule(mod: Module) {
  console.log("Preview module :", mod);

  alert(`Preview du module : ${mod.title}`);
}

async function handlePublishModule(mod: Module) {
  try {
    console.log("Publish :", mod);

    if (!mod.id) {
      console.error("ID module manquant :", mod);
      return;
    }

    await publishModule(String(mod.id));

    await loadModules(search);

  } catch (error) {
    console.error("Erreur publication module :", error);
  }
}


function handleUploadAssets(
e: React.ChangeEvent<HTMLInputElement>
){

const file = e.target.files?.[0];

if(file){

setSelectedFile(file);

console.log(
"Fichier sélectionné :",
file.name
);

}

}



  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold text-navy">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)]">
              Σ
            </span>
            <span>
              NumLab<span className="text-brand">.</span>
            </span>
            <Badge variant="secondary" className="ml-2">Admin</Badge>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden md:inline-flex">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-navy">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <Card className="overflow-hidden border-border/60 bg-[image:var(--gradient-navy)] p-6 text-navy-foreground shadow-[var(--shadow-elegant)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand/80">
                  Admin command center
                </p>
                <h1 className="mt-2 font-display text-3xl font-bold">
                  Manage students, courses, quizzes and analytics in one place.
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-navy-foreground/75">
                  A premium operations dashboard for ESPRIT-style numerical analysis education:
                  track growth, publish modules, review quizzes, export reports and monitor platform usage.
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-[image:var(--gradient-brand)] text-brand-foreground shadow-[var(--shadow-glow)] hover:opacity-95">
                  <Plus className="mr-2 h-4 w-4" /> New module
                </Button>
                <Button variant="outline" className="border-white/20 bg-white/5 text-navy-foreground hover:bg-white/10">
                  <Download className="mr-2 h-4 w-4" /> Export reports
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border-border/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Platform health</p>
                <h2 className="mt-1 text-xl font-semibold text-navy">Live status</h2>
              </div>
              <Activity className="h-5 w-5 text-brand" />
            </div>
            <div className="mt-5 space-y-4">
              {[
                ["API latency", "182 ms", 72],
                ["Quiz grading queue", "14 pending", 44],
                ["Storage usage", "68%", 68],
              ].map(([label, value, progress]) => (
                <div key={label as string}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-navy">{value}</span>
                  </div>
                  <Progress value={Number(progress)} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((s) => (
            <Card key={s.label} className="border-border/60 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 font-display text-2xl font-bold text-navy">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-xs text-brand">{s.delta}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <TabsList className="grid h-auto grid-cols-2 gap-1 rounded-2xl bg-card p-1 shadow-sm sm:grid-cols-4 xl:grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
              <Button variant="outline"><Search className="mr-2 h-4 w-4" /> Search</Button>
              <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
            </div>
          </div>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <Card className="border-border/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">User growth</p>
                    <h3 className="mt-1 text-lg font-semibold text-navy">Students joined over time</h3>
                  </div>
                  <BarChart3 className="h-5 w-5 text-brand" />
                </div>
                <div className="mt-5 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adminGrowth}>
                      <defs>
                        <linearGradient id="growthFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#e11d48" stopOpacity={0.45} />
                          <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip />
                      <Area type="monotone" dataKey="students" stroke="#e11d48" fill="url(#growthFill)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="border-border/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Usage split</p>
                    <h3 className="mt-1 text-lg font-semibold text-navy">Most visited modules</h3>
                  </div>
                  <PieChart className="h-5 w-5 text-brand" />
                </div>
                <div className="mt-5 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip />
                      <Pie
  data={adminUsage}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  innerRadius={62}
  outerRadius={92}
  paddingAngle={4}
>
  {adminUsage.map((entry, index) => (
    <Cell
      key={entry.name}
      fill={themeColors[index % themeColors.length]}
    />
  ))}
</Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/60 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-navy">Latest student activity</h3>
                  <Button variant="ghost" size="sm">View all</Button>
                </div>
                <div className="mt-4 space-y-3">
                  {students.slice(0, 4).map((student) => (
                    <div key={student.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3">
                      <div>
                        <p className="font-medium text-navy">{student.full_name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                      <Badge variant="secondary">{student.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-border/60 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-navy">Quick actions</h3>
                  <Database className="h-5 w-5 text-brand" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    "Import students",
                    "Publish module",
                    "Review quizzes",
                    "Generate report",
                    "Upload MANIM video",
                    "Schedule announcement",
                  ].map((action) => (
                    <Button key={action} variant="outline" className="justify-start h-auto py-3">
                      {action}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="mt-6">
            <Card className="border-border/60 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy">Student Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Search, filter, edit, assign modules and export data.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Input
  placeholder="Search students..."
  className="w-full md:w-72"
  value={search}
  onChange={(e)=>{

    setSearch(e.target.value);

  }}
/>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button><Plus className="mr-2 h-4 w-4" /> Add student</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add student</DialogTitle>
                        <DialogDescription>Create a new student account and assign cohorts.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Input
placeholder="Full name"
value={newStudent.full_name}
onChange={(e)=>
setNewStudent({

 ...newStudent,

 full_name:e.target.value

})
}
/>


<Input
placeholder="Email"
value={newStudent.email}
onChange={(e)=>
setNewStudent({

 ...newStudent,

 email:e.target.value

})
}
/>


<Input
placeholder="Password"
type="password"
value={newStudent.password}
onChange={(e)=>
setNewStudent({

 ...newStudent,

 password:e.target.value

})
}
/>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button

onClick={async()=>{

try{

 await createStudent(newStudent);


 await loadStudents();


 setNewStudent({

  full_name:"",
  email:"",
  password:""

 });


}

catch(error){

 console.error(
  "Erreur création étudiant",
  error
 );

}

}}

>
 Save student
</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium text-navy">{student.full_name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.role}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Progress value={student.progress} className="h-2 w-28" />
                            <span className="text-xs text-muted-foreground">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1">
                            <Button

variant="ghost"

size="icon"

onClick={async()=>{


await updateStudent(

 student.id,

 {

 full_name:student.full_name,

 email:student.email

 }

);


loadStudents();


}}

>

<span
  onClick={() => {
    setEditingStudent(student); // "student" correspond à la variable de votre boucle .map
    setIsEditDialogOpen(true);
  }}
  className="cursor-pointer inline-block p-1 text-muted-foreground hover:text-brand transition-colors"
>
  <Pencil className="h-4 w-4" />
</span>


</Button>
                            <Button
variant="ghost"
size="icon"
onClick={async()=>{

 await deleteStudent(student.id);

await loadStudents(search);

}}
>
<Trash2 className="h-4 w-4" />
</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="courses" className="mt-6">

<Card className="border-border/60 p-6">

<div className="flex justify-between items-center">

<div>
<h3 className="text-lg font-semibold text-navy">
Course Management
</h3>

<p className="text-sm text-muted-foreground">
Manage courses from FastAPI MongoDB
</p>

</div>


<Button
onClick={()=>{
 setIsCreateCourseDialogOpen(true);
}}
>
<Plus className="mr-2 h-4 w-4"/>
Add Course
</Button>


</div>


{/* ===== CREATE COURSE DIALOG ICI ===== */}

<Dialog
open={isCreateCourseDialogOpen}
onOpenChange={setIsCreateCourseDialogOpen}
>

<DialogContent>

<DialogHeader>

<DialogTitle>
Add Course
</DialogTitle>

<DialogDescription>
Create a new course
</DialogDescription>

</DialogHeader>


<Input
placeholder="Title"
value={newCourse.title}
onChange={(e)=>
setNewCourse({
...newCourse,
title:e.target.value
})
}
/>


<Input
placeholder="Code"
value={newCourse.code}
onChange={(e)=>
setNewCourse({
...newCourse,
code:e.target.value
})
}
/>


<Input
placeholder="Description"
value={newCourse.description}
onChange={(e)=>
setNewCourse({
...newCourse,
description:e.target.value
})
}
/>

<Button
onClick={() => {
  console.log("NEW COURSE:", newCourse);
  handleCreateCourse();
}}
>
Save Course
</Button>



</DialogContent>

</Dialog>

{/* ===== FIN CREATE COURSE ===== */}


<div className="mt-5 overflow-hidden rounded-2xl border">

<Table>

<TableHeader>

<TableRow>

<TableHead>Title</TableHead>

<TableHead>Code</TableHead>

<TableHead>Status</TableHead>

<TableHead>Actions</TableHead>

</TableRow>

</TableHeader>



<TableBody>


{
courses.map((course)=>(

<TableRow key={course.id}>


<TableCell className="font-medium">

{course.title}

</TableCell>



<TableCell>

{course.code}

</TableCell>



<TableCell>

<Badge>

{course.status}

</Badge>

</TableCell>



<TableCell>

<div className="flex gap-2">


<Button

variant="ghost"

size="icon"

onClick={()=>{

setEditingCourse(course);

setIsEditCourseDialogOpen(true);

}}

>

<Pencil className="h-4 w-4"/>

</Button>



<Button

variant="ghost"

size="icon"

onClick={async()=>{

await deleteCourse(
String(course.id)
);

loadCourses(search);

}}

>

<Trash2 className="h-4 w-4"/>

</Button>


</div>


</TableCell>



</TableRow>


))

}


</TableBody>


</Table>


</div>


</Card>


</TabsContent>

          <TabsContent value="modules" className="mt-6">
            <Card className="border-border/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy">Module Management</h3>
                  <p className="text-sm text-muted-foreground">CRUD, uploads, resources and publication control.</p>
                </div>
                <label>

<input
type="file"
hidden
onChange={handleUploadAssets}
/>


<Button asChild>

<span>
<Upload className="mr-2 h-4 w-4"/>
Upload assets
</span>

</Button>


</label>
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {modules.map((mod) => (
                  <Card key={mod.title} className="border-border/60 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-navy">{mod.title}</p>
                        <p className="text-sm text-muted-foreground">{mod.description}</p>
                      </div>
                      <Badge>{mod.status}</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Lessons</p>
                        <p className="font-medium text-navy">{mod.lessons}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resources</p>
                        <p className="font-medium text-navy">{mod.resources}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Visibility</p>
                        <p className="font-medium text-navy">{mod.visibility}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">

<Button
variant="outline"
size="sm"
onClick={() => handleEditModule(mod)}
>
Edit
</Button>


<Button
variant="outline"
size="sm"
onClick={() => handlePreviewModule(mod)}
>
Preview
</Button>


<Button
variant="outline"
size="sm"
onClick={() => handlePublishModule(mod)}
>
Publish
</Button>

</div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <Card className="border-border/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Quiz Management</h3>
                    <p className="text-sm text-muted-foreground">Question bank, automatic grading and authoring flow.</p>
                  </div>
                  <Button onClick={() => setIsCreateQuizDialogOpen(true)}>
  <Plus className="mr-2 h-4 w-4" /> Create quiz
</Button>
                </div>
                <div className="mt-4 space-y-3">
                  {quizzes.map((quiz) => (
                    <div key={quiz.title} className="rounded-2xl border border-border/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-navy">{quiz.title}</p>
                          <p className="text-sm text-muted-foreground">{quiz.description}</p>
                        </div>
                        <Badge variant={quiz.status === "Published" ? "default" : "secondary"}>{quiz.status}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{quiz.questions} questions</span>
                        <span>•</span>
                        <span>{quiz.time} minutes</span>
                        <span>•</span>
                        <span>{quiz.attempts} attempts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border-border/60 p-6">
                <h3 className="text-lg font-semibold text-navy">Quiz Insights</h3>
                <div className="mt-4 space-y-4">
                  {[
                    ["Average grade", "87%", 87],
                    ["Completion rate", "74%", 74],
                    ["On-time submissions", "91%", 91],
                  ].map(([label, value, progress]) => (
                    <div key={label as string}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-navy">{value}</span>
                      </div>
                      <Progress value={Number(progress)} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/60 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-navy">Analytics</h3>
                <p className="text-sm text-muted-foreground">Engagement, completion, scores and time spent.</p>
                <div className="mt-5 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adminUsage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip />
                      <Area type="monotone" dataKey="engagement" stroke="#0f172a" fill="#0f172a22" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="border-border/60 p-6">
                <h3 className="text-lg font-semibold text-navy">Platform usage</h3>
                <div className="mt-4 space-y-3">
                  {adminUsage.map((item) => (
  <div
    key={item.name}
    className="flex items-center justify-between rounded-xl border border-border/60 p-3"
  >
    <span className="text-sm text-muted-foreground">
      {item.name}
    </span>

    <span className="font-medium text-navy">
      {item.value}%
    </span>
  </div>
))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card className="border-border/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-navy">Reports</h3>
                  <p className="text-sm text-muted-foreground">Generate PDF reports, CSV exports and summaries.</p>
                </div>
                <Button><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                {reports.map((report) => (
                  <Card key={report.title} className="border-border/60 p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-navy">{report.title}</p>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{report.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Button variant="outline" size="sm">Preview</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Dialog
  open={isEditCourseDialogOpen}
  onOpenChange={setIsEditCourseDialogOpen}
>

<DialogContent>

<DialogHeader>
<DialogTitle>
Modifier Course
</DialogTitle>

<DialogDescription>
Update course information
</DialogDescription>
</DialogHeader>


{editingCourse && (

<form
onSubmit={handleUpdateCourse}
className="space-y-4"
>


<Input
placeholder="Title"
value={editingCourse.title}
onChange={(e)=>
setEditingCourse({
...editingCourse,
title:e.target.value
})
}
/>


<Input
placeholder="Code"
value={editingCourse.code}
onChange={(e)=>
setEditingCourse({
...editingCourse,
code:e.target.value
})
}
/>


<Input
placeholder="Status"
value={editingCourse.status}
onChange={(e)=>
setEditingCourse({
...editingCourse,
status:e.target.value
})
}
/>



<DialogFooter>


<Button
type="button"
variant="outline"
onClick={()=>{
setIsEditCourseDialogOpen(false);
setEditingCourse(null);
}}
>
Cancel
</Button>


<Button
type="submit"
>
Save changes
</Button>


</DialogFooter>


</form>

)}

</DialogContent>

</Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Modifier l'étudiant</DialogTitle>
      <DialogDescription>
        Modifiez les informations de l'étudiant ci-dessous.
      </DialogDescription>
    </DialogHeader>
    
    {editingStudent && (
      <form onSubmit={handleUpdateStudent} className="space-y-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom complet</label>
          <Input
            value={editingStudent.full_name || ""}
            onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={editingStudent.email}
            onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
            required
          />
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" className="bg-brand text-brand-foreground hover:opacity-90">
            Enregistrer
          </Button>
        </DialogFooter>
      </form>
    )}
  </DialogContent>
</Dialog>
{/* =========================
    EDIT MODULE DIALOG
========================= */}

<Dialog
  open={isEditModuleDialogOpen}
  onOpenChange={setIsEditModuleDialogOpen}
>
  <DialogContent className="sm:max-w-[500px]">

    <DialogHeader>
      <DialogTitle>Modifier le module</DialogTitle>

      <DialogDescription>
        Modifiez les informations du module.
      </DialogDescription>
    </DialogHeader>

    {editingModule && (
      <form
        onSubmit={handleUpdateModule}
        className="space-y-4"
      >

        {/* TITLE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Titre
          </label>

          <Input
            value={editingModule.title || ""}
            onChange={(e) =>
              setEditingModule({
                ...editingModule,
                title: e.target.value,
              })
            }
          />
        </div>

        {/* CODE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Code
          </label>

          <Input
            value={editingModule.code || ""}
            onChange={(e) =>
              setEditingModule({
                ...editingModule,
                code: e.target.value,
              })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Description
          </label>

          <Input
            value={editingModule.description || ""}
            onChange={(e) =>
              setEditingModule({
                ...editingModule,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* STATUS */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Status
          </label>

          <Input
            value={editingModule.status || ""}
            onChange={(e) =>
              setEditingModule({
                ...editingModule,
                status: e.target.value,
              })
            }
          />
        </div>

        {/* BUTTONS */}
        <DialogFooter>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsEditModuleDialogOpen(false);
              setEditingModule(null);
            }}
          >
            Annuler
          </Button>

          <Button type="submit">
            Enregistrer
          </Button>

        </DialogFooter>

      </form>
    )}

  </DialogContent>
</Dialog>

<Dialog
  open={isCreateQuizDialogOpen}
  onOpenChange={setIsCreateQuizDialogOpen}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create quiz</DialogTitle>

      <DialogDescription>
        Create a new quiz.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">

      <Input
        placeholder="Quiz title"
        value={newQuiz.title}
        onChange={(e) =>
          setNewQuiz({
            ...newQuiz,
            title: e.target.value,
          })
        }
      />

      <Input
        placeholder="Description"
        value={newQuiz.description}
        onChange={(e) =>
          setNewQuiz({
            ...newQuiz,
            description: e.target.value,
          })
        }
      />

    </div>

    <DialogFooter>

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsCreateQuizDialogOpen(false);
        }}
      >
        Cancel
      </Button>

      <Button
        type="button"
        onClick={handleCreateQuiz}
      >
        Create quiz
      </Button>

    </DialogFooter>
  </DialogContent>
</Dialog>




    </div>
  );
}
