import templateSaasDashboard from "@/assets/template-saas-dashboard.jpg";
import templateEcommerce from "@/assets/template-ecommerce.jpg";
import templatePortfolio from "@/assets/template-portfolio.jpg";
import templateRestaurant from "@/assets/template-restaurant.jpg";
import templateLanding from "@/assets/template-landing.jpg";
import templateBlog from "@/assets/template-blog.jpg";

export interface WebTemplate {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  longDescription: string;
  features: string[];
  techStack: string[];
  demoUrl?: string;
  isFree: boolean;
  downloads: string;
  rating: number;
}

export const templates: WebTemplate[] = [
  {
    id: "starter-portfolio",
    name: "Starter Portfolio",
    category: "Portfolio",
    price: 0,
    image: templatePortfolio,
    description: "Clean personal portfolio with project gallery, about section, and contact form. Perfect for freelancers.",
    longDescription: "Launch your online presence in minutes with this polished portfolio template. Features a hero section with animated entrance, a filterable project gallery, an about page with skill bars, testimonial carousel, and a working contact form. Fully responsive and dark-mode ready.",
    features: ["Responsive design", "Project gallery", "Contact form", "Dark mode", "SEO optimized", "Smooth animations"],
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    isFree: true,
    downloads: "8.2k",
    rating: 4.8,
  },
  {
    id: "starter-landing",
    name: "Starter Landing Page",
    category: "Landing Page",
    price: 0,
    image: templateLanding,
    description: "High-converting landing page with hero, features, pricing, and CTA sections. Ready to launch.",
    longDescription: "A conversion-optimized landing page template designed for SaaS products, apps, and digital services. Includes a bold hero section, feature grid with icons, testimonial slider, pricing table with toggle, FAQ accordion, and a sticky CTA bar. A/B test-friendly with clean, modular code.",
    features: ["Hero + CTA", "Feature grid", "Pricing table", "FAQ section", "Newsletter signup", "Mobile-first"],
    techStack: ["React", "Tailwind CSS", "TypeScript"],
    isFree: true,
    downloads: "12.4k",
    rating: 4.7,
  },
  {
    id: "starter-blog",
    name: "Starter Blog",
    category: "Blog",
    price: 0,
    image: templateBlog,
    description: "Minimalist blog template with article cards, categories, and reading progress. Start writing today.",
    longDescription: "A distraction-free blog template focused on readability. Features a clean article listing with category filters, individual post pages with a reading progress bar, an author bio section, related posts, and newsletter opt-in. Supports Markdown content out of the box.",
    features: ["Article listing", "Category filters", "Reading progress", "Author bio", "Related posts", "Markdown support"],
    techStack: ["React", "Tailwind CSS", "React Markdown"],
    isFree: true,
    downloads: "6.1k",
    rating: 4.6,
  },
  {
    id: "pro-saas-dashboard",
    name: "SaaS Dashboard Pro",
    category: "Dashboard",
    price: 79,
    image: templateSaasDashboard,
    description: "Full-featured admin dashboard with charts, tables, auth, and role management. Production-ready.",
    longDescription: "A comprehensive SaaS dashboard template with everything you need to build an admin panel or internal tool. Includes 15+ page layouts, interactive charts (area, bar, pie, line), data tables with sorting/filtering/pagination, user management, role-based access, settings pages, and a notification system. Built for performance with lazy-loaded routes.",
    features: ["15+ page layouts", "Interactive charts", "Data tables", "Auth + roles", "Notification system", "Dark mode"],
    techStack: ["React", "TypeScript", "Recharts", "Tailwind CSS"],
    isFree: false,
    downloads: "3.4k",
    rating: 4.9,
  },
  {
    id: "pro-ecommerce",
    name: "E-Commerce Starter",
    category: "E-Commerce",
    price: 99,
    image: templateEcommerce,
    description: "Complete online store with product pages, cart, checkout, and Stripe payments integration.",
    longDescription: "Everything you need to launch an online store. This template includes a product catalog with filters, individual product pages with image galleries, a shopping cart with quantity management, a multi-step checkout flow, Stripe payment integration, order confirmation emails, and an admin panel for managing products and orders. Fully responsive with optimized mobile experience.",
    features: ["Product catalog", "Shopping cart", "Stripe checkout", "Order management", "Admin panel", "Mobile optimized"],
    techStack: ["React", "TypeScript", "Stripe", "Tailwind CSS"],
    isFree: false,
    downloads: "2.1k",
    rating: 4.8,
  },
  {
    id: "pro-restaurant",
    name: "Restaurant & Food",
    category: "Business",
    price: 59,
    image: templateRestaurant,
    description: "Beautiful restaurant website with menu, reservation system, gallery, and location map.",
    longDescription: "A mouth-watering restaurant template designed to bring guests through the door. Features a visual menu with categories and dietary filters, an online reservation system with date/time picker, a photo gallery with lightbox, customer reviews, location map with directions, and social media integration. Warm, inviting design that works perfectly on phones.",
    features: ["Visual menu", "Reservation system", "Photo gallery", "Reviews section", "Location map", "Social links"],
    techStack: ["React", "Tailwind CSS", "Framer Motion"],
    isFree: false,
    downloads: "1.8k",
    rating: 4.7,
  },
];

export const getTemplateById = (id: string) => templates.find((t) => t.id === id);
