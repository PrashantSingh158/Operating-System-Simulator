import { motion } from "framer-motion";

const mechanisms = [
  { name: "Mutex (Mutual Exclusion)", desc: "A locking mechanism that allows only one thread to access a critical section at a time. The thread must acquire the lock before entering and release it after leaving.", visual: ["Thread A → Lock → Critical Section → Unlock", "Thread B → Wait... → Lock → Critical Section → Unlock"] },
  { name: "Binary Semaphore", desc: "A semaphore with value 0 or 1. Works like a mutex but can be signaled by any thread, not just the owner.", visual: ["wait(S): if S>0 then S=0 else block", "signal(S): if blocked threads then wake one else S=1"] },
  { name: "Counting Semaphore", desc: "A semaphore with integer value representing available resources. Allows multiple threads to access a resource pool.", visual: ["wait(S): S = S - 1; if S < 0 then block", "signal(S): S = S + 1; if S <= 0 then wake one"] },
  { name: "Monitor", desc: "A high-level synchronization construct combining mutex and condition variables. Only one process can be active inside a monitor at a time.", visual: ["monitor M { shared data; procedures; condition vars; }"] },
];

export default function Synchronization() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gradient">Process Synchronization</h1>

      <section className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-primary">The Synchronization Problem</h2>
        <p className="text-card-foreground text-sm">When multiple processes access shared resources concurrently, the outcome depends on the order of execution. This can lead to <strong>race conditions</strong> where results are inconsistent.</p>
      </section>

      {/* Critical Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Critical Section Problem</h2>
        <div className="flex flex-col gap-2 items-center">
          {[
            { name: "Entry Section", desc: "Request permission to enter critical section" },
            { name: "Critical Section", desc: "Code that accesses shared resources" },
            { name: "Exit Section", desc: "Release access to critical section" },
            { name: "Remainder Section", desc: "Rest of the code" },
          ].map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className={`diagram-node w-72 text-center ${s.name === "Critical Section" ? "border-primary glow-primary" : ""}`}>
              <div className="font-medium text-sm">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mechanisms */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Synchronization Mechanisms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mechanisms.map((m) => (
            <div key={m.name} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-primary text-sm">{m.name}</h3>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
              <div className="space-y-1">
                {m.visual.map((v, i) => (
                  <code key={i} className="block text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded font-mono">{v}</code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
