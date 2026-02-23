import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, BarChart3, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { Alerts } from "@/components/alerts/alerts";

export default async function Home() {
  const { userId } = await auth();
  
  // If logged in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Shorten Your Links,
            <span className="text-primary"> Amplify Your Reach</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Create short, memorable links in seconds. Track performance, manage your URLs, and make every click count.
          </p>
          <Alerts />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/50">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to Manage Your Links
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features designed to help you create, track, and optimize your shortened links
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Link2 className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Easy Link Shortening</CardTitle>
              <CardDescription>
                Transform long URLs into short, shareable links instantly with just one click
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Track clicks, geographic data, and referral sources to understand your audience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Enterprise-grade security with authentication and data protection you can trust
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Instant redirects with minimal latency ensure the best experience for your users
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Paste Your URL</h3>
            <p className="text-muted-foreground">
              Copy your long URL and paste it into our simple interface
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Shorten & Customize</h3>
            <p className="text-muted-foreground">
              Generate a short link and optionally customize it to match your brand
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Share & Track</h3>
            <p className="text-muted-foreground">
              Share your link anywhere and monitor its performance in real-time
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/50">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="flex flex-col items-center text-center space-y-6 py-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Join thousands of users who trust our platform for their link management needs
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Create Your First Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 LinkShortener. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
