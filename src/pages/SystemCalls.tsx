import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  { name: "Program Execution", desc: "Load programs into memory and execute them. Handle normal and abnormal termination." },
  { name: "I/O Operations", desc: "Manage input/output operations for files and devices on behalf of user programs." },
  { name: "File System Manipulation", desc: "Create, delete, read, write files and directories. Manage permissions and access." },
  { name: "Communication", desc: "Enable processes to exchange information via shared memory or message passing." },
  { name: "Error Detection", desc: "Detect errors in CPU, memory, I/O devices, and user programs. Take corrective action." },
  { name: "Resource Allocation", desc: "Allocate CPU, memory, storage, and I/O devices to multiple concurrent processes." },
  { name: "Accounting", desc: "Track resource usage by users and processes for billing or performance analysis." },
  { name: "Protection & Security", desc: "Control access to system resources. Authenticate users and defend against threats." },
];

const systemCalls = [
  { category: "Process Control", calls: ["fork()", "exec()", "exit()", "wait()"], desc: "Create, execute, and manage processes" },
  { category: "File Manipulation", calls: ["open()", "read()", "write()", "close()"], desc: "Access and manipulate files" },
  { category: "Device Management", calls: ["ioctl()", "read()", "write()"], desc: "Request and manage device access" },
  { category: "Information Maintenance", calls: ["getpid()", "alarm()", "sleep()"], desc: "Get/set system and process info" },
  { category: "Communication", calls: ["pipe()", "shmget()", "mmap()"], desc: "Inter-process communication" },
];

export default function SystemCalls() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gradient">OS Services & System Calls</h1>

      {/* OS Services */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Operating System Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-medium text-primary text-sm">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* System Call Flow */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">System Call Flow</h2>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {["User Program", "System Call Interface", "Kernel", "Hardware"].map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              <div className="diagram-node text-sm">{item}</div>
              {i < 3 && <ArrowRight className="h-4 w-4 text-primary shrink-0" />}
            </span>
          ))}
        </div>
      </section>

      {/* System Calls by Category */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">System Calls by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemCalls.map((sc) => (
            <div key={sc.category} className="rounded-lg border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-primary text-sm">{sc.category}</h3>
              <p className="text-xs text-muted-foreground">{sc.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {sc.calls.map((c) => (
                  <code key={c} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-mono">{c}</code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
