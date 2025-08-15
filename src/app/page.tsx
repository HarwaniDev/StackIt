import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Users, Trophy, Search, BookOpen, ArrowRight } from "lucide-react"
import Link from "next/link"
import AuthHeader from "@/components/AuthHeader"

const features = [
  {
    icon: MessageSquare,
    title: "Share Experiences",
    description: "Post your real interview stories to help others prepare and learn.",
  },
  {
    icon: Search,
    title: "Search Interviews",
    description: "Find interview experiences by company or role.",
  },
  {
    icon: BookOpen,
    title: "Detailed Insights",
    description: "Read in-depth breakdowns of interview rounds, questions, and tips.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AuthHeader />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-black leading-tight tracking-tight">
                Real Interview Stories.
                <span className="block">Real Insights.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Share and discover authentic interview experiences to help developers prepare better and succeed in their career journey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/home">
                <Button
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 px-8 py-4 text-lg cursor-pointer"
                >
                  Share Your Experience
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-black hover:bg-gray-100 px-8 py-4 text-lg bg-transparent cursor-pointer"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-black tracking-tight mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600">Simple tools to share and discover interview experiences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-3 rounded-lg border border-gray-300 mb-6">
                    <feature.icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Importance Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-black tracking-tight">Why StackIt Matters</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Interview preparation shouldn&apos;t be a guessing game. By sharing real experiences, we create a transparent community where developers can learn from each other&apos;s journeys, understand what to expect, and approach interviews with confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto border border-gray-300 rounded-lg flex items-center justify-center">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black">Community Driven</h3>
                <p className="text-gray-600">Built by developers, for developers. Real stories from real people.</p>
              </div>

              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto border border-gray-300 rounded-lg flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black">Better Preparation</h3>
                <p className="text-gray-600">Learn from others&apos; experiences to prepare more effectively for your interviews.</p>
              </div>

              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto border border-gray-300 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-black">Transparent Process</h3>
                <p className="text-gray-600">Demystify the interview process with honest, detailed accounts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
              Ready to contribute?
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Join our community of developers sharing interview experiences to help each other succeed.
            </p>
            <Link href="/home">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg cursor-pointer">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">StackIt</h3>
            <p className="text-gray-400 mb-6">
              The platform for sharing and discovering real interview experiences.
            </p>
            <div className="flex justify-center gap-6 text-gray-400 text-sm">
              <Link href="/" className="hover:text-white">Experiences</Link>
              <Link href="/home" className="hover:text-white">Share Story</Link>
              <Link href="/profile" className="hover:text-white">Profile</Link>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-gray-400 text-sm">
            <p>made with love ❤️ for developers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}