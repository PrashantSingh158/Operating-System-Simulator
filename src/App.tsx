import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OSTypes from "./pages/OSTypes";
import OSStructure from "./pages/OSStructure";
import SystemCalls from "./pages/SystemCalls";
import ProcessManagement from "./pages/ProcessManagement";
import CPUScheduling from "./pages/CPUScheduling";
import Threads from "./pages/Threads";
import Synchronization from "./pages/Synchronization";
import Deadlocks from "./pages/Deadlocks";
import MemoryManagement from "./pages/MemoryManagement";
import PageReplacement from "./pages/PageReplacement";
import DiskScheduling from "./pages/DiskScheduling";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/os-types" element={<OSTypes />} />
            <Route path="/os-structure" element={<OSStructure />} />
            <Route path="/system-calls" element={<SystemCalls />} />
            <Route path="/process-management" element={<ProcessManagement />} />
            <Route path="/cpu-scheduling" element={<CPUScheduling />} />
            <Route path="/threads" element={<Threads />} />
            <Route path="/synchronization" element={<Synchronization />} />
            <Route path="/deadlocks" element={<Deadlocks />} />
            <Route path="/memory-management" element={<MemoryManagement />} />
            <Route path="/page-replacement" element={<PageReplacement />} />
            <Route path="/disk-scheduling" element={<DiskScheduling />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
