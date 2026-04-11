import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
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
import Marketplace from "./pages/Marketplace.tsx";
import ServiceGigs from "./pages/ServiceGigs.tsx";
import ServiceDetail from "./pages/ServiceDetail.tsx";
import ServiceForm from "./pages/ServiceForm.tsx";
import Messages from "./pages/Messages.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Analytics from "./pages/Analytics.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import TemplateDetail from "./pages/TemplateDetail.tsx";
import Launch from "./pages/Launch.tsx";
import Partnership from "./pages/Partnership.tsx";

const queryClient = new QueryClient();

function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
      <ChatWidget />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/product/:id", element: <ProductDetail /> },
      { path: "/auth", element: <Auth /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/products/:id", element: <ProductForm /> },
      { path: "/dashboard/services/:id", element: <ServiceForm /> },
      { path: "/dashboard/profile", element: <Profile /> },
      { path: "/dashboard/analytics", element: <Analytics /> },
      { path: "/dashboard/cabinet", element: <SellerCabinet /> },
      { path: "/creator/:id", element: <CreatorProfile /> },
      { path: "/creators", element: <Creators /> },
      { path: "/marketplace", element: <Marketplace /> },
      { path: "/gigs", element: <ServiceGigs /> },
      { path: "/service/:id", element: <ServiceDetail /> },
      { path: "/messages", element: <Messages /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/admin", element: <AdminPanel /> },
      { path: "/templates/:id", element: <TemplateDetail /> },
      { path: "/launch", element: <Launch /> },
      { path: "/partnership", element: <Partnership /> },
      { path: "/privacy", element: <PrivacyPolicy /> },
      { path: "/terms", element: <TermsOfService /> },
      { path: "/cookies", element: <CookiePolicy /> },
      { path: "/services", element: <Services /> },
      { path: "/unsubscribe", element: <Unsubscribe /> },
      { path: "/consultation/:id", element: <Consultation /> },
      { path: "/chat", element: <Chat /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
