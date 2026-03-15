import { useState } from "react";
import { motion } from "framer-motion";

const states = [
  { id: "new", label: "New", x: 50, y: 50, desc: "Process is being created" },
  { id: "ready", label: "Ready", x: 200, y: 50, desc: "Waiting to be assigned to CPU" },
  { id: "running", label: "Running", x: 350, y: 50, desc: "Being executed by CPU" },
  { id: "waiting", label: "Waiting", x: 350, y: 160, desc: "Waiting for I/O or event" },
  { id: "terminated", label: "Terminated", x: 500, y: 50, desc: "Execution completed" },
];

const transitions = [
  { from: "new", to: "ready", label: "Admitted" },
  { from: "ready", to: "running", label: "Dispatch" },
  { from: "running", to: "ready", label: "Interrupt" },
  { from: "running", to: "waiting", label: "I/O Wait" },
  { from: "waiting", to: "ready", label: "I/O Done" },
  { from: "running", to: "terminated", label: "Exit" },
];

const pcbFields = [
  { field: "Process ID (PID)", desc: "Unique identifier for the process" },
  { field: "Process State", desc: "Current state (new, ready, running, waiting, terminated)" },
  { field: "Program Counter", desc: "Address of next instruction to execute" },
  { field: "CPU Registers", desc: "Contents of all process-centric registers" },
  { field: "Scheduling Info", desc: "Priority, scheduling queue pointers" },
  { field: "Memory Info", desc: "Page tables, segment tables, base/limit registers" },
  { field: "I/O Status", desc: "List of I/O devices allocated to process" },
  { field: "Accounting Info", desc: "CPU time used, time limits, process numbers" },
];

const schedulers = [
  { name: "Long-Term Scheduler", desc: "Selects processes from the job pool and loads them into memory. Controls the degree of multiprogramming.", aka: "Job Scheduler" },
  { name: "Medium-Term Scheduler", desc: "Handles swapping — temporarily removes processes from memory to reduce multiprogramming degree.", aka: "Swapper" },
  { name: "Short-Term Scheduler", desc: "Selects from ready queue which process gets CPU next. Runs very frequently (milliseconds).", aka: "CPU Scheduler" },
];

export default function ProcessManagement() {
  const [activeState, setActiveState] = useState<string | null>(null);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gradient">Process Management</h1>

      {/* Process Definition */}
      <section className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-primary">What is a Process?</h2>
        <p className="text-card-foreground text-sm">A process is a <strong>program in execution</strong>. It includes the program code, current activity (program counter), stack, heap, data section, and associated resources.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {["Stack (local vars)", "Heap (dynamic memory)", "Text (code)", "Data (globals)"].map((c) => (
            <div key={c} className="text-xs rounded bg-secondary text-secondary-foreground px-3 py-2 text-center font-mono">{c}</div>
          ))}
        </div>
      </section>

      {/* Process State Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Process State Diagram</h2>
        <p className="text-sm text-muted-foreground">Click on a state to learn more.</p>
        <div className="relative bg-card rounded-xl border border-border p-6 overflow-x-auto">
          <svg viewBox="0 0 620 220" className="w-full max-w-2xl mx-auto" style={{ minWidth: 500 }}>
            {/* Arrows */}
            {transitions.map((t) => {
              const from = states.find(s => s.id === t.from)!;
              const to = states.find(s => s.id === t.to)!;
              const mx = (from.x + 50 + to.x + 50) / 2;
              const my = (from.y + 20 + to.y + 20) / 2;
              return (
                <g key={`${t.from}-${t.to}`}>
                  <line x1={from.x + 50} y1={from.y + 20} x2={to.x + 50} y2={to.y + 20}
                    stroke="hsl(175,70%,42%)" strokeWidth="1.5" markerEnd="url(#arrow)" opacity={0.6} />
                  <text x={mx} y={my - 6} textAnchor="middle" fill="hsl(215,15%,50%)" fontSize="9" fontFamily="Inter">{t.label}</text>
                </g>
              );
            })}
            <defs><marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="hsl(175,70%,42%)" />
            </marker></defs>
            {/* State boxes */}
            {states.map((s) => (
              <g key={s.id} onClick={() => setActiveState(s.id)} className="cursor-pointer">
                <rect x={s.x} y={s.y} width={100} height={40} rx={8}
                  fill={activeState === s.id ? "hsl(175,70%,42%)" : "hsl(222,20%,14%)"}
                  stroke="hsl(222,15%,22%)" strokeWidth="1" />
                <text x={s.x + 50} y={s.y + 24} textAnchor="middle"
                  fill={activeState === s.id ? "hsl(222,25%,6%)" : "hsl(210,20%,90%)"} fontSize="12" fontFamily="Inter" fontWeight="500">{s.label}</text>
              </g>
            ))}
          </svg>
        </div>
        {activeState && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm bg-secondary rounded-lg px-4 py-3 text-secondary-foreground">
            <strong>{states.find(s => s.id === activeState)?.label}:</strong> {states.find(s => s.id === activeState)?.desc}
          </motion.div>
        )}
      </section>

      {/* PCB */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Process Control Block (PCB)</h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {pcbFields.map((f, i) => (
            <div key={f.field} className={`flex items-start gap-4 px-4 py-3 ${i < pcbFields.length - 1 ? "border-b border-border" : ""}`}>
              <span className="font-mono text-xs text-primary w-40 shrink-0">{f.field}</span>
              <span className="text-xs text-muted-foreground">{f.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Context Switching */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Context Switching</h2>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {["Process A Running", "Save State A", "Load State B", "Process B Running"].map((step, i) => (
            <motion.div key={step} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}
              className="diagram-node text-xs text-center">{step}</motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">Context switching allows the OS to save one process's state and load another, enabling multitasking.</p>
      </section>

      {/* Schedulers */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Process Schedulers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedulers.map((s) => (
            <div key={s.name} className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-primary text-sm">{s.name}</h3>
              <p className="text-xs text-muted-foreground italic">({s.aka})</p>
              <p className="text-xs text-card-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
