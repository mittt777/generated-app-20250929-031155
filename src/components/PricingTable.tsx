import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "For new businesses getting off the ground.",
    features: [
      { text: "Up to 500 customers", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
      { text: "Custom branding", included: false },
      { text: "API access", included: false },
    ],
    cta: "Choose Starter",
  },
  {
    name: "Pro",
    price: "$99",
    description: "For growing businesses that need more power.",
    features: [
      { text: "Up to 2,500 customers", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority email support", included: true },
      { text: "Custom branding", included: true },
      { text: "API access", included: false },
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For established businesses with custom needs.",
    features: [
      { text: "Unlimited customers", included: true },
      { text: "Full analytics suite", included: true },
      { text: "Dedicated support", included: true },
      { text: "Custom branding", included: true },
      { text: "API access", included: true },
    ],
    cta: "Contact Sales",
  },
];
export function PricingTable() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            "flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
            plan.popular ? "border-primary shadow-lg ring-2 ring-primary" : "border"
          )}
        >
          {plan.popular && (
            <div className="bg-primary text-primary-foreground text-center text-sm font-bold py-1 rounded-t-lg">
              Most Popular
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-6">
              <span className="text-5xl font-bold">{plan.price}</span>
              {plan.price !== "Custom" && (
                <span className="text-muted-foreground">/ month</span>
              )}
            </div>
            <ul className="space-y-4">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-3">
                  {feature.included ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={cn(!feature.included && "text-muted-foreground")}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full" variant={plan.popular ? "default" : "outline"}>
              <Link to="/auth">{plan.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}