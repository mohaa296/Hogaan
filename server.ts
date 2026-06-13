import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;
const COURSES_FILE = path.join(process.cwd(), "courses.json");
const STUDENTS_FILE = path.join(process.cwd(), "students.json");
const NOTIFS_FILE = path.join(process.cwd(), "notifications.json");
const CHATS_FILE = path.join(process.cwd(), "chats.json");
const VERSION_FILE = path.join(process.cwd(), "version.json");
const SERVER_STARTUP_TIMESTAMP = Date.now().toString();

const defaultVersion = {
  version: "1.0.0",
  updatedAt: new Date().toLocaleDateString("so-SO"),
  msg: "Nidaamka cusub ee HOGAAN ayaa diyaar ah! / New update is available now."
};

const defaultChats = [
  {
    id: "system-welcome",
    senderId: "system",
    senderName: "HOGAAN Support",
    senderRole: "admin",
    text: "Ku soo dhawaada qolka wada-hadalka rasmiga ah ee dugsiga HOGAAN! Halkan waxaad kula sheekaysan kartaa ardayda kale iyo macalimiinta dugsiga.",
    timestamp: "12:00 PM"
  }
];

// Default initial courses to seed if courses.json is empty
const defaultCourses = [
  {
    id: "c-video-editing",
    title: "Video Editing Course",
    teacher: "Eng. Hamza Salad",
    description: "Baro jar-jaridda iyo habaynta muuqaalada heerka sare ah adoo adeegsanaya Premiere Pro iyo After Effects.",
    icon: "fa-video",
    color: "bg-pink-500",
    level: "Bilow (Level 1)",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    createdAt: "10/06/2026"
  },
  {
    id: "c-graphic-design",
    title: "Graphic Design Course",
    teacher: "Ustaad Zakaria Omar",
    description: "Baro naqshadaynta xiga-sare ee calaamadaha, boorarka iyo muuqaalada adoo isticmaalaya Photoshop & Illustrator.",
    icon: "fa-palette",
    color: "bg-purple-500",
    level: "Bilow (Level 1)",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    createdAt: "10/06/2026"
  },
  {
    id: "c-web-dev",
    title: "Web Development Course",
    teacher: "Dr. Abdirahman Farah",
    description: "Baro dhisidda shabakadaha casriga ah adoo isticmaalaya HTML, CSS, React iyo Node.js.",
    icon: "fa-laptop-code",
    color: "bg-blue-500",
    level: "Bilow (Level 1)",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    createdAt: "10/06/2026"
  },
  {
    id: "c-digital-marketing",
    title: "Digital Marketing Course",
    teacher: "Sahra Mohamed Gure",
    description: "Baro xayeysiinta baraha bulshada, SEO, Google Ads iyo kobcinta ganacsiyada digital-ka ah.",
    icon: "fa-bullhorn",
    color: "bg-orange-500",
    level: "Bilow (Level 1)",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    createdAt: "10/06/2026"
  }
];

// Helper to read JSON safely
function readJSON(filePath: string, defaultVal: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return defaultVal;
}

// Helper to write JSON safely
function writeJSON(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// SSE Clients keeper
let sseClients: { id: number; res: any }[] = [];

// Broadcast utility
function broadcast(type: string, data: any) {
  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
    } catch (err) {
      console.error("Error sending SSE to client", client.id, err);
    }
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // Seed default courses if file doesn't exist
  if (!fs.existsSync(COURSES_FILE)) {
    writeJSON(COURSES_FILE, defaultCourses);
  }

  // Seed default chats if file doesn't exist
  if (!fs.existsSync(CHATS_FILE)) {
    writeJSON(CHATS_FILE, defaultChats);
  }

  // Seed default version if it doesn't exist
  if (!fs.existsSync(VERSION_FILE)) {
    writeJSON(VERSION_FILE, defaultVersion);
  }

  // API For Chats (Wada-hadalka)
  app.get("/api/chats", (req, res) => {
    const chats = readJSON(CHATS_FILE, defaultChats);
    res.json(chats);
  });

  app.post("/api/chats", (req, res) => {
    const chats = readJSON(CHATS_FILE, defaultChats);
    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: req.body.senderId,
      senderName: req.body.senderName,
      senderRole: req.body.senderRole || "student",
      text: req.body.text || "",
      imageUrl: req.body.imageUrl || undefined,
      timestamp: new Date().toLocaleTimeString("so-SO", { hour: "2-digit", minute: "2-digit" })
    };
    chats.push(newMessage);
    // Keep last 150 chat messages to avoid infinite file growth
    const trimmedChats = chats.slice(-150);
    writeJSON(CHATS_FILE, trimmedChats);
    broadcast("new_chat_message", newMessage);
    res.status(201).json(newMessage);
  });

  // Real-time Event Stream endpoint
  app.get("/api/updates/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    sseClients.push(newClient);

    // Heartbeat to keep connection alive in cloud environments
    const keepAlive = setInterval(() => {
      res.write(": heartbeat\n\n");
    }, 25000);

    req.on("close", () => {
      clearInterval(keepAlive);
      sseClients = sseClients.filter(c => c.id !== clientId);
    });
  });

  // API 1: Fetch Courses
  app.get("/api/courses", (req, res) => {
    const courses = readJSON(COURSES_FILE, defaultCourses);
    res.json(courses);
  });

  // API 2: Add Course
  app.post("/api/courses", (req, res) => {
    const courses = readJSON(COURSES_FILE, defaultCourses);
    const newCourse = req.body;
    courses.push(newCourse);
    writeJSON(COURSES_FILE, courses);
    broadcast("course_added", newCourse);
    res.status(201).json(newCourse);
  });

  // API 3: Delete Course
  app.delete("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    let courses = readJSON(COURSES_FILE, defaultCourses);
    courses = courses.filter((c: any) => c.id !== id);
    writeJSON(COURSES_FILE, courses);
    broadcast("course_deleted", { id });
    res.json({ success: true, id });
  });

  // API 4: Fetch Students
  app.get("/api/students", (req, res) => {
    const students = readJSON(STUDENTS_FILE, []);
    res.json(students);
  });

  // API 5: Register / Add Student
  app.post("/api/students", (req, res) => {
    const students = readJSON(STUDENTS_FILE, []);
    const newStudent = req.body;
    students.push(newStudent);
    writeJSON(STUDENTS_FILE, students);
    broadcast("student_registered", newStudent);
    res.status(201).json(newStudent);
  });

  // API 6: Update status (Approve/Reject)
  app.post("/api/students/:id/:action", (req, res) => {
    const { id, action } = req.params;
    const students = readJSON(STUDENTS_FILE, []);
    const student = students.find((s: any) => s.id === id);
    
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (action === "approve") {
      student.status = "APPROVED";
      // Add a notification
      const notifications = readJSON(NOTIFS_FILE, []);
      const newNotif = {
        id: Math.random().toString(36).substr(2, 9),
        studentId: student.id,
        studentName: student.fullName,
        message: `Fariin hambalyo ah ayaa loo diray ${student.fullName} (${student.phone}).`,
        timestamp: new Date().toLocaleTimeString("so-SO"),
        type: "success"
      };
      notifications.unshift(newNotif);
      writeJSON(NOTIFS_FILE, notifications.slice(0, 20));
      broadcast("student_approved", { student, notification: newNotif });
    } else if (action === "reject") {
      student.status = "REJECTED";
      broadcast("student_rejected", { student });
    }

    writeJSON(STUDENTS_FILE, students);
    res.json({ student, success: true });
  });

  // API 7: Fetch Notifications (Toasts logs)
  app.get("/api/notifications", (req, res) => {
    const notifications = readJSON(NOTIFS_FILE, []);
    res.json(notifications);
  });

  // API 8: Fetch AI Insights
  app.post("/api/gemini/insights", async (req, res) => {
    const { students } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key is not configured inside server environment variables." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const studentDataSummary = students.map((s: any) => 
        `- ${s.fullName}: Wadanka: ${s.country}, Nooca: ${s.registrationType}${s.amount ? `, Lacagta: ${s.amount} ${s.currency}` : ""}`
      ).join("\n");

      const prompt = `
        Waxaad tahay kaaliye caqli badan oo maamula nidaamka HOGAAN (Online Learning System). 
        Waa kuwan xogta qaar ka mid ah ardayda diwaangashan:
        ${studentDataSummary}
        
        Fadlan iisoo koob xogtan (Somali language):
        1. Wadarta tirada ardayda iyo dakhliga kala duwan (USD iyo ETB) ee soo xarooday.
        2. Intee ka mid ah ayaa ku diwaangashan 'Lacag ah' iyo intee ayaa 'Free ah'.
        3. Sidee bay ardaydu ugu kala qaysban yihiin wadamada iyo saamaynta ay ku leeyihiin dakhliga labada lacagood.
        4. Maxaa talo ah oo aad siin lahayd maamulka nidaamka si loo kordhiyo dakhliga (gaar ahaan dalka Ethiopia oo isticmaala ETB) loona caawiyo ardayda danyarta ah ee 'Free ah' iyadoo la tixraacayo xogta dhaqaalaha iyo wadamada?
        
        U qor si qurux badan oo leh qodobbo.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      res.json({ insights: response.text || "Waan ka xunnahay, ma helin wax jawaab ah hadda." });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Falanqaynta xogta waa ay guuldaraysatay: " + (error?.message || error) });
    }
  });

  // API 9: Fetch current server version and session Info
  app.get("/api/version", (req, res) => {
    const ver = readJSON(VERSION_FILE, defaultVersion);
    res.json({
      ...ver,
      sessionStart: SERVER_STARTUP_TIMESTAMP
    });
  });

  // API 10: Admin trigger update broadcast
  app.post("/api/version", (req, res) => {
    const { version, msg } = req.body;
    const currentVer = {
      version: version || "1.0.1",
      updatedAt: new Date().toLocaleDateString("so-SO"),
      msg: msg || "Nidaamka cusub ee HOGAAN ayaa diyaar ah! / New update is available now."
    };
    writeJSON(VERSION_FILE, currentVer);
    // Broadcast the update event to all active clients connected via SSE
    broadcast("site_updated", currentVer);
    res.json({ success: true, ...currentVer });
  });

  // Vite middleware for development or fallback static files for production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
