import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext";
import BookAppointment from "./pages/BookAppointment";
import RequestAppointment from "./pages/RequestAppointment";
import SelectTime from "./pages/SelectTime";
import VisitDetails from "./pages/VisitDetails";
import PatientForm from "./pages/PatientForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppointmentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<BookAppointment />} />
            <Route path="/request-appointment" element={<RequestAppointment />} />
            <Route path="/select-time" element={<SelectTime />} />
            <Route path="/visit-details" element={<VisitDetails />} />
            <Route path="/patient-form" element={<PatientForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppointmentProvider>
  </QueryClientProvider>
);

export default App;
