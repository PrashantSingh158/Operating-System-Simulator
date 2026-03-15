import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const osTypes = [
  { name: "Batch OS", color: "hsl(175,70%,42%)", desc: "Jobs are collected into batches and processed sequentially without user interaction. Used in early mainframe computers.", points: ["Jobs processed in batches", "No direct user interaction during execution", "Efficient for large repetitive jobs", "Example: Payroll processing systems"] },
  { name: "Multiprogramming OS", color: "hsl(200,70%,50%)", desc: "Multiple programs are kept in memory simultaneously. The CPU switches to another program when one is waiting for I/O.", points: ["Multiple programs loaded in memory", "CPU switches when a process waits for I/O", "Maximizes CPU utilization", "Example: IBM OS/360"] },
  { name: "Multitasking OS", color: "hsl(280,60%,55%)", desc: "Multiple tasks run seemingly simultaneously by rapidly switching between them.", points: ["Multiple tasks appear to run at the same time", "Uses time-sharing to switch between tasks", "Provides responsive user experience", "Example: Windows, macOS, Linux"] },
  { name: "Time Sharing OS", color: "hsl(45,80%,50%)", desc: "CPU time is divided among many users, each getting a small time slice for quick response.", points: ["CPU time divided among multiple users", "Each user gets a time quantum", "Quick response time for all users", "Example: Unix, Multics"] },
  { name: "Multiprocessing OS", color: "hsl(340,65%,50%)", desc: "Uses multiple CPUs/processors working together to execute processes in parallel.", points: ["Multiple CPUs work together", "True parallel execution", "High reliability and throughput", "Example: Windows Server, Linux clusters"] },
  { name: "Distributed OS", color: "hsl(120,50%,45%)", desc: "Multiple computers connected via a network work together as a single coherent system.", points: ["Multiple interconnected computers", "Appears as single system to users", "Resource sharing across network", "Example: Google's infrastructure, LOCUS"] },
  { name: "Network OS", color: "hsl(20,80%,50%)", desc: "Manages network resources, provides file sharing, and handles network communication.", points: ["Manages shared network resources", "Centralized server-based architecture", "File and printer sharing", "Example: Novell NetWare, Windows Server"] },
  { name: "Real-Time OS", color: "hsl(0,70%,50%)", desc: "Processes data with strict time constraints. Used in mission-critical systems where timing is essential.", points: ["Strict time deadlines for processing", "Deterministic response times", "Used in safety-critical systems", "Example: VxWorks, FreeRTOS, aircraft systems"] },
];

export default function OSTypes() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Types of Operating Systems</h1>
      <p className="text-muted-foreground">Click on any type to learn more about it.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {osTypes.map((os, i) => (
          <motion.button key={os.name} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(i)}
            className="rounded-lg border border-border bg-card p-4 text-left hover:glow-primary transition-shadow"
            style={{ borderLeftColor: os.color, borderLeftWidth: 3 }}>
            <h3 className="font-semibold text-card-foreground text-sm">{os.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{os.desc}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="rounded-xl border border-border bg-card p-6 space-y-3 relative"
            style={{ borderTopColor: osTypes[selected].color, borderTopWidth: 3 }}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-bold text-card-foreground">{osTypes[selected].name}</h2>
            <p className="text-card-foreground text-sm">{osTypes[selected].desc}</p>
            <ul className="space-y-1">
              {osTypes[selected].points.map((p) => (
                <li key={p} className="text-sm text-muted-foreground">• {p}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
