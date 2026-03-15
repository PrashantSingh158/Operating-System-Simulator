import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Algorithm = "FCFS" | "SSTF" | "SCAN" | "C-SCAN" | "LOOK" | "C-LOOK";
const ALGORITHMS: Algorithm[] = ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"];

function runDiskAlgo(requests: number[], head: number, diskSize: number, algo: Algorithm): { sequence: number[]; totalSeek: number } {
  if (requests.length === 0) return { sequence: [head], totalSeek: 0 };
  const seq: number[] = [head];
  let total = 0;

  const addMove = (to: number) => { total += Math.abs(seq[seq.length - 1] - to); seq.push(to); };

  switch (algo) {
    case "FCFS":
      for (const r of requests) addMove(r);
      break;

    case "SSTF": {
      const rem = [...requests];
      while (rem.length > 0) {
        const cur = seq[seq.length - 1];
        let closest = 0;
        for (let i = 1; i < rem.length; i++) {
          if (Math.abs(rem[i] - cur) < Math.abs(rem[closest] - cur)) closest = i;
        }
        addMove(rem[closest]);
        rem.splice(closest, 1);
      }
      break;
    }

    case "SCAN": {
      const left = requests.filter((r) => r < head).sort((a, b) => b - a);
      const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
      for (const r of right) addMove(r);
      addMove(diskSize - 1);
      for (const r of left) addMove(r);
      break;
    }

    case "C-SCAN": {
      const left = requests.filter((r) => r < head).sort((a, b) => a - b);
      const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
      for (const r of right) addMove(r);
      addMove(diskSize - 1);
      addMove(0);
      for (const r of left) addMove(r);
      break;
    }

    case "LOOK": {
      const left = requests.filter((r) => r < head).sort((a, b) => b - a);
      const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
      for (const r of right) addMove(r);
      for (const r of left) addMove(r);
      break;
    }

    case "C-LOOK": {
      const left = requests.filter((r) => r < head).sort((a, b) => a - b);
      const right = requests.filter((r) => r >= head).sort((a, b) => a - b);
      for (const r of right) addMove(r);
      for (const r of left) addMove(r);
      break;
    }
  }
  return { sequence: seq, totalSeek: total };
}

export default function DiskScheduling() {
  const [requestStr, setRequestStr] = useState("98 183 37 122 14 124 65 67");
  const [head, setHead] = useState(53);
  const [diskSize, setDiskSize] = useState(200);
  const [algo, setAlgo] = useState<Algorithm>("FCFS");
  const [result, setResult] = useState<{ sequence: number[]; totalSeek: number } | null>(null);

  const runSim = () => {
    const requests = requestStr.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    setResult(runDiskAlgo(requests, head, diskSize, algo));
  };

  const chartData = result?.sequence.map((pos, i) => ({ step: i, position: pos })) ?? [];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gradient">Disk Scheduling Simulator</h1>

      {/* Disk Structure Info */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="font-semibold text-primary text-sm mb-2">Disk Structure</h3>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span><strong className="text-card-foreground">Seek Time:</strong> Time to move head to desired track</span>
          <span><strong className="text-card-foreground">Rotational Latency:</strong> Time for sector to rotate under head</span>
          <span><strong className="text-card-foreground">Transfer Time:</strong> Time to transfer data</span>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Request Queue (space or comma separated)</label>
          <input value={requestStr} onChange={(e) => setRequestStr(e.target.value)}
            className="w-full rounded-md border border-input bg-secondary text-secondary-foreground px-3 py-2 text-sm font-mono" />
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Initial Head</label>
            <input type="number" min={0} value={head} onChange={(e) => setHead(parseInt(e.target.value) || 0)}
              className="w-24 rounded-md border border-input bg-secondary text-secondary-foreground px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Disk Size</label>
            <input type="number" min={1} value={diskSize} onChange={(e) => setDiskSize(parseInt(e.target.value) || 200)}
              className="w-24 rounded-md border border-input bg-secondary text-secondary-foreground px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALGORITHMS.map((a) => (
            <button key={a} onClick={() => { setAlgo(a); setResult(null); }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${algo === a ? "bg-gradient-primary text-primary-foreground glow-primary" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={runSim} className="px-6 py-2 rounded-md bg-gradient-primary text-primary-foreground text-sm font-medium glow-primary hover:opacity-90 transition-opacity">
            ▶ Simulate
          </button>
          <button onClick={() => setResult(null)} className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-muted transition-colors">
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">{result.totalSeek}</div>
              <div className="text-xs text-muted-foreground">Total Seek Time</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-card-foreground">{result.sequence.length - 1}</div>
              <div className="text-xs text-muted-foreground">Total Movements</div>
            </div>
          </div>

          {/* Head Movement Graph */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-card-foreground text-sm mb-4">Head Movement</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,15%,18%)" />
                <XAxis dataKey="step" label={{ value: "Step", position: "insideBottom", offset: -5, fill: "hsl(215,15%,50%)" }}
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }} stroke="hsl(222,15%,20%)" />
                <YAxis domain={[0, diskSize - 1]} label={{ value: "Track", angle: -90, position: "insideLeft", fill: "hsl(215,15%,50%)" }}
                  tick={{ fill: "hsl(215,15%,50%)", fontSize: 11 }} stroke="hsl(222,15%,20%)" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222,20%,10%)", border: "1px solid hsl(222,15%,18%)", borderRadius: 8, color: "hsl(210,20%,90%)" }} />
                <Line type="linear" dataKey="position" stroke="hsl(175,70%,42%)" strokeWidth={2} dot={{ fill: "hsl(175,70%,42%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sequence */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-card-foreground text-sm mb-2">Movement Sequence</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {result.sequence.map((pos, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={`text-sm font-mono ${i === 0 ? "text-primary font-bold" : "text-card-foreground"}`}>{pos}</span>
                  {i < result.sequence.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Algorithm Info */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="font-semibold text-primary text-sm mb-2">About {algo}</h3>
            <p className="text-xs text-muted-foreground">
              {algo === "FCFS" && "First Come First Served: Services requests in arrival order. Simple but can cause large seek times."}
              {algo === "SSTF" && "Shortest Seek Time First: Selects the request nearest to current head position. Can cause starvation."}
              {algo === "SCAN" && "SCAN (Elevator): Head moves in one direction servicing requests, then reverses. Goes to disk end."}
              {algo === "C-SCAN" && "Circular SCAN: Like SCAN but jumps back to start after reaching the end. More uniform wait times."}
              {algo === "LOOK" && "LOOK: Like SCAN but only goes to the last request in each direction, not the disk end."}
              {algo === "C-LOOK" && "Circular LOOK: Like C-SCAN but only goes to the last request, then jumps to the first request."}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
