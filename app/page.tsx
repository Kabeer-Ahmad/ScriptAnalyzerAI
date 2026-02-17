import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { ArrowRight, CheckCircle, FileText, MessageSquare, Sparkles, UploadCloud, Youtube, Star, ChevronDown, Shield, Zap, Globe, Settings, LineChart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "ScriptAnalyzerAI - Transform Audio & Video into Insights",
  description: "AI-powered platform to transcribe, analyze, and chat with your media files using AssemblyAI and Claude.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="w-full py-12 lg:py-20 xl:py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
          </div>

          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl/none">
                  Turn Audio & Video into <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Actionable Insights</span>
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground">
                  Transcribe interviews, meetings, and podcasts with 99% accuracy. Chat with your content to extract summaries, quotes, and more in seconds.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button size="lg" className="h-12 px-8 w-full sm:w-auto text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                      Start Analyzing Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="h-12 px-8 w-full sm:w-auto text-base rounded-full border-2 hover:bg-primary/5">
                      See How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span>Trusted by 2,000+ creators</span>
                </div>
              </div>

              {/* Abstract Dashboard Visual */}
              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none perspective-1000">
                <div className="relative rounded-xl bg-card border shadow-2xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500">
                  <div className="h-8 bg-muted border-b flex items-center px-4 gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    <div className="h-4 w-64 bg-muted-foreground/10 rounded-full ml-4"></div>
                  </div>
                  <div className="flex h-[300px] bg-background">
                    {/* Mock Sidebar */}
                    <div className="w-16 border-r bg-muted/30 flex flex-col items-center py-4 gap-4">
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                        <LineChart className="h-4 w-4" />
                      </div>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                        <Settings className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Mock Content */}
                    <div className="flex-1 p-4 grid gap-4 grid-cols-2">
                      {/* Left: Transcript View */}
                      <div className="space-y-3 p-3 rounded-lg border bg-card/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-2 w-20 bg-muted rounded"></div>
                          <div className="h-2 w-8 bg-muted rounded"></div>
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex gap-2">
                            <div className="h-2 w-8 bg-muted/50 rounded shrink-0"></div>
                            <div className={`h-2 rounded ${i === 2 ? 'w-3/4 bg-primary/20' : 'w-full bg-muted/30'}`}></div>
                          </div>
                        ))}
                        <div className="h-2 w-1/2 bg-muted/30 rounded"></div>
                      </div>

                      {/* Right: Analysis View */}
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg border bg-card shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-3 w-3 text-purple-500" />
                            <div className="h-2 w-24 bg-muted rounded"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-muted/20 rounded"></div>
                            <div className="h-2 w-5/6 bg-muted/20 rounded"></div>
                            <div className="h-2 w-4/6 bg-muted/20 rounded"></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg border bg-green-500/10 border-green-500/20">
                            <div className="h-4 w-4 rounded-full bg-green-500/20 mb-2"></div>
                            <div className="h-2 w-12 bg-green-500/20 rounded"></div>
                          </div>
                          <div className="p-2 rounded-lg border bg-blue-500/10 border-blue-500/20">
                            <div className="h-4 w-4 rounded-full bg-blue-500/20 mb-2"></div>
                            <div className="h-2 w-12 bg-blue-500/20 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Floating badge */}
                  <div className="absolute bottom-6 right-6 bg-background rounded-lg shadow-lg border p-3 flex items-center gap-3 animate-bounce">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Analysis Complete</p>
                      <p className="text-[10px] text-muted-foreground">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Trusted by teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Acme Corp', 'GlobalTech', 'Nebula', 'DevFlow', 'Studio X'].map((brand) => (
                <div key={brand} className="text-xl font-bold font-serif flex items-center gap-2">
                  <Globe className="h-5 w-5" /> {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                Everything you need to analyze media
              </h2>
              <p className="max-w-[700px] mx-auto text-lg text-muted-foreground">
                From accurate transcription to deep semantic analysis, we've got you covered with a complete suite of tools.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Accurate Transcription",
                  desc: "Powered by AssemblyAI, get industry-leading accuracy for your audio and video files.",
                  color: "text-blue-500"
                },
                {
                  icon: Sparkles,
                  title: "Smart Analysis",
                  desc: "Get instant summaries, key points, and actionable insights generated by Claude AI.",
                  color: "text-purple-500"
                },
                {
                  icon: MessageSquare,
                  title: "Interactive Chat",
                  desc: "Ask questions and have a conversation with your media content to find exactly what you need.",
                  color: "text-green-500"
                },
                {
                  icon: Youtube,
                  title: "YouTube Integration",
                  desc: "Directly process YouTube videos by pasting a URL. No manual download required.",
                  color: "text-red-500"
                },
                {
                  icon: Shield,
                  title: "Secure Storage",
                  desc: "Your files are encrypted and stored securely using Supabase Storage and RLS policies.",
                  color: "text-indigo-500"
                },
                {
                  icon: CheckCircle,
                  title: "Export Ready",
                  desc: "Download transcripts and analysis reports in Markdown, JSON, or Text formats.",
                  color: "text-orange-500"
                }
              ].map((feature, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl border bg-background p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                Simple 3-step process to unlock the value in your media.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0"></div>

              {[
                { step: 1, title: "Upload", desc: "Upload audio/video or paste a YouTube URL directly." },
                { step: 2, title: "Analyze", desc: "AI transcribes and generates a comprehensive analysis." },
                { step: 3, title: "Interact", desc: "Chat with your content to extract specific answers." }
              ].map((item) => (
                <div key={item.step} className="relative z-10 flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 shadow-sm">
                    <span className="text-3xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[600px] mx-auto text-lg text-muted-foreground">
                Start for free, upgrade as you scale. No hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Tier */}
              <div className="rounded-3xl border bg-background p-8 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Starter</h3>
                  <div className="text-3xl font-bold mt-2">$0 <span className="text-base font-normal text-muted-foreground">/ month</span></div>
                  <p className="text-sm text-muted-foreground mt-2">Perfect for trying out the platform.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['30 mins transcription/mo', 'Basic Analysis', '7-day file retention', 'Community Support'].map((feat) => (
                    <li key={feat} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/auth?tab=signup" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl">Get Started</Button>
                </Link>
              </div>

              {/* Pro Tier */}
              <div className="rounded-3xl border-2 border-primary bg-primary/5 p-8 flex flex-col relative transform md:-translate-y-4 shadow-xl">
                <div className="absolute top-0 right-0 -mt-3 mr-4">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Popular</span>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-primary">Pro</h3>
                  <div className="text-3xl font-bold mt-2">$29 <span className="text-base font-normal text-muted-foreground">/ month</span></div>
                  <p className="text-sm text-muted-foreground mt-2">For creators and professionals.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['10 hours transcription/mo', 'Advanced Claude Analysis', 'Unlimited file retention', 'Priority Support', 'Export to PDF/Docx'].map((feat) => (
                    <li key={feat} className="flex items-center text-sm font-medium">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/auth?tab=signup" className="w-full">
                  <Button size="lg" className="w-full rounded-xl shadow-lg">Upgrade to Pro</Button>
                </Link>
              </div>

              {/* Team Tier */}
              <div className="rounded-3xl border bg-background p-8 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Team</h3>
                  <div className="text-3xl font-bold mt-2">$99 <span className="text-base font-normal text-muted-foreground">/ month</span></div>
                  <p className="text-sm text-muted-foreground mt-2">Collaborate with your organization.</p>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['50 hours transcription/mo', 'Team Workspaces', 'SSO Authentication', 'API Access', 'Dedicated Account Manager'].map((feat) => (
                    <li key={feat} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/auth?tab=signup" className="w-full">
                  <Button variant="outline" className="w-full rounded-xl">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-20 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Loved by Content Creators</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote: "ScriptAnalyzerAI saved me hours of manual transcription. The chat feature is a game changer for finding quotes quickly.",
                  author: "Sarah J.",
                  role: "Podcast Host"
                },
                {
                  quote: "The analysis is shockingly accurate. It picks up nuances in my interviews that I missed myself. Highly recommended.",
                  author: "Mark T.",
                  role: "Journalist"
                },
                {
                  quote: "I use it for all my YouTube videos now. It helps me create chapters and summaries for the description in seconds.",
                  author: "Alex R.",
                  role: "YouTuber (500k+ subs)"
                }
              ].map((t, i) => (
                <div key={i} className="bg-background p-8 rounded-2xl border shadow-sm">
                  <div className="flex text-yellow-500 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{t.quote}"</p>
                  <div>
                    <p className="font-bold">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about the product and billing.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "How accurate is the transcription?",
                  a: "We leverage AssemblyAI's state-of-the-art speech recognition models which consistently achieve up to 99% accuracy on clear audio. The system handles various accents, dialects, and technical terminology effectively. For optimal results, ensure your audio has minimal background noise."
                },
                {
                  q: "What file formats and sources do you support?",
                  a: "We support a wide range of audio and video formats including MP3, WAV, M4A, MP4, MOV, and AVI. Additionally, you can directly paste YouTube URLs to process videos without downloading them first. The maximum file size for uploads is 500MB."
                },
                {
                  q: "How does the AI Analysis work?",
                  a: "After transcription, we process the text using Claude 3.5 Sonnet, one of the most advanced AI models available. It analyzes the content to generate concise summaries, identify key points, determine the target audience, and provide actionable insights. You can also chat with your media to ask specific questions."
                },
                {
                  q: "Is my data secure and private?",
                  a: "Security is our top priority. Your files are encrypted both in transit and at rest using enterprise-grade encryption. We use Row Level Security (RLS) to ensure only you can access your data. We do not use your data to train our models."
                },
                {
                  q: "What is the difference between the Free and Pro plan?",
                  a: "The Free plan allows you to try out the service with limited minutes per month. The Pro plan unlocks higher usage limits, priority processing, advanced analysis features, and priority support. You can upgrade or downgrade at any time."
                },
                {
                  q: "Can I export the transcripts and analysis?",
                  a: "Yes! You can export your transcripts as text or subtitle files (SRT/VTT). The analysis reports can be copied or downloaded as Markdown or PDF files, making it easy to integrate into your workflow or share with your team."
                },
                {
                  q: "Do you support multiple languages?",
                  a: "Currently, our primary focus is on English transcription and analysis to ensure the highest quality. We are actively working on adding support for major global languages including Spanish, French, German, and more in upcoming updates."
                },
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes, there are no long-term contracts. You can cancel your subscription at any time from your dashboard. Your access to Pro features will continue until the end of your current billing period."
                }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to transform your media?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                  Join thousands of users who are saving hours of time with ScriptAnalyzerAI.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth?tab=signup">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full shadow-2xl hover:shadow-xl transition-all">
                    Get Started for Free
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-primary-foreground/60 mt-4">No credit card required for free tier.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
