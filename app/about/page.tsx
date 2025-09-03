"use client"

import { motion } from "framer-motion"
import { HeartHandshake, Leaf, ShieldCheck, Users, Handshake, Compass, Mail } from "lucide-react"

import { Header } from "@/components/layout/header"
import { MobileNavigation } from "@/components/navigation/mobile-navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pb-20 md:pb-8">
        {/* Hero */}
        <section className="bg-gradient-to-r from-primary/10 to-orange-500/10 py-16">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">About Fivoarana</h1>
              <p className="text-lg text-muted-foreground">
                Empowering Malagasy artisans through technology, storytelling, and fair opportunities.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold text-xl">Our Mission</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect artisans to global audiences, preserve cultural heritage, and improve livelihoods through a
                    trusted marketplace and ethical commerce.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Compass className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold text-xl">Our Vision</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A sustainable ecosystem where traditional craftsmanship thrives alongside modern design and
                    responsible trade.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold text-xl">Our Values</h3>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    <li>• Authenticity and respect for tradition</li>
                    <li>• Fair partnerships and transparency</li>
                    <li>• Sustainability and community impact</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-2xl font-bold mb-3">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Fivoarana was born from a simple idea: artisans deserve fair access to markets and tools that elevate
                  their craft. We partner closely with makers across Madagascar to document techniques, ensure ethical
                  sourcing, and bring their stories to life.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By combining modern technology with cultural stewardship, we help artisans reach new customers while
                  preserving heritage for future generations.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card>
                  <CardContent className="p-6 grid grid-cols-2 gap-6">
                    <div>
                      <Users className="h-6 w-6 text-primary" />
                      <div className="mt-2 text-2xl font-bold">250+</div>
                      <div className="text-sm text-muted-foreground">Artisans Supported</div>
                    </div>
                    <div>
                      <Handshake className="h-6 w-6 text-primary" />
                      <div className="mt-2 text-2xl font-bold">1,400+</div>
                      <div className="text-sm text-muted-foreground">Fair Trade Orders</div>
                    </div>
                    <div>
                      <Leaf className="h-6 w-6 text-primary" />
                      <div className="mt-2 text-2xl font-bold">70%</div>
                      <div className="text-sm text-muted-foreground">Sustainable Materials</div>
                    </div>
                    <div>
                      <ShieldCheck className="h-6 w-6 text-primary" />
                      <div className="mt-2 text-2xl font-bold">100%</div>
                      <div className="text-sm text-muted-foreground">Ethical Compliance</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Milestones</h2>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {[
                  { year: "2022", title: "Idea & Research", desc: "Co-creating with artisan communities." },
                  { year: "2023", title: "Pilot Launch", desc: "First 100 artisans onboarded." },
                  { year: "2024", title: "Marketplace v1", desc: "National roll-out and partnerships." },
                  { year: "2025", title: "Global Expansion", desc: "Cross-border logistics and reach." },
                ].map((item) => (
                  <div key={item.year} className="relative">
                    <div className="absolute -left-[9px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                    <Card>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="text-sm font-semibold w-16">{item.year}</div>
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[{
                q: "How do you verify artisans?",
                a: "We work directly with cooperatives and local partners to validate identity, techniques, and sourcing."
              },{
                q: "Do artisans receive fair compensation?",
                a: "Yes. We use transparent pricing and prioritize fair margins for makers."
              },{
                q: "Where do you ship?",
                a: "We currently ship domestically and are rolling out international delivery."
              },{
                q: "Can I place custom orders?",
                a: "Many artisans accept custom requests. Look for the Custom Orders badge on profiles."
              }].map((item, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="font-medium">{item.q}</div>
                    <div className="text-sm text-muted-foreground mt-1">{item.a}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-xl">Partner with Fivoarana</h3>
                  <p className="text-sm text-muted-foreground">Brands, NGOs, and buyers—let’s create impact together.</p>
                </div>
                <Button>
                  <Mail className="h-4 w-4 mr-2" /> Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <MobileNavigation />
    </div>
  )
}


