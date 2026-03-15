import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Process {
  id: string;
  arrival: number;
  burst: number;
  priority: number;
}

interface Result {
  id: string;
  arrival: number;
  burst: number;
  priority: number;
  completion: number;
  turnaround: number;
  waiting: number;
}

interface GanttBlock {
  id: string;
  start: number;
  end: number;
  color: string;
}

interface AlgoResult {
  name: string;
  results: Result[];
  gantt: GanttBlock[];
  avgWaiting: number;
  avgTurnaround: number;
  cpuUtil: number;
}

const COLORS = [
  "hsl(175,70%,42%)", "hsl(200,70%,50%)", "hsl(280,60%,55%)", "hsl(340,65%,50%)",
  "hsl(45,80%,50%)", "hsl(120,50%,45%)", "hsl(20,80%,50%)", "hsl(0,70%,50%)",
  "hsl(260,60%,60%)", "hsl(30,90%,55%)",
];

const ALGORITHMS = ["FCFS", "SJF", "SRTF", "Round Robin", "Priority", "LJF", "LRTF", "HRRN"] as const;
type Algorithm = typeof ALGORITHMS[number];

function getColor(id: string, procs: Process[]) {
  const idx = procs.findIndex((p) => p.id === id);
  return idx >= 0 ? COLORS[idx % COLORS.length] : "hsl(222,15%,25%)";
}

function runFCFS(procs: Process[]): { results: Result[]; gantt: GanttBlock[] } {
  const sorted = [...procs].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const results: Result[] = [];
  const gantt: GanttBlock[] = [];
  let time = 0;
  for (const p of sorted) {
    if (time < p.arrival) { gantt.push({ id: "idle", start: time, end: p.arrival, color: "hsl(222,15%,25%)" }); time = p.arrival; }
    gantt.push({ id: p.id, start: time, end: time + p.burst, color: getColor(p.id, procs) });
    time += p.burst;
    results.push({ ...p, completion: time, turnaround: time - p.arrival, waiting: time - p.arrival - p.burst });
  }
  return { results, gantt };
}

function runNonPreemptive(procs: Process[], key: "burst" | "priority" | "ljf" | "hrrn"): { results: Result[]; gantt: GanttBlock[] } {
  const n = procs.length;
  const done = new Set<number>();
  const results: Result[] = [];
  const gantt: GanttBlock[] = [];
  let time = 0;
  while (done.size < n) {
    let idx = -1;
    let best = key === "ljf" ? -Infinity : Infinity;
    for (let i = 0; i < n; i++) {
      if (done.has(i) || procs[i].arrival > time) continue;
      let val: number;
      if (key === "burst") val = procs[i].burst;
      else if (key === "priority") val = procs[i].priority;
      else if (key === "ljf") val = procs[i].burst;
      else { const wt = time - procs[i].arrival; val = -((wt + procs[i].burst) / procs[i].burst); }
      if (key === "ljf") { if (val > best) { best = val; idx = i; } }
      else { if (val < best) { best = val; idx = i; } }
    }
    if (idx === -1) { time++; continue; }
    const p = procs[idx];
    gantt.push({ id: p.id, start: time, end: time + p.burst, color: getColor(p.id, procs) });
    time += p.burst;
    done.add(idx);
    results.push({ ...p, completion: time, turnaround: time - p.arrival, waiting: time - p.arrival - p.burst });
  }
  return { results, gantt };
}

function runPreemptive(procs: Process[], key: "srtf" | "lrtf"): { results: Result[]; gantt: GanttBlock[] } {
  const n = procs.length;
  const remaining = procs.map((p) => p.burst);
  const completion = new Array(n).fill(0);
  const gantt: GanttBlock[] = [];
  let completed = 0, time = 0, prev = -1;
  while (completed < n) {
    let idx = -1;
    let best = key === "lrtf" ? -1 : Infinity;
    for (let i = 0; i < n; i++) {
      if (remaining[i] <= 0 || procs[i].arrival > time) continue;
      if (key === "srtf" && remaining[i] < best) { best = remaining[i]; idx = i; }
      if (key === "lrtf" && remaining[i] > best) { best = remaining[i]; idx = i; }
    }
    if (idx === -1) { time++; continue; }
    if (prev !== idx) { gantt.push({ id: procs[idx].id, start: time, end: time + 1, color: getColor(procs[idx].id, procs) }); }
    else { gantt[gantt.length - 1].end = time + 1; }
    remaining[idx]--;
    time++;
    prev = idx;
    if (remaining[idx] === 0) { completed++; completion[idx] = time; }
  }
  const results = procs.map((p, i) => ({ ...p, completion: completion[i], turnaround: completion[i] - p.arrival, waiting: completion[i] - p.arrival - p.burst }));
  return { results, gantt };
}

function runRR(procs: Process[], quantum: number): { results: Result[]; gantt: GanttBlock[] } {
  const n = procs.length;
  const remaining = procs.map((p) => p.burst);
  const completion = new Array(n).fill(0);
  const gantt: GanttBlock[] = [];
  const sorted = procs.map((p, i) => ({ ...p, idx: i })).sort((a, b) => a.arrival - b.arrival);
  const queue: number[] = [];
  const inQueue = new Set<number>();
  let time = 0, next = 0, completed = 0;
  while (next < n && sorted[next].arrival <= time) { queue.push(sorted[next].idx); inQueue.add(sorted[next].idx); next++; }
  while (completed < n) {
    if (queue.length === 0) { time++; while (next < n && sorted[next].arrival <= time) { queue.push(sorted[next].idx); inQueue.add(sorted[next].idx); next++; } continue; }
    const idx = queue.shift()!;
    const exec = Math.min(quantum, remaining[idx]);
    gantt.push({ id: procs[idx].id, start: time, end: time + exec, color: getColor(procs[idx].id, procs) });
    time += exec;
    remaining[idx] -= exec;
    while (next < n && sorted[next].arrival <= time) { if (!inQueue.has(sorted[next].idx)) { queue.push(sorted[next].idx); inQueue.add(sorted[next].idx); } next++; }
    if (remaining[idx] > 0) { queue.push(idx); }
    else { completed++; completion[idx] = time; }
  }
  const results = procs.map((p, i) => ({ ...p, completion: completion[i], turnaround: completion[i] - p.arrival, waiting: completion[i] - p.arrival - p.burst }));
  return { results, gantt };
}

function simulate(procs: Process[], algo: Algorithm, quantum: number): { results: Result[]; gantt: GanttBlock[] } {
  if (procs.length === 0) return { results: [], gantt: [] };
  switch (algo) {
    case "FCFS": return runFCFS(procs);
    case "SJF": return runNonPreemptive(procs, "burst");
    case "LJF": return runNonPreemptive(procs, "ljf");
    case "SRTF": return runPreemptive(procs, "srtf");
    case "LRTF": return runPreemptive(procs, "lrtf");
    case "Priority": return runNonPreemptive(procs, "priority");
    case "HRRN": return runNonPreemptive(procs, "hrrn");
    case "Round Robin": return runRR(procs, quantum);
  }
}

function GanttChart({ gantt, label }: { gantt: GanttBlock[]; label: string }) {
  const maxTime = Math.max(...gantt.map((g) => g.end), 1);
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</h4>
      <div className="rounded-lg border border-border bg-card/50 p-2 overflow-x-auto">
        <div className="flex" style={{ minWidth: Math.max(200, maxTime * 32) }}>
          {gantt.map((g, i) => (
            <div key={i} className="relative flex flex-col items-center" style={{ flex: g.end - g.start }}>
              <div className="w-full h-8 rounded-sm flex items-center justify-center text-[10px] font-medium mx-px"
                style={{ backgroundColor: g.color, color: g.id === "idle" ? "hsl(210,20%,70%)" : "hsl(222,25%,6%)" }}>
                {g.id}
              </div>
              <span className="text-[9px] text-muted-foreground mt-0.5 absolute -bottom-4 left-0">{g.start}</span>
              {i === gantt.length - 1 && (
                <span className="text-[9px] text-muted-foreground mt-0.5 absolute -bottom-4 right-0">{g.end}</span>
              )}
            </div>
          ))}
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

export default function CPUScheduling() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", arrival: 0, burst: 5, priority: 2 },
    { id: "P2", arrival: 1, burst: 3, priority: 1 },
    { id: "P3", arrival: 2, burst: 8, priority: 3 },
    { id: "P4", arrival: 3, burst: 2, priority: 4 },
  ]);
  const [quantum, setQuantum] = useState(2);
  const [allResults, setAllResults] = useState<AlgoResult[] | null>(null);
  const [expandedGantt, setExpandedGantt] = useState<string | null>(null);

  const addProcess = () => {
    const id = `P${processes.length + 1}`;
    setProcesses([...processes, { id, arrival: 0, burst: 1, priority: 1 }]);
  };

  const removeProcess = (i: number) => setProcesses(processes.filter((_, j) => j !== i));

  const updateProcess = (i: number, field: keyof Process, val: string) => {
    const updated = [...processes];
    if (field === "id") updated[i] = { ...updated[i], id: val };
    else updated[i] = { ...updated[i], [field]: Math.max(0, parseInt(val) || 0) };
    setProcesses(updated);
  };

  const runAll = useCallback(() => {
    if (processes.length === 0) return;
    const results: AlgoResult[] = ALGORITHMS.map((algo) => {
      const { results: r, gantt } = simulate(processes, algo, quantum);
      const maxTime = Math.max(...gantt.map((g) => g.end), 1);
      const busyTime = gantt.filter((g) => g.id !== "idle").reduce((s, g) => s + g.end - g.start, 0);
      return {
        name: algo,
        results: r,
        gantt,
        avgWaiting: r.length ? r.reduce((s, x) => s + x.waiting, 0) / r.length : 0,
        avgTurnaround: r.length ? r.reduce((s, x) => s + x.turnaround, 0) / r.length : 0,
        cpuUtil: (busyTime / maxTime) * 100,
      };
    });
    setAllResults(results);
    setExpandedGantt(null);
  }, [processes, quantum]);

  const best = allResults ? allResults.reduce((a, b) => a.avgWaiting < b.avgWaiting ? a : b) : null;

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gradient">CPU Scheduling Simulator</h1>
      <p className="text-sm text-muted-foreground">
        Enter your processes below and click <strong>Simulate All</strong>. All 8 scheduling algorithms will run simultaneously and results will be compared to recommend the best one.
      </p>

      {/* Quantum */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Time Quantum (for Round Robin):</label>
        <input type="number" min={1} value={quantum} onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 rounded-md border border-input bg-secondary text-secondary-foreground px-3 py-1.5 text-sm" />
      </div>

      {/* Process Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Process</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Arrival</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Burst</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Priority</th>
                <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">
                    <input value={p.id} onChange={(e) => updateProcess(i, "id", e.target.value)}
                      className="w-16 rounded border border-input bg-secondary text-secondary-foreground px-2 py-1 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min={0} value={p.arrival} onChange={(e) => updateProcess(i, "arrival", e.target.value)}
                      className="w-16 rounded border border-input bg-secondary text-secondary-foreground px-2 py-1 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min={1} value={p.burst} onChange={(e) => updateProcess(i, "burst", e.target.value)}
                      className="w-16 rounded border border-input bg-secondary text-secondary-foreground px-2 py-1 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" min={1} value={p.priority} onChange={(e) => updateProcess(i, "priority", e.target.value)}
                      className="w-16 rounded border border-input bg-secondary text-secondary-foreground px-2 py-1 text-sm" />
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => removeProcess(i)} className="text-destructive hover:text-destructive/80 text-xs">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3 p-4 border-t border-border">
          <button onClick={addProcess} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-muted transition-colors">
            + Add Process
          </button>
          <button onClick={runAll} className="px-6 py-2 rounded-md bg-gradient-primary text-primary-foreground text-sm font-medium glow-primary hover:opacity-90 transition-opacity">
            ▶ Simulate All
          </button>
          <button onClick={() => setAllResults(null)} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-muted transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {allResults && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

          {/* Recommendation */}
          {best && (
            <div className="rounded-xl border-2 border-primary bg-primary/10 p-5 flex items-center gap-4">
              <div className="text-3xl">🏆</div>
              <div>
                <h2 className="text-lg font-bold text-primary">Recommended: {best.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Lowest average waiting time of <span className="text-primary font-semibold">{best.avgWaiting.toFixed(2)}</span> and average turnaround of <span className="text-primary font-semibold">{best.avgTurnaround.toFixed(2)}</span>.
                </p>
              </div>
            </div>
          )}

          {/* Comparison Table */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Algorithm Comparison</h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Algorithm</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Avg Waiting</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Avg Turnaround</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">CPU Util.</th>
                    <th className="px-4 py-3 text-left text-xs text-muted-foreground font-medium">Gantt</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((ar) => (
                    <tr key={ar.name} className={`border-b border-border last:border-0 ${ar.name === best?.name ? "bg-primary/5" : ""}`}>
                      <td className="px-4 py-2 font-medium text-card-foreground">
                        {ar.name}
                        {ar.name === best?.name && <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">BEST</span>}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">{ar.avgWaiting.toFixed(2)}</td>
                      <td className="px-4 py-2 text-muted-foreground">{ar.avgTurnaround.toFixed(2)}</td>
                      <td className="px-4 py-2 text-muted-foreground">{ar.cpuUtil.toFixed(1)}%</td>
                      <td className="px-4 py-2">
                        <button onClick={() => setExpandedGantt(expandedGantt === ar.name ? null : ar.name)}
                          className="text-primary hover:text-primary/80 text-xs underline">
                          {expandedGantt === ar.name ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expanded Gantt for selected algo */}
          {expandedGantt && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GanttChart gantt={allResults.find((a) => a.name === expandedGantt)!.gantt} label={`${expandedGantt} – Gantt Chart`} />
            </motion.div>
          )}

          {/* All Gantt Charts */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">All Gantt Charts</h2>
            <div className="grid gap-6">
              {allResults.map((ar) => (
                <GanttChart key={ar.name} gantt={ar.gantt} label={ar.name} />
              ))}
            </div>
          </div>

          {/* Detailed Results per Algorithm */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Detailed Results</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {allResults.map((ar) => (
                <div key={ar.name} className={`rounded-xl border bg-card p-4 space-y-2 ${ar.name === best?.name ? "border-primary" : "border-border"}`}>
                  <h3 className="text-sm font-bold text-primary">{ar.name} {ar.name === best?.name && "🏆"}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          {["PID", "AT", "BT", "CT", "TAT", "WT"].map((h) => (
                            <th key={h} className="px-2 py-1 text-left text-muted-foreground font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ar.results.map((r) => (
                          <tr key={r.id} className="border-b border-border last:border-0">
                            <td className="px-2 py-1 text-card-foreground font-medium">{r.id}</td>
                            <td className="px-2 py-1 text-muted-foreground">{r.arrival}</td>
                            <td className="px-2 py-1 text-muted-foreground">{r.burst}</td>
                            <td className="px-2 py-1 text-primary font-medium">{r.completion}</td>
                            <td className="px-2 py-1 text-card-foreground">{r.turnaround}</td>
                            <td className="px-2 py-1 text-card-foreground">{r.waiting}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-4 text-[10px] text-muted-foreground pt-1">
                    <span>Avg WT: <strong className="text-card-foreground">{ar.avgWaiting.toFixed(2)}</strong></span>
                    <span>Avg TAT: <strong className="text-card-foreground">{ar.avgTurnaround.toFixed(2)}</strong></span>
                    <span>CPU: <strong className="text-card-foreground">{ar.cpuUtil.toFixed(1)}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
