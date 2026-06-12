import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, Phone, Mail } from "lucide-react";

export default function Home() {
  const [isSticky, setIsSticky] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", city: "", vehicleType: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const submitLead = trpc.leads.submit.useMutation();

  const cities = ["Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Jaipur", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Patna"];
  const vehicleTypes = ["Bike", "Car", "Auto", "Van"];

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        setIsSticky(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.city) {
      newErrors.city = "Please select a city";
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Please select a vehicle type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLead.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        vehicleType: formData.vehicleType,
      });

      toast.success("Application submitted successfully! We'll contact you soon.");
      setFormData({ name: "", phone: "", city: "", vehicleType: "" });
      setErrors({});
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation Bar */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSticky
            ? "bg-white shadow-lg border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold text-blue-600">Amazon Flex</div>
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => scrollToSection("how-it-works")} className="text-gray-700 hover:text-blue-600 transition text-sm font-medium">
                  How It Works
                </button>
                <button onClick={() => scrollToSection("why-flex")} className="text-gray-700 hover:text-blue-600 transition text-sm font-medium">
                  Why Amazon Flex
                </button>
                <button onClick={() => scrollToSection("requirements")} className="text-gray-700 hover:text-blue-600 transition text-sm font-medium">
                  Requirements
                </button>
                <button onClick={() => scrollToSection("cities")} className="text-gray-700 hover:text-blue-600 transition text-sm font-medium">
                  Cities
                </button>
                <button onClick={() => scrollToSection("faq")} className="text-gray-700 hover:text-blue-600 transition text-sm font-medium">
                  FAQ
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://play.google.com/store/apps/details?id=com.amazon.flex" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="hidden sm:inline-flex">
                  Download App
                </Button>
              </a>
              <Button onClick={() => scrollToSection("apply")} className="bg-blue-600 hover:bg-blue-700">
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Adjust your work,<br />
                <span className="text-blue-600">not your life.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Earn up to <span className="font-bold text-blue-600">₹140/hr</span> delivering packages with Amazon Flex. Work when you want, earn what you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => scrollToSection("apply")}>
                  Start Earning Today
                </Button>
                <Button size="lg" variant="outline" onClick={() => scrollToSection("how-it-works")}>
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663160469904/acPotk4C5dppREM7PGq9bc/hero-delivery-driver-5jzoFPwbHmjva63sLnbKKm.webp"
                alt="Amazon Flex Delivery Driver"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Reserve a block",
                description: "Choose delivery blocks that fit your schedule. Plan your week or pick blocks daily.",
                icon: "📅",
              },
              {
                step: 2,
                title: "Make deliveries",
                description: "Use your own vehicle to deliver Amazon packages to customers in your area.",
                icon: "📦",
              },
              {
                step: 3,
                title: "Get paid",
                description: "Earn money on the day(s) you choose. Flexible payment options available.",
                icon: "💰",
              },
            ].map((item) => (
              <Card key={item.step} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Amazon Flex Section */}
      <section id="why-flex" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Amazon Flex?</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Flexible Scheduling",
                description: "Work only when you want. Choose the blocks that fit your schedule perfectly.",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663160469904/acPotk4C5dppREM7PGq9bc/flexible-schedule-icon-ayqYq68WFrsCSveV3twamR.webp",
              },
              {
                title: "Extra Income",
                description: "Earn up to ₹140/hr. Competitive rates with potential for additional earnings.",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663160469904/acPotk4C5dppREM7PGq9bc/extra-income-icon-cq3TdHnvtFGTTVAC8PZRkq.webp",
              },
              {
                title: "Work-Life Balance",
                description: "Maintain your lifestyle while earning. Balance work with what matters to you.",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663160469904/acPotk4C5dppREM7PGq9bc/work-life-balance-icon-MxaJUJLF5b3KtyHvBkVkAh.webp",
              },
            ].map((benefit, idx) => (
              <Card key={idx} className="p-8 text-center hover:shadow-lg transition-shadow">
                <img src={benefit.image} alt={benefit.title} className="w-24 h-24 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="requirements" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Requirements</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Age", description: "Must be 18 years or older" },
              { title: "Valid License", description: "Valid driving license for your vehicle type" },
              { title: "Vehicle", description: "Own a bike, car, auto, or van in good condition" },
              { title: "Smartphone", description: "Android or iOS smartphone with GPS capability" },
              { title: "Documents", description: "Aadhar, PAN, and vehicle registration documents" },
              { title: "Bank Account", description: "Active bank account for payments" },
            ].map((req, idx) => (
              <Card key={idx} className="p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{req.title}</h3>
                  <p className="text-gray-600">{req.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section id="cities" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Service Areas</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {cities.map((city) => (
              <Card key={city} className="p-6 flex items-center gap-3 hover:shadow-lg transition-shadow hover:border-blue-300">
                <div className="w-5 h-5 text-blue-600 flex-shrink-0">📍</div>
                <span className="text-lg font-semibold text-gray-900">{city}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Now Form Section */}
      <section id="apply" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Start Earning?</h2>
            <p className="text-blue-100 text-lg">Fill out the form below and we'll get you started</p>
          </div>

          <Card className="p-8 md:p-12" ref={formRef}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-900 font-semibold mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-900 font-semibold mb-2 block">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your 10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={`border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="city" className="text-gray-900 font-semibold mb-2 block">
                  City
                </Label>
                <Select value={formData.city} onValueChange={(value) => {
                  setFormData({ ...formData, city: value });
                  if (errors.city) setErrors({ ...errors, city: "" });
                }}>
                  <SelectTrigger className={`border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.city ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="vehicle" className="text-gray-900 font-semibold mb-2 block">
                  Vehicle Type
                </Label>
                <Select value={formData.vehicleType} onValueChange={(value) => {
                  setFormData({ ...formData, vehicleType: value });
                  if (errors.vehicleType) setErrors({ ...errors, vehicleType: "" });
                }}>
                  <SelectTrigger className={`border-gray-300 focus:border-blue-600 focus:ring-blue-600 ${errors.vehicleType ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select your vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleType && <p className="text-red-600 text-sm mt-1">{errors.vehicleType}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "How much can I earn with Amazon Flex?",
                answer: "Most drivers earn up to ₹140 per hour. Actual earnings depend on your location, available deliveries, and other factors.",
              },
              {
                question: "Can I choose when to work?",
                answer: "Yes! You have complete flexibility. Reserve blocks in advance or pick them daily based on your availability.",
              },
              {
                question: "What vehicle do I need?",
                answer: "You can use a bike, car, auto, or van. The vehicle must be in good condition and registered in your name.",
              },
              {
                question: "How do I get paid?",
                answer: "You get paid on the day(s) you choose through direct bank transfer. Payment is processed quickly and securely.",
              },
              {
                question: "What documents do I need?",
                answer: "You'll need Aadhar, PAN, valid driving license, vehicle registration, and proof of bank account.",
              },
              {
                question: "Is there a minimum commitment?",
                answer: "No! There's no minimum commitment. Work as much or as little as you want.",
              },
            ].map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Amazon Flex</h3>
              <p className="text-gray-400">Earn money delivering packages with flexible scheduling.</p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Support</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>1800-1200-2076</span>
                </div>
                <div className="text-sm text-gray-500">Daily, 10:00am-07:00pm IST</div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-5 h-5" />
                <a href="mailto:amazonflex-support@amazon.in" className="hover:text-blue-400 transition">
                  amazonflex-support@amazon.in
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
              <p>&copy; 2026 Amazon.com, Inc. or its affiliates</p>
              <div className="flex gap-6">
                <a href="#terms" className="hover:text-blue-400 transition">
                  Site Terms
                </a>
                <a href="#privacy" className="hover:text-blue-400 transition">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
