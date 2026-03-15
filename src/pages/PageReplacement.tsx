import { useState } from "react";
import { motion } from "framer-motion";

type Algorithm = "FIFO" | "LRU" | "Optimal";

interface StepResult {
  page: number;
  frames: (number | null)[];
  fault: boolean;
}

function runFIFO(pages: number[], frameCount: number): StepResult[] {
  const frames: (number | null)[] = new Array(frameCount).fill(null);
  const queue: number[] = [];
  const steps: StepResult[] = [];
  for (const page of pages) {
    const fault = !frames.includes(page);
    if (fault) {
      if (queue.length >= frameCount) {
        const removed = queue.shift()!;
        frames[frames.indexOf(removed)] = page;
      } else {
        frames[frames.indexOf(null)] = page;
      }
      queue.push(page);
    }
    steps.push({ page, frames: [...frames], fault });
  }
  return steps;
}

function runLRU(pages: number[], frameCount: number): StepResult[] {
  const frames: (number | null)[] = new Array(frameCount).fill(null);
  const lastUsed: Map<number, number> = new Map();
  const steps: StepResult[] = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const fault = !frames.includes(page);
    if (fault) {
      const nullIdx = frames.indexOf(null);
      if (nullIdx !== -1) {
        frames[nullIdx] = page;
      } else {
        let lruPage = frames[0]!, lruTime = Infinity;
        for (const f of frames) {
          if (f !== null && (lastUsed.get(f) ?? -1) < lruTime) { lruTime = lastUsed.get(f) ?? -1; lruPage = f; }
        }
        frames[frames.indexOf(lruPage)] = page;
      }
    }
    lastUsed.set(page, i);
    steps.push({ page, frames: [...frames], fault });
  }
  return steps;
}

function runOptimal(pages: number[], frameCount: number): StepResult[] {
  const frames: (number | null)[] = new Array(frameCount).fill(null);
  const steps: StepResult[] = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const fault = !frames.includes(page);
    if (fault) {
      const nullIdx = frames.indexOf(null);
      if (nullIdx !== -1) {
        frames[nullIdx] = page;
      } else {
        let farthest = -1, replaceIdx = 0;
        for (let j = 0; j < frames.length; j++) {
          const nextUse = pages.indexOf(frames[j]!, i + 1);
          if (nextUse === -1) { replaceIdx = j; break; }
          if (nextUse > farthest) { farthest = nextUse; replaceIdx = j; }
        }
        frames[replaceIdx] = page;
      }
    }
    steps.push({ page, frames: [...frames], fault });
  }
  return steps;
}

function simulate(pages: number[], frameCount: number, algo: Algorithm): StepResult[] {
  switch (algo) {
    case "FIFO": return runFIFO(pages, frameCount);
    case "LRU": return runLRU(pages, frameCount);
    case "Optimal": return runOptimal(pages, frameCount);
  }
}

export default function PageReplacement() {
  const [refString, setRefString] = useState("7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1");
  const [frameCount, setFrameCount] = useState(3);
  const [algo, setAlgo] = useState<Algorithm>("FIFO");
  const [steps, setSteps] = useState<StepResult[] | null>(null);

  const runSim = () => {
    const pages = refString.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    if (pages.length === 0) return;
    setSteps(simulate(pages, frameCount, algo));
  };

  const faults = steps?.filter((s) => s.fault).length ?? 0;
  const hits = steps ? steps.length - faults : 0;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gradient">Page Replacement Simulator</h1>

      {/* Controls */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Reference String (space or comma separated)</label>
          <input value={refString} onChange={(e) => setRefString(e.target.value)}
            className="w-full rounded-md border border-input bg-secondary text-secondary-foreground px-3 py-2 text-sm font-mono" />
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Frames</label>
            <input type="number" min={1} max={10} value={frameCount} onChange={(e) => setFrameCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 rounded-md border border-input bg-secondary text-secondary-foreground px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Algorithm</label>
            <div className="flex gap-2">
              {(["FIFO", "LRU", "Optimal"] as Algorithm[]).map((a) => (
                <button key={a} onClick={() => { setAlgo(a); setSteps(null); }}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${algo === a ? "bg-gradient-primary text-primary-foreground glow-primary" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <button onClick={runSim} className="px-6 py-2 rounded-md bg-gradient-primary text-primary-foreground text-sm font-medium glow-primary hover:opacity-90 transition-opacity">
            ▶ Simulate
          </button>
          <button onClick={() => setSteps(null)} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-muted transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {steps && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{faults}</div>
              <div className="text-xs text-muted-foreground">Page Faults</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{hits}</div>
              <div className="text-xs text-muted-foreground">Page Hits</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-card-foreground">{((faults / steps.length) * 100).toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Fault Rate</div>
            </div>
          </div>

          {/* Step Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-xs text-muted-foreground font-medium text-left">Step</th>
                  <th className="px-3 py-2 text-xs text-muted-foreground font-medium text-left">Page</th>
                  {Array.from({ length: frameCount }, (_, i) => (
                    <th key={i} className="px-3 py-2 text-xs text-muted-foreground font-medium text-center">Frame {i + 1}</th>
                  ))}
                  <th className="px-3 py-2 text-xs text-muted-foreground font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${s.fault ? "bg-destructive/5" : ""}`}>
                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2 font-mono font-medium text-card-foreground">{s.page}</td>
                    {s.frames.map((f, j) => (
                      <td key={j} className="px-3 py-2 text-center font-mono">
                        {f !== null ? <span className="text-primary">{f}</span> : <span className="text-muted-foreground">-</span>}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${s.fault ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                        {s.fault ? "Fault" : "Hit"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Algorithm Info */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-primary text-sm mb-2">About {algo}</h3>
            <p className="text-xs text-muted-foreground">
              {algo === "FIFO" && "First In First Out: Replaces the page that has been in memory the longest. Simple but can suffer from Belady's anomaly."}
              {algo === "LRU" && "Least Recently Used: Replaces the page that hasn't been used for the longest time. Good approximation of optimal but requires tracking access history."}
              {algo === "Optimal" && "Optimal (Belady's): Replaces the page that won't be used for the longest time in the future. Best possible but requires future knowledge (used as benchmark)."}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
