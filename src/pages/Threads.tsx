import { motion } from "framer-motion";

export default function Threads() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gradient">Threads & Multithreading</h1>

      <section className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-xl font-semibold text-primary">What is a Thread?</h2>
        <p className="text-card-foreground text-sm">A thread is the <strong>smallest unit of execution</strong> within a process. A process can have multiple threads sharing the same address space but executing independently.</p>
      </section>

      {/* Thread Diagram */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Process vs Threads</h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="diagram-node border-primary glow-primary px-8 py-3 font-semibold">Process</div>
            <div className="flex gap-4">
              {["Thread 1", "Thread 2", "Thread 3"].map((t, i) => (
                <motion.div key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                  className="diagram-node text-xs">{t}</motion.div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Threads share code, data, and files but have their own registers and stack.</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Benefits of Multithreading</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Responsiveness", desc: "Application remains responsive even if part is blocked. UI thread stays active while worker threads process data." },
            { title: "Resource Sharing", desc: "Threads share the memory and resources of the process, making communication efficient without IPC." },
            { title: "Economy", desc: "Creating and switching threads is cheaper than processes. Less overhead for context switching." },
            { title: "Scalability", desc: "Threads can run in parallel on multicore systems, improving performance with more CPUs." },
          ].map((b) => (
            <div key={b.title} className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-primary text-sm">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">User vs Kernel Threads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <h3 className="font-semibold text-primary text-sm">User-Level Threads</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Managed by user-level thread library</li>
              <li>• Kernel is unaware of their existence</li>
              <li>• Fast to create and manage</li>
              <li>• If one blocks, all threads block</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <h3 className="font-semibold text-primary text-sm">Kernel-Level Threads</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Managed directly by the OS kernel</li>
              <li>• Kernel can schedule them on multiple CPUs</li>
              <li>• Slower to create than user threads</li>
              <li>• One thread blocking doesn't affect others</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
