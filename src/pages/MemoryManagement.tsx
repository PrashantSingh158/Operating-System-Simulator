import { motion } from "framer-motion";

const hierarchy = [
  { name: "Registers", speed: "Fastest", size: "Bytes", color: "hsl(175,70%,42%)" },
  { name: "Cache (L1/L2/L3)", speed: "Very Fast", size: "KB-MB", color: "hsl(200,70%,50%)" },
  { name: "Main Memory (RAM)", speed: "Fast", size: "GB", color: "hsl(280,60%,55%)" },
  { name: "Secondary Storage (SSD/HDD)", speed: "Slow", size: "TB", color: "hsl(45,80%,50%)" },
];

const techniques = [
  { name: "Contiguous Allocation", desc: "Each process occupies a single contiguous block of memory. Simple but leads to fragmentation.", details: ["Fixed partitioning: memory divided into fixed-size blocks", "Variable partitioning: blocks sized to fit processes", "Suffers from external fragmentation", "Compaction can reduce fragmentation"] },
  { name: "Paging", desc: "Physical memory divided into fixed-size frames. Logical memory divided into same-size pages. No external fragmentation.", details: ["Page table maps logical to physical addresses", "Page size typically 4KB", "Internal fragmentation possible", "Supports non-contiguous allocation"] },
  { name: "Segmentation", desc: "Memory divided into variable-size segments based on logical divisions (code, data, stack).", details: ["Each segment has base and limit", "Segments can grow independently", "External fragmentation possible", "Matches programmer's view of memory"] },
  { name: "Virtual Memory", desc: "Provides illusion of larger memory using disk. Only needed pages are loaded into RAM (demand paging).", details: ["Allows running programs larger than physical memory", "Uses page table with valid/invalid bits", "Page fault triggers loading from disk", "Thrashing occurs when too many page faults"] },
];

export default function MemoryManagement() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-gradient">Memory Management</h1>

      {/* Memory Hierarchy */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Memory Hierarchy</h2>
        <div className="flex flex-col items-center gap-2">
          {hierarchy.map((h, i) => (
            <motion.div key={h.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-border bg-card px-6 py-3 text-center"
              style={{ width: `${50 + i * 15}%`, borderLeftColor: h.color, borderLeftWidth: 3 }}>
              <div className="font-medium text-card-foreground text-sm">{h.name}</div>
              <div className="text-xs text-muted-foreground">{h.speed} • {h.size}</div>
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">↑ Faster & smaller • ↓ Slower & larger</p>
      </section>

      {/* Allocation Techniques */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Memory Allocation Techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techniques.map((t) => (
            <div key={t.name} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <h3 className="font-semibold text-primary text-sm">{t.name}</h3>
              <p className="text-xs text-muted-foreground">{t.desc}</p>
              <ul className="space-y-1">
                {t.details.map((d) => <li key={d} className="text-xs text-secondary-foreground">• {d}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
