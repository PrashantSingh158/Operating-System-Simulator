import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const pcbFields = [
  { field: "Process ID", value: "PID: 1024" },
  { field: "Process State", value: "Running" },
  { field: "Program Counter", value: "0x00FF42" },
  { field: "CPU Registers", value: "EAX, EBX, ECX..." },
  { field: "Scheduling Info", value: "Priority: 5" },
  { field: "Memory Info", value: "Base: 0x1000, Limit: 4KB" },
  { field: "I/O Status", value: "Files: [fd0, fd1, fd2]" },
];

export default function PCBPage() {
  const [switching, setSwitching] = useState(false);
  const [activeProcess, setActiveProcess] = useState<"A" | "B">("A");

  const doSwitch = () => {
    setSwitching(true);
    setTimeout(() => {
      setActiveProcess((p) => (p === "A" ? "B" : "A"));
      setSwitching(false);
    }, 1500);
  };

  return (
    <div className="section-container space-y-10">
      <div>
        <h1 className="text-3xl font-bold">PCB & Context Switching</h1>
        <p className="text-muted-foreground mt-2">How the OS saves and restores process state.</p>
      </div>

      {/* PCB Structure */}
      <div className="sim-card">
        <h2 className="text-xl font-bold mb-4">Process Control Block (PCB)</h2>
        <div className="max-w-sm mx-auto border border-border rounded-lg overflow-hidden">
          {pcbFields.map((f, i) => (
            <div key={f.field} className={`flex justify-between px-4 py-2 text-sm ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
              <span className="font-medium">{f.field}</span>
              <code className="text-xs text-primary font-mono">{f.value}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Context Switch Animation */}
      <div className="sim-card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Context Switch Simulator</h2>
          <Button size="sm" onClick={doSwitch} disabled={switching}>
            <Play className="h-3 w-3 mr-1" />Switch
          </Button>
        </div>
        <div className="flex items-center justify-center gap-6">
          <motion.div
            animate={{
              scale: activeProcess === "A" && !switching ? 1.05 : 0.95,
              opacity: activeProcess === "A" ? 1 : 0.5,
            }}
            className="flow-node border-primary bg-primary/10 px-6 py-4"
          >
            <div className="font-bold">Process A</div>
            <div className="text-xs text-muted-foreground mt-1">
              {activeProcess === "A" ? "Running" : "Saved"}
            </div>
          </motion.div>

          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ x: switching ? [0, 20, -20, 0] : 0 }}
              transition={{ duration: 1 }}
              className="text-xs font-mono text-muted-foreground"
            >
              {switching ? "Switching..." : "Ready"}
            </motion.div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <motion.div
            animate={{
              scale: activeProcess === "B" && !switching ? 1.05 : 0.95,
              opacity: activeProcess === "B" ? 1 : 0.5,
            }}
            className="flow-node border-accent bg-accent/10 px-6 py-4"
          >
            <div className="font-bold">Process B</div>
            <div className="text-xs text-muted-foreground mt-1">
              {activeProcess === "B" ? "Running" : "Saved"}
            </div>
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Context switching saves the PCB of the current process and loads the PCB of the next one. This has overhead, so minimizing unnecessary switches improves performance.
        </p>
      </div>
    </div>
  );
}
