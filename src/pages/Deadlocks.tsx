import { motion } from "framer-motion";

const conditions = [
  { name: "Mutual Exclusion", desc: "At least one resource must be held in a non-sharable mode." },
  { name: "Hold and Wait", desc: "A process holding resources is waiting to acquire additional resources." },
  { name: "No Preemption", desc: "Resources cannot be forcibly taken from a process." },
  { name: "Circular Wait", desc: "A circular chain of processes, each waiting for a resource held by the next." },
];

const strategies = [
  { name: "Deadlock Prevention", desc: "Ensure at least one of the four necessary conditions cannot hold. For example, impose total ordering on resources to prevent circular wait.", methods: ["Break mutual exclusion", "Require all resources upfront", "Allow preemption", "Impose resource ordering"] },
  { name: "Deadlock Avoidance", desc: "Use algorithms like Banker's Algorithm to dynamically check if granting a resource leads to a safe state.", methods: ["Safe state analysis", "Banker's Algorithm", "Resource allocation graph", "Dynamic decisions"] },
  { name: "Deadlock Detection", desc: "Allow deadlocks to occur, then detect and recover using algorithms that check for cycles in the wait-for graph.", methods: ["Wait-for graph", "Cycle detection", "Process termination", "Resource preemption"] },
];

export default function Deadlocks() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gradient">Deadlocks</h1>

      <section className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-primary">What is a Deadlock?</h2>
        <p className="text-card-foreground text-sm">A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process in the set. No process can proceed.</p>
      </section>

      {/* Deadlock Graph Visualization */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Deadlock Visualization</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto">
            <circle cx="80" cy="60" r="30" fill="hsl(222,20%,14%)" stroke="hsl(175,70%,42%)" strokeWidth="1.5" />
            <text x="80" y="65" textAnchor="middle" fill="hsl(210,20%,90%)" fontSize="12" fontFamily="Inter">P1</text>
            <circle cx="220" cy="60" r="30" fill="hsl(222,20%,14%)" stroke="hsl(175,70%,42%)" strokeWidth="1.5" />
            <text x="220" y="65" textAnchor="middle" fill="hsl(210,20%,90%)" fontSize="12" fontFamily="Inter">P2</text>
            <rect x="130" y="130" width="40" height="30" rx="4" fill="hsl(222,20%,14%)" stroke="hsl(200,70%,50%)" strokeWidth="1.5" />
            <text x="150" y="150" textAnchor="middle" fill="hsl(210,20%,90%)" fontSize="10" fontFamily="Inter">R1</text>
            <rect x="60" y="130" width="40" height="30" rx="4" fill="hsl(222,20%,14%)" stroke="hsl(200,70%,50%)" strokeWidth="1.5" />
            <text x="80" y="150" textAnchor="middle" fill="hsl(210,20%,90%)" fontSize="10" fontFamily="Inter">R2</text>
            {/* Arrows showing circular wait */}
            <line x1="80" y1="90" x2="80" y2="130" stroke="hsl(0,70%,50%)" strokeWidth="1.5" markerEnd="url(#darrow)" />
            <line x1="100" y1="145" x2="130" y2="145" stroke="hsl(175,70%,42%)" strokeWidth="1.5" markerEnd="url(#darrow)" />
            <line x1="150" y1="130" x2="220" y2="90" stroke="hsl(0,70%,50%)" strokeWidth="1.5" markerEnd="url(#darrow)" />
            <line x1="190" y1="60" x2="110" y2="60" stroke="hsl(175,70%,42%)" strokeWidth="1.5" markerEnd="url(#darrow)" />
            <defs><marker id="darrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="hsl(175,70%,42%)" />
            </marker></defs>
          </svg>
          <p className="text-xs text-muted-foreground text-center mt-3">P1 holds R2, waits for R1 • P2 holds R1, waits for R2 → Circular wait!</p>
        </div>
      </section>

      {/* Necessary Conditions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Necessary Conditions for Deadlock</h2>
        <p className="text-sm text-muted-foreground">All four conditions must hold simultaneously for a deadlock to occur.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {conditions.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-primary text-sm">{i + 1}. {c.name}</h3>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Handling Strategies */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Handling Deadlocks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategies.map((s) => (
            <div key={s.name} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-primary text-sm">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
              <ul className="space-y-1">
                {s.methods.map((m) => <li key={m} className="text-xs text-secondary-foreground">• {m}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
