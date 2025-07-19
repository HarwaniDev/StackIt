"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Users, Trophy, Zap, Search, BookOpen, Star, ArrowRight, CheckCircle, Code } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signIn, signOut, useSession } from "next-auth/react"

const features = [
  {
    icon: MessageSquare,
    title: "Ask & Answer",
    description: "Get help from a community of developers and share your knowledge with others.",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find answers quickly with our intelligent search and filtering system.",
    color: "from-green-500 to-blue-500",
  },
  {
    icon: Trophy,
    title: "Reputation System",
    description: "Build your reputation by providing helpful answers and asking great questions.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Get instant notifications when someone answers your questions or comments.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: BookOpen,
    title: "Rich Text Editor",
    description: "Format your questions and answers with code syntax highlighting and markdown.",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of developers helping each other grow and learn together.",
    color: "from-indigo-500 to-purple-500",
  },
]

const stats = [
  { number: "10K+", label: "Questions Asked", icon: MessageSquare },
  { number: "25K+", label: "Answers Given", icon: CheckCircle },
  { number: "5K+", label: "Active Users", icon: Users },
  { number: "98%", label: "Questions Resolved", icon: Trophy },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    company: "TechCorp",
    content:
      "StackIt has become my go-to platform for getting quick, accurate answers. The community is incredibly helpful!",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Mike Rodriguez",
    role: "Backend Engineer",
    company: "StartupXYZ",
    content:
      "I love how clean and organized everything is. Finding solutions to complex problems has never been easier.",
    avatar: "MR",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Frontend Developer",
    company: "DesignStudio",
    content: "The syntax highlighting and code formatting features make it perfect for sharing technical solutions.",
    avatar: "EJ",
    rating: 5,
  },
]

const popularTags = [
  { name: "React", count: "2.1k", color: "bg-blue-500" },
  { name: "JavaScript", count: "3.5k", color: "bg-yellow-500" },
  { name: "Python", count: "2.8k", color: "bg-green-500" },
  { name: "SQL", count: "1.9k", color: "bg-purple-500" },
  { name: "Node.js", count: "1.6k", color: "bg-emerald-500" },
  { name: "CSS", count: "1.4k", color: "bg-pink-500" },
  { name: "TypeScript", count: "1.2k", color: "bg-indigo-500" },
  { name: "Next.js", count: "980", color: "bg-gray-700" },
]

export default function LandingPage() {

  const session = useSession();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/landing" className="text-2xl font-bold text-white hover:text-blue-100">
                StackIt
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
                  Features
                </Link>
                <Link
                  href="#community"
                  className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
                >
                  Community
                </Link>
                <Link href="#about" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
                  About
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => {
                  !session.data?.user ? signIn("google", {callbackUrl: "http://localhost:3000/home"}) : signOut({callbackUrl: "http://localhost:3000"})
                }}>
                  {!session.data?.user ? "Sign in": "Sign Out"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
                  🚀 Join 5,000+ Developers
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Get Answers.
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    Share Knowledge.
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  StackIt is the modern Q&A platform where developers help each other solve problems, share knowledge,
                  and build amazing things together.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg"
                  >
                    Start Asking Questions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg bg-transparent"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Avatar key={i} className="border-2 border-white h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=U${i}`} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                        U{i}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold text-gray-900">5,000+ developers</div>
                  <div>already using StackIt</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Card className="bg-white shadow-2xl border-0">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">John Doe</div>
                          <div className="text-sm text-gray-500">2 hours ago</div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900">How to optimize React component re-renders?</h3>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-500 text-white">React</Badge>
                        <Badge className="bg-green-500 text-white">Performance</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="text-blue-600 font-medium">12</span> votes
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-green-600 font-medium">3</span> answers
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 z-0">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 z-0">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {" "}
                succeed
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help developers collaborate, learn, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow group">
                <CardContent className="p-8">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tags Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {" "}
                Technologies
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join discussions about the most popular programming languages and frameworks.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {popularTags.map((tag, index) => (
              <Card key={index} className="bg-white border hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 ${tag.color} rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-semibold text-gray-900 mb-1">{tag.name}</div>
                  <div className="text-sm text-gray-500">{tag.count} questions</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="community" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {" "}
                developers
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our community members have to say about their experience with StackIt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to join the community?</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Start asking questions, sharing knowledge, and connecting with thousands of developers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ask">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg bg-transparent"
                >
                  Ask Your First Question
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                StackIt
              </h3>
              <p className="text-gray-400 leading-relaxed">
                The modern Q&A platform for developers to share knowledge and solve problems together.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Questions
                  </Link>
                </li>
                <li>
                  <Link href="/ask" className="hover:text-white transition-colors">
                    Ask Question
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-white transition-colors">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tags
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Code of Conduct
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StackIt. All rights reserved. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
