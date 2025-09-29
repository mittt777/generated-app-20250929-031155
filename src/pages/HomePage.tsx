import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/PricingTable";
import { ArrowRight, BarChart, Users, FileText } from "lucide-react";
import { motion } from "framer-motion";
const features = [
  {
    icon: Users,
    title: "Customer Management",
    description: "Easily manage your customers, subscriptions, and billing cycles in one centralized place.",
  },
  {
    icon: FileText,
    title: "Automated Invoicing",
    description: "Generate and send professional, automated invoices to your customers without lifting a finger.",
  },
  {
    icon: BarChart,
    title: "Insightful Analytics",
    description: "Gain valuable insights into your revenue, churn, and customer growth with our detailed analytics.",
  },
];
export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 lg:py-40 text-center">
          <div className="container max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-display font-bold text-balance leading-tight">
                Subscription Billing, <br />
                <span className="text-primary">Simplified.</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Zenith Bills provides the complete toolkit for SaaS and subscription businesses to manage billing, customers, and revenue with ease.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6 transition-transform hover:scale-105">
                  <Link to="/auth">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 transition-transform hover:scale-105">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Features Section */}
        <section className="py-24 lg:py-32 bg-muted/40">
          <div className="container max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Everything you need to grow
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Focus on your product. We'll handle the complexities of billing.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 bg-background rounded-lg border shadow-sm"
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mb-6">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section className="py-24 lg:py-32">
          <div className="container max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose a plan that scales with your business. No surprises.
              </p>
            </div>
            <PricingTable />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}