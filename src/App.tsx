import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProductForm from "./pages/ProductForm.tsx";
import Profile from "./pages/Profile.tsx";
import CreatorProfile from "./pages/CreatorProfile.tsx";
import Creators from "./pages/Creators.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import NotFound from "./pages/NotFound.tsx";
import Services from "./pages/Services.tsx";
import Unsubscribe from "./pages/Unsubscribe.tsx";
import Consultation from "./pages/Consultation.tsx";
import Chat from "./pages/Chat.tsx";
import ChatWidget from "./components/ChatWidget.tsx";
import SellerCabinet from "./pages/SellerCabinet.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/products/:id" element={<ProductForm />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/creator/:id" element={<CreatorProfile />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/services" element={<Services />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/consultation/:id" element={<Consultation />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dashboard/cabinet" element={<SellerCabinet />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatWidget />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
