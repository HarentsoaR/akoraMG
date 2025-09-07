"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { motion } from "framer-motion"
import { Mail, MailCheck, Chrome, ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const isValidEmail = (email: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)

export default function LoginPage() {
  const router = useRouter()
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const cached = localStorage.getItem("last-email")
    if (cached) setEmail(cached)
  }, [])

  const emailOk = useMemo(() => isValidEmail(email), [email])

  const onMagic = async () => {
    if (!emailOk) {
      toast.error("Please enter a valid email")
      return
    }
    setLoading(true)
    localStorage.setItem("last-email", email)
    const res = await signInWithEmail(email)
    setLoading(false)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setSent(true)
    toast.success("Magic link sent! Check your inbox.")
  }

  const onGoogle = async () => {
    setGoogleLoading(true)
    const res = await signInWithGoogle()
    setGoogleLoading(false)
    if (res.error) toast.error(res.error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-lg">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-orange-500" />
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <p className="text-sm text-muted-foreground">Sign in to continue to Fivoarana</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {sent ? (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="mb-1 flex items-center gap-2 font-medium">
                    <MailCheck className="h-4 w-4 text-primary" />
                    Magic link sent
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We’ve sent a link to <span className="font-medium text-foreground">{email}</span>. Open it on this device to finish signing in.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" onClick={() => setSent(false)}>Use a different email</Button>
                    <Button onClick={onMagic}>Resend</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && onMagic()}
                      className="pl-10"
                    />
                  </div>
                  <Button className="w-full" onClick={onMagic} disabled={!emailOk || loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Send magic link
                  </Button>
                  <div className="text-center text-xs text-muted-foreground">or</div>
                  <Button variant="outline" className="w-full" onClick={onGoogle} disabled={googleLoading}>
                    {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
                    Continue with Google
                  </Button>
                </>
              )}

              <div className="pt-2 text-center text-xs text-muted-foreground">
                By continuing, you agree to our Terms and Privacy Policy.
              </div>

              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={() => router.push("/")}> 
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}


