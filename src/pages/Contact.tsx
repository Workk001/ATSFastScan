import { useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Clock, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:contact@atsfastscan.com?subject=${encodeURIComponent(formData.subject || "Contact from ATS FastScan")}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      description: "contact@atsfastscan.com",
      detail: "We'll respond ASAP",
    },
    {
      icon: MessageSquare,
      title: "Support",
      description: "help@atsfastscan.com",
      detail: "Browse our FAQ section",
    },
    {
      icon: Clock,
      title: "Hours",
      description: "Mon - Fri: 9AM - 6PM",
      detail: "Weekend support available",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact ATS FastScan</title>
        <meta name="description" content="Get in touch with the ATS FastScan team for support, feedback, or partnership inquiries." />
        <link rel="canonical" href="https://www.atsfastscan.com/contact" />
      </Helmet>
      <main className="pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Contact Us
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question, feedback, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="text-center p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-card/50 border border-border/50"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{info.title}</h3>
                <p className="text-xs sm:text-sm text-foreground mb-1 break-all">{info.description}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{info.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-card/30 rounded-2xl sm:rounded-3xl border border-border/50 p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="bg-background/50 resize-none"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-xl">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  This will open your email client to send the message.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
