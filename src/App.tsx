
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import PengawasTransportirDashboard from "./pages/PengawasTransportirDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import PengawasDepoDashboard from "./pages/PengawasDepoDashboard";
import GLPamaDashboard from "./pages/GLPamaDashboard";
import FuelmanDashboard from "./pages/FuelmanDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/pengawas-transportir" element={
              <ProtectedRoute allowedRoles={['pengawas_transportir']}>
                <PengawasTransportirDashboard />
              </ProtectedRoute>
            } />
            <Route path="/driver" element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            } />
            <Route path="/pengawas-depo" element={
              <ProtectedRoute allowedRoles={['pengawas_depo']}>
                <PengawasDepoDashboard />
              </ProtectedRoute>
            } />
            <Route path="/gl-pama" element={
              <ProtectedRoute allowedRoles={['gl_pama']}>
                <GLPamaDashboard />
              </ProtectedRoute>
            } />
            <Route path="/fuelman" element={
              <ProtectedRoute allowedRoles={['fuelman']}>
                <FuelmanDashboard />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
