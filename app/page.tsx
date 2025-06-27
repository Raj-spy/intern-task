"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Menu,
  X,
  ArrowRight,
  Mail,
  Linkedin,
  Github,
  ChevronDown,
  Quote,
  ExternalLink,
  Star,
  Code,
  Target,
  CheckCircle,
  MessageCircle,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
} from "lucide-react"
import { Canvas } from "@react-three/fiber"
import { Sphere, Float } from "@react-three/drei"
import type * as THREE from "three"

// Animated 3D Orb Component
function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005
        meshRef.current.rotation.y += 0.01
      }
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[2, 0, 0]}>
        <meshStandardMaterial color="#5b5df6" transparent opacity={0.3} wireframe />
      </Sphere>
    </Float>
  )
}

// Intersection Observer Hook
function useIntersectionObserver(options = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options])

  return [ref, isIntersecting] as const
}

// Animated Counter Hook
function useAnimatedCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let startTime: number

    const animateValue = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animateValue)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          requestAnimationFrame(animateValue)
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [end, duration, isVisible])

  return [ref, count] as const
}

// Animated Section Component
function AnimatedSection({
  children,
  className = "",
  animation = "fade-up" | "fade-left" | "fade-right" | "zoom-in" | "slide-in-left" | "slide-in-right",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-left" | "fade-right" | "zoom-in" | "slide-in-left" | "slide-in-right"
  delay?: number
}) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "-50px",
  })

  const getAnimationClass = () => {
    const base = "transition-all duration-1000 ease-out"
    if (!isIntersecting) {
      switch (animation) {
        case "fade-up":
          return `${base} opacity-0 translate-y-8`
        case "fade-left":
          return `${base} opacity-0 translate-x-8`
        case "fade-right":
          return `${base} opacity-0 -translate-x-8`
        case "zoom-in":
          return `${base} opacity-0 scale-95`
        case "slide-in-left":
          return `${base} opacity-0 -translate-x-12`
        case "slide-in-right":
          return `${base} opacity-0 translate-x-12`
        default:
          return `${base} opacity-0 translate-y-8`
      }
    }
    return `${base} opacity-100 translate-y-0 translate-x-0 scale-100`
  }

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// Tooltip Component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white text-black text-sm rounded-md whitespace-nowrap z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white" />
        </div>
      )}
    </div>
  )
}

// AI Chatbot Component
function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can help answer questions about our services, pricing, and more. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const faqs = [
    {
      question: "What's your typical project timeline?",
      answer:
        "Project timelines vary based on scope and complexity. A typical website takes 4-8 weeks, while a full SaaS application can take 3-6 months. We provide detailed timelines during our discovery phase.",
      keywords: ["timeline", "time", "duration", "how long", "project", "delivery"],
    },
    {
      question: "Do you work with startups or only established companies?",
      answer:
        "We work with businesses of all sizes, from early-stage startups to Fortune 500 companies. We tailor our approach and pricing to match your stage and budget.",
      keywords: ["startup", "company", "business", "size", "established", "fortune"],
    },
    {
      question: "What technologies do you specialize in?",
      answer:
        "We specialize in modern web technologies including React, Next.js, Node.js, TypeScript, and cloud platforms like AWS and Vercel. We choose the best tech stack for each project's specific needs.",
      keywords: ["technology", "tech", "stack", "react", "nextjs", "nodejs", "typescript", "aws", "vercel"],
    },
    {
      question: "Do you provide ongoing support after launch?",
      answer:
        "Yes, we offer various support packages including maintenance, updates, hosting, and feature enhancements. We're committed to your long-term success.",
      keywords: ["support", "maintenance", "after launch", "ongoing", "updates", "hosting"],
    },
    {
      question: "Can you help with existing projects or only new ones?",
      answer:
        "We can definitely help with existing projects! Whether you need to modernize legacy code, add new features, or improve performance, we're here to help.",
      keywords: ["existing", "legacy", "modernize", "improve", "features", "performance"],
    },
    {
      question: "What services do you offer?",
      answer:
        "We offer UI/UX Design, Web Development, Mobile Apps, SaaS Development, Brand Identity, and Custom Software solutions. Each service is tailored to create exceptional digital experiences.",
      keywords: ["services", "ui", "ux", "design", "web", "mobile", "saas", "brand", "software"],
    },
    {
      question: "How much do your services cost?",
      answer:
        "Our pricing varies based on project scope, complexity, and timeline. We offer flexible packages for startups to enterprise clients. Contact us for a detailed quote tailored to your specific needs.",
      keywords: ["cost", "price", "pricing", "budget", "quote", "expensive", "cheap"],
    },
    {
      question: "Where are you located?",
      answer:
        "We're based in Noida, India, but we work with clients globally. We're open for both remote collaborations and local partnerships.",
      keywords: ["location", "where", "noida", "india", "remote", "global"],
    },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const findBestAnswer = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    // Find FAQ that matches keywords
    const matchedFaq = faqs.find((faq) => faq.keywords.some((keyword) => lowerMessage.includes(keyword.toLowerCase())))

    if (matchedFaq) {
      return matchedFaq.answer
    }

    // Default responses for common greetings and unmatched queries
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! I'm here to help you with any questions about our services, pricing, timelines, or anything else. What would you like to know?"
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "You're welcome! Is there anything else I can help you with today?"
    }

    return "I'd be happy to help! I can answer questions about our services, pricing, project timelines, technologies we use, and more. Could you please be more specific about what you'd like to know?"
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = {
          id: messages.length + 2,
          text: findBestAnswer(inputValue),
          isBot: true,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 group"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`bg-black/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 ${
          isMinimized ? "w-80 h-16" : "w-80 h-96"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 h-64 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isBot
                        ? "bg-white/10 text-white rounded-bl-sm"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-400" />}
                      {!message.isBot && <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-white" />}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-purple-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border-white/10 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-gray-400 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed h-10 w-10 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function VisibleRatioLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const services = [
  {
    icon: "🎨",
    title: "UI/UX Design",
    desc: "We craft intuitive, human-centered interfaces that drive engagement, improve user satisfaction, and convert visitors into loyal customers."
  },
  {
    icon: "⚡",
    title: "Web Development",
    desc: "Our modern, scalable, and SEO-optimized websites are built with performance in mind — fast-loading, secure, and responsive across all devices."
  },
  {
    icon: "📱",
    title: "Mobile Apps",
    desc: "From native to cross-platform, we develop high-performance mobile applications that offer smooth, consistent experiences on both iOS and Android."
  },
  {
    icon: "🚀",
    title: "SaaS Development",
    desc: "We help you build scalable SaaS platforms from scratch — handling everything from architecture and development to deployment and growth optimization."
  },
  {
    icon: "🎯",
    title: "Brand Identity",
    desc: "We create cohesive brand systems — logos, color palettes, and guidelines — that reflect your values and make your brand instantly recognizable."
  },
  {
    icon: "🔧",
    title: "Custom Software",
    desc: "We engineer tailored digital solutions that solve unique business challenges — from complex workflows to fully integrated enterprise platforms."
  }
];


  const portfolio = [
    {
      title: "FinTech SaaS Platform",
      category: "SaaS Platform",
      description:"A comprehensive financial management solution with real-time analytics, automated reporting, and seamless integrations.",
      image: "/ChatGPT%20Image%20Jun%2027,%202025,%2008_44_58%20PM.png",
      tags: ["React", "Node.js", "PostgreSQL", "AWS"],
      stats: { views: "2.5K", duration: "6 months", team: "4 people" },
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "E-commerce Mobile App",
      category: "Mobile Application",
      description:"Cross-platform shopping experience with AR try-on features, personalized recommendations, and seamless checkout flow.",
      image: "/ecom-mobile.png",
      tags: ["React Native", "Firebase", "Stripe", "AR Kit"],
      stats: { views: "3.2K", duration: "4 months", team: "5 people" },
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Healthcare Dashboard",
      category: "Web Platform",
      description:"Patient management system with intuitive interface, comprehensive data visualization, and HIPAA compliance.",
      image: "/hospital.png",
      tags: ["Vue.js", "Python", "MongoDB", "Docker"],
      stats: { views: "1.8K", duration: "8 months", team: "6 people" },
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Brand Identity System",
      category: "Visual Identity",
      description:
        "Complete visual identity and brand guidelines for a sustainable technology startup, including logo, colors, and typography.",
      image: "/brand.png",
      tags: ["Figma", "Illustrator", "Brand Strategy", "Guidelines"],
      stats: { views: "4.1K", duration: "3 months", team: "3 people" },
      color: "from-orange-500 to-red-500",
    },
  ]

  const testimonials = [
    {
      quote:
        "Design Tech Studio transformed our vision into a stunning digital reality. Their attention to detail and technical expertise is unmatched.",
      author: "XYZ",
      role: "ttt",
      rating: 5,
    },
    {
      quote:
        "Working with this team was seamless. They delivered a scalable SaaS platform that exceeded our expectations in every way.",
      author: "raj",
      role: "ABC",
      rating: 5,
    },
    {
      quote:
        "The perfect blend of creative design and robust engineering. Our mobile app launch was a huge success thanks to their expertise.",
      author: "ABCED",
      role: "XYZ",
      rating: 5,
    },
  ]

   const blogPosts = [
  {
    title: "The Future of SaaS Design: Trends for 2025",
    excerpt: "Exploring emerging patterns in SaaS interface design and user experience optimization.",
    // readTime: "5 min read",
    category: "Design",
    image: "/sass.png",
  },
  {
    title: "Building Scalable React Applications",
    excerpt: "Best practices for architecting React apps that grow with your business needs.",
    // readTime: "8 min read",
    category: "Development",
    image: "/react.png",
  },
  {
    title: "Brand Identity in the Digital Age",
    excerpt: "How modern brands create memorable experiences across digital touchpoints.",
    // readTime: "6 min read",
    category: "Branding",
    image: "/photo2.png",
  },
];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Blob */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 opacity-20 pointer-events-none z-0">
        <div
          className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 rounded-full blur-3xl animate-pulse"
          style={{
            animation: "float 6s ease-in-out infinite, pulse 4s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Abstract Grid Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">Design Tech Studio</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Services", "Work", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
            <nav className="px-6 py-4 space-y-4">
              {["Home", "Services", "Work", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-6">
        {/* 3D Background Element */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 hidden lg:block">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AnimatedOrb />
          </Canvas>
        </div>

        <div className="max-w-4xl mx-auto text-center z-10">
          <AnimatedSection animation="fade-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Bringing Digital
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Visions to Life
              </span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              We design and develop scalable digital solutions with elegance and precision.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={400}>
            <Button
              size="lg"
              className="bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 hover:shadow-lg hover:shadow-purple-500/20 text-white px-8 py-3 text-lg group transition-all duration-300"
            >
              Explore Our Work
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 px-6 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: 25, suffix: "+", label: "SaaS Apps Built" },
              { number: 50, suffix: "+", label: "Happy Clients" },
              { number: 3, suffix: "x", label: "Faster Delivery" },
              { number: 99, suffix: "%", label: "Client Satisfaction" },
            ].map((metric, index) => {
              const [ref, count] = useAnimatedCounter(metric.number)
              return (
                <AnimatedSection key={metric.label} animation="fade-up" delay={index * 100}>
                  <div className="space-y-2">
                    <div className="text-3xl md:text-4xl font-bold text-purple-400">
                      <span ref={ref}>{count}</span>
                      {metric.suffix}
                    </div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-right">
              <h2 className="text-4xl font-bold mb-6">Who We Are</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                We're a premium design-technology studio that bridges the gap between creative vision and technical
                excellence. Our team combines strategic thinking, human-centered design, and modern engineering to
                create digital experiences that not only look exceptional but perform flawlessly at scale.
              </p>
              <p className="text-gray-400 leading-relaxed">
                From SaaS platforms to mobile applications, we craft digital solutions that drive business growth and
                create meaningful user experiences.
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-left" delay={200}>
              <div className="flex flex-wrap gap-3">
                {[
                  "Precision Design",
                  "Modern Engineering",
                  "Scalable Solutions",
                  "User Experience",
                  "Brand Strategy",
                  "Technical Excellence",
                  "Future-Ready",
                  "Craft-First",
                ].map((tag, index) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300 cursor-default"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold text-center mb-16">What We Do</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection key={service.title} animation="fade-up" delay={index * 100}>
                <div className="p-6 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group cursor-pointer">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">{service.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Portfolio Section */}
      <section id="work" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Our Work
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Showcasing our latest projects and the impact we've created for our clients
              </p>
            </div>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-8">
            {portfolio.map((project, index) => (
              <AnimatedSection key={project.title} animation="zoom-in" delay={index * 150}>
                <div className="group cursor-pointer h-full">
                  <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col">
                    {/* Project Image */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                      />
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 bg-gradient-to-r ${project.color} text-white text-xs font-medium rounded-full backdrop-blur-sm`}
                        >
                          {project.category}
                        </span>
                      </div>

                      {/* View Project Button */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <ExternalLink className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Project Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-4 flex-1">{project.description}</p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* View All Projects Button */}
          <AnimatedSection animation="fade-up" delay={600}>
            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-transparent border border-white/20 hover:border-purple-400/50 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 text-white px-8 py-3 text-lg group transition-all duration-300"
              >
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <h2 className="text-4xl font-bold text-center mb-16">What Clients Say</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.author} animation="slide-in-left" delay={index * 200}>
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-purple-400 mb-4" />
                    <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.quote}</p>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Insights */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Latest Insights</h2>
              <p className="text-gray-400">Thoughts on design, technology, and innovation</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <AnimatedSection key={post.title} animation="fade-up" delay={index * 150}>
                <Card className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-500/80 text-white text-xs rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Let's Build Something Powerful Together</h2>
              <p className="text-lg text-gray-300">Open for remote and Noida-based collaborations</p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={200}>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  placeholder="Your Name"
                  className="bg-white/5 border-white/10 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="bg-white/5 border-white/10 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Input
                placeholder="Project Subject"
                className="bg-white/5 border-white/10 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-gray-400"
              />
              <Textarea
                placeholder="Tell us about your project..."
                rows={6}
                className="bg-white/5 border-white/10 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-gray-400 resize-none"
              />
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-transparent border border-white/20 hover:border-purple-400/50 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 text-white px-8 py-3 text-lg group transition-all duration-300"
                >
                  Send Message
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Design Tech Studio
              </h3>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Creating digital experiences that drive growth and innovation. We bridge the gap between creative vision
                and technical excellence to deliver exceptional results.
              </p>
              <div className="flex space-x-4">
                <a
                  href="mailto:hello@designtechstudio.com"
                  className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                >
                  <Mail className="h-5 w-5 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                >
                  <Linkedin className="h-5 w-5 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                >
                  <Github className="h-5 w-5 group-hover:text-purple-400 group-hover:scale-110 transition-all duration-300" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-white flex items-center">
                <Code className="h-5 w-5 mr-2 text-purple-400" />
                Services
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#services"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">UI/UX Design</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Web Development</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Mobile Apps</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      SaaS Development
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Brand Identity</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6 text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-400" />
                Company
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#about"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#work"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-purple-400 to-blue-400 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Our Work</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Careers</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-purple-400 transition-all duration-300 flex items-center group py-1"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">Contact</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Links Section */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4 text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-purple-400" />
              Legal & Resources
            </h4>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-purple-400 transition-colors duration-300 relative group">
                <span className="group-hover:translate-x-1 transition-transform duration-300">Terms of Service</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300 relative group">
                <span className="group-hover:translate-x-1 transition-transform duration-300">Privacy Policy</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300 relative group">
                <span className="group-hover:translate-x-1 transition-transform duration-300">Cookie Policy</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors duration-300 relative group">
                <span className="group-hover:translate-x-1 transition-transform duration-300">GDPR Compliance</span>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 Design Tech Studio Digital Solutions Pvt. Ltd. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>made by raj</span>
              <span className="text-red-400 animate-pulse">♥</span>
              {/* <span>and</span> */}
              {/* <span className="text-yellow-400"></span> */}
              {/* <span>in India</span> */}
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
}
