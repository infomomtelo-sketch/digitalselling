import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Handshake, TrendingUp, Users, Zap, CheckCircle2 } from "lucide-react";

const partnershipSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(200),
  contact_name: z.string().trim().min(1, "Contact name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  website: z.string().trim().url("Invalid URL").max(500),
  category: z.string().min(1, "Select a category"),
  product_description: z.string().trim().min(20, "Describe your product (min 20 chars)").max(2000),
  audience_size: z.string().min(1, "Select audience size"),
  commission_model: z.string().min(1, "Select preferred model"),
  additional_notes: z.string().max(1000).optional(),
});

type PartnershipForm = z.infer<typeof partnershipSchema>;

const benefits = [
  { icon: Users, title: "Access Our Audience", desc: "Reach thousands of digital creators actively looking for tools" },
  { icon: TrendingUp, title: "Revenue Share", desc: "Earn recurring commissions on every sale through DropVault" },
  { icon: Zap, title: "Zero Setup", desc: "We handle listing, marketing, and customer discovery" },
];

export default function Partnership() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartnershipForm>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      company_name: "",
      contact_name: "",
      email: "",
      website: "",
      category: "",
      product_description: "",
      audience_size: "",
      commission_model: "",
      additional_notes: "",
    },
  });

  const onSubmit = async (data: PartnershipForm) => {
    const { error } = await supabase.from("partnership_applications").insert({
      company_name: data.company_name,
      contact_name: data.contact_name,
      email: data.email,
      website: data.website,
      category: data.category,
      product_description: data.product_description,
      audience_size: data.audience_size,
      commission_model: data.commission_model,
      additional_notes: data.additional_notes || null,
    });

    if (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-10 pb-10 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Application Received!</h2>
            <p className="text-muted-foreground">
              We'll review your partnership application and get back to you within 48 hours.
            </p>
            <Button asChild className="mt-4">
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to DropVault
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="container max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Handshake className="w-4 h-4" /> Partnership Program
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          List Your Product on DropVault
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Partner with us to reach digital creators worldwide. We promote, you deliver. Simple affiliate model, real results.
        </p>
      </section>

      {/* Benefits */}
      <section className="container max-w-5xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <Card key={b.title} className="text-center">
              <CardContent className="pt-6 space-y-3">
                <b.icon className="w-10 h-10 mx-auto text-primary" />
                <h3 className="font-semibold text-lg">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="container max-w-2xl mx-auto px-4 pb-20">
        <Card>
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold mb-6">Apply for Partnership</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="company_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl><Input placeholder="Acme Tools" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="contact_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl><Input placeholder="Jane Smith" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="jane@acme.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="website" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl><Input placeholder="https://acme.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="design">Design Assets</SelectItem>
                          <SelectItem value="templates">Templates</SelectItem>
                          <SelectItem value="courses">Courses & Education</SelectItem>
                          <SelectItem value="software">Software & SaaS</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="audience_size" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Audience Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="<1k">Under 1,000</SelectItem>
                          <SelectItem value="1k-10k">1,000 – 10,000</SelectItem>
                          <SelectItem value="10k-100k">10,000 – 100,000</SelectItem>
                          <SelectItem value="100k+">100,000+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="commission_model" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Commission Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="revenue-share">Revenue Share (% per sale)</SelectItem>
                        <SelectItem value="flat-fee">Flat Fee per Listing</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Fee + Revenue Share)</SelectItem>
                        <SelectItem value="open">Open to Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="product_description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl><Textarea placeholder="Tell us about your product and why it's a great fit for DropVault creators..." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="additional_notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (optional)</FormLabel>
                    <FormControl><Textarea placeholder="Anything else you'd like us to know..." rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
