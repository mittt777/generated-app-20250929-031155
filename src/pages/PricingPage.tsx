import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/PricingTable";
export function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="py-24 lg:py-32">
          <div className="container max-w-7xl text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-balance">
              Find the perfect plan
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Start for free, then upgrade as you grow. All plans include our core features, with no hidden fees.
            </p>
          </div>
        </section>
        <section className="pb-24 lg:pb-32">
          <div className="container max-w-7xl">
            <PricingTable />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}