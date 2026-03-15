import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Cpu, MemoryStick, HardDrive, Shield, GitBranch, Monitor, ArrowRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const purposes = [
  { icon: GitBranch, title: "Process Management", desc: "Creates, schedules, and terminates processes" },
  { icon: MemoryStick, title: "Memory Management", desc: "Allocates and deallocates memory for processes" },
  { icon: Cpu, title: "CPU Scheduling", desc: "Decides which process runs on the CPU next" },
  { icon: HardDrive, title: "File Management", desc: "Manages files and directories on storage devices" },
  { icon: Monitor, title: "Device Management", desc: "Controls and coordinates I/O hardware devices" },
  { icon: Shield, title: "Security & Protection", desc: "Protects system resources and user data" },
];

const quickLinks = [
  { title: "CPU Scheduling Simulator", desc: "Run FCFS, SJF, Round Robin & more", url: "/cpu-scheduling" },
  { title: "Page Replacement Simulator", desc: "Visualize FIFO, LRU, Optimal", url: "/page-replacement" },
  { title: "Disk Scheduling Simulator", desc: "FCFS, SSTF, SCAN algorithms", url: "/disk-scheduling" },
];

export default function Home() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-12">
      {/* Hero */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="text-gradient">Operating System</span> Simulator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn Operating Systems visually through interactive simulations, diagrams, and step-by-step algorithm visualizations.
        </p>
      </motion.section>

      {/* Definition */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-primary">What is an Operating System?</h2>
        <p className="text-card-foreground leading-relaxed">
          An Operating System is <strong>system software</strong> that acts as an interface between the user and the computer hardware. 
          It manages resources like CPU, memory, files, and devices and allows programs to run efficiently.
        </p>
      </motion.section>

      {/* Diagram: User → OS → Hardware */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col items-center gap-2">
        <h2 className="text-lg font-semibold mb-2">How an OS Works</h2>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="diagram-node bg-gradient-primary text-primary-foreground font-semibold px-6 py-3">👤 User / Application</div>
          <ArrowRight className="h-5 w-5 text-primary" />
          <div className="diagram-node border-primary glow-primary px-6 py-3 font-semibold text-primary">🖥️ Operating System</div>
          <ArrowRight className="h-5 w-5 text-primary" />
          <div className="diagram-node px-6 py-3">⚙️ Hardware</div>
        </div>
      </motion.section>

      {/* Purpose of OS */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3, duration: 0.5 }} className="space-y-4">
        <h2 className="text-xl font-semibold">Purpose of an Operating System</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purposes.map((p) => (
            <div key={p.title} className="rounded-lg border border-border bg-card p-4 space-y-2 hover:glow-primary transition-shadow">
              <p.icon className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-card-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Why OS Matters */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-primary">Why are Operating Systems Important?</h2>
        <ul className="space-y-2 text-card-foreground text-sm">
          <li>• Without an OS, a computer cannot function — it's the foundation all software runs on.</li>
          <li>• It manages hardware resources and prevents conflicts between programs.</li>
          <li>• It provides a convenient environment for users to execute programs efficiently.</li>
          <li>• It ensures security, process isolation, and fair resource allocation.</li>
        </ul>
      </motion.section>

      {/* Quick Links to Simulators */}
      <motion.section initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5, duration: 0.5 }} className="space-y-4">
        <h2 className="text-xl font-semibold">🚀 Interactive Simulators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((l) => (
            <Link key={l.url} to={l.url}
              className="rounded-lg border border-border bg-card p-5 space-y-2 hover:border-primary hover:glow-primary transition-all group">
              <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{l.title}</h3>
              <p className="text-sm text-muted-foreground">{l.desc}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
