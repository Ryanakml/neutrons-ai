import React from "react";
import { Cpu, Waves, Building2, ChevronRight } from "lucide-react";

export default function EchoLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold">Echo</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-300 hover:text-white transition">
                Products
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                Traditions
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                Pricing
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                Companies
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white transition px-4 py-2">
                Log in
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                Sign up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-32">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Intelligent
              <br />
              Customer Support
            </h1>
          </div>

          {/* Device Mockups */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-blue-500/30 blur-3xl"></div>

            <div className="relative flex items-center justify-center gap-8">
              {/* Phone Mockup - Left */}
              <div className="relative z-20 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <div className="w-64 h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl border border-gray-700">
                  <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-3xl"></div>

                    {/* Chat interface */}
                    <div className="p-6 pt-10">
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                        <span className="ml-2 text-sm">Support</span>
                      </div>

                      {/* Messages */}
                      <div className="space-y-4">
                        <div className="bg-gray-700/50 rounded-2xl rounded-tl-sm p-3 text-xs max-w-[80%]">
                          Hello! How can I help you today?
                        </div>
                        <div className="bg-blue-600 rounded-2xl rounded-tr-sm p-3 text-xs max-w-[80%] ml-auto">
                          I need help with my account
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-blue-500/40 blur-2xl -z-10"></div>
              </div>

              {/* Laptop Mockup - Right */}
              <div className="relative z-20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-[450px] h-[280px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-2xl p-2 shadow-2xl border border-gray-700">
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
                    {/* Dashboard content */}
                    <div className="p-4 h-full">
                      <div className="grid grid-cols-3 gap-3 h-full">
                        <div className="col-span-2 space-y-3">
                          <div className="bg-gray-800/50 rounded-lg p-3 h-24">
                            <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded">
                              {/* Chart simulation */}
                              <svg
                                className="w-full h-full"
                                viewBox="0 0 200 80"
                              >
                                <path
                                  d="M 0 60 Q 50 20, 100 40 T 200 30"
                                  fill="none"
                                  stroke="rgb(59, 130, 246)"
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-800/50 rounded-lg p-2 h-16"></div>
                            <div className="bg-gray-800/50 rounded-lg p-2 h-16"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-gray-800/50 rounded-lg p-2 h-12"></div>
                          <div className="bg-gray-800/50 rounded-lg p-2 h-12"></div>
                          <div className="bg-gray-800/50 rounded-lg p-2 h-12"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Laptop base */}
                <div className="w-[500px] h-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-2xl -mt-1 mx-auto border-t border-gray-700"></div>
                <div className="absolute inset-0 bg-blue-500/40 blur-2xl -z-10"></div>
              </div>
            </div>
          </div>

          {/* Repeated heading with glow */}
          <div className="text-center mt-32">
            <h2 className="text-5xl md:text-6xl font-bold relative inline-block">
              Intelligent
              <br />
              Customer Support
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10"></div>
            </h2>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="container mx-auto px-6 py-20">
          <h2 className="text-5xl font-bold text-center mb-16">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
              <div className="relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Cpu className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">
                  AI-Powered
                  <br />
                  Instant Responses
                </h3>
                <p className="text-gray-400 text-sm text-center leading-relaxed">
                  Powered instant responses and personalized care with UX from
                  engage 1.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
              <div className="relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Waves className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">
                  Voice & Integration
                  <br />
                  Ready
                </h3>
                <p className="text-gray-400 text-sm text-center leading-relaxed">
                  Decide on voice or integration. Ready awesome from engage 2,
                  engage 2, and design 1.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition"></div>
              <div className="relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Building2 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">
                  Multi-tenant
                  <br />
                  B2B
                </h3>
                <p className="text-gray-400 text-sm text-center leading-relaxed">
                  Multi-tenant B2B companies and support seamless with UX
                  endless on engage 4.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seamless Escalation Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Phone mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-3xl"></div>
              <div className="relative w-80 h-[600px] mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl border border-gray-700">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                  {/* Header */}
                  <div className="bg-gray-50 pt-10 pb-4 px-6 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">← Echo</span>
                      <span className="text-gray-400">⋯</span>
                    </div>
                    <div className="text-gray-500 text-xs">+1-234-567-8900</div>
                  </div>

                  {/* Messages */}
                  <div className="p-6 space-y-4 bg-gray-50 h-full">
                    <div className="bg-purple-600 text-white rounded-3xl rounded-bl-sm p-4 text-sm max-w-[85%]">
                      Customer inquiry about a product feature
                    </div>

                    <div className="bg-white rounded-3xl p-4 text-sm text-gray-800 border border-gray-200 max-w-[85%]">
                      Hi! How can we help? Our AI assistant can resolve most
                      questions immediately.
                    </div>

                    <div className="text-gray-400 text-xs text-center my-2">
                      AI is analyzing...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text content */}
            <div>
              <h2 className="text-5xl font-bold mb-6">
                Seamless
                <br />
                Escalation Flow
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Get conversations dive where an escalation and agents, that
                connect customer to live can helps you tell, and received.
              </p>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative max-w-5xl mx-auto mt-16">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">← Echo</div>
                  <div className="text-sm font-medium">Agent Dashboard</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left column - Chart */}
                <div className="col-span-2">
                  <div className="bg-gray-900/50 rounded-xl p-4 h-48 mb-4">
                    <div className="text-xs text-gray-400 mb-2">
                      Response Time Analytics
                    </div>
                    <div className="w-full h-32 relative">
                      <svg className="w-full h-full" viewBox="0 0 400 120">
                        <defs>
                          <linearGradient
                            id="chartGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="rgb(59, 130, 246)"
                              stopOpacity="0.5"
                            />
                            <stop
                              offset="100%"
                              stopColor="rgb(59, 130, 246)"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 0 80 Q 50 40, 100 60 T 200 50 T 300 30 T 400 40"
                          fill="url(#chartGradient)"
                          stroke="rgb(59, 130, 246)"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Stats cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-400">
                        234
                      </div>
                      <div className="text-xs text-gray-400">Active Chats</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-400">
                        98%
                      </div>
                      <div className="text-xs text-gray-400">Satisfaction</div>
                    </div>
                  </div>
                </div>

                {/* Right column - Activity feed */}
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 mb-2">
                    Recent Activity
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                        <div className="text-xs">Agent {i}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Resolved ticket #{1000 + i}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Empower Your Agents Section */}
        <section className="container mx-auto px-6 py-32">
          <h2 className="text-5xl font-bold text-center mb-20">
            Empower Your Agents
          </h2>

          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>

            {/* Desktop mockup */}
            <div className="relative">
              <div className="w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-3xl p-4 border border-gray-700">
                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <div className="flex h-[400px]">
                    {/* Left sidebar - Conversations */}
                    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">All</h3>
                          <button className="text-xs text-gray-500">⋯</button>
                        </div>
                      </div>

                      {/* Conversation list */}
                      <div className="divide-y divide-gray-200">
                        {[
                          {
                            name: "Amanda Doe",
                            time: "Just now",
                            status: "red",
                            msg: "I need assistance with...",
                          },
                          {
                            name: "John Doe",
                            time: "5m ago",
                            status: "orange",
                            msg: "Quick question about...",
                          },
                          {
                            name: "Jessica Parker",
                            time: "2 hours ago",
                            status: "green",
                            msg: "Thank you for the help!",
                          },
                          {
                            name: "Sara Johnson",
                            time: "3 hours ago",
                            status: "green",
                            msg: "Is my order ready to...",
                          },
                          {
                            name: "Mark Smith",
                            time: "1 conversation opened 5h",
                            status: "yellow",
                            msg: "1 conversation opened 5h",
                          },
                          {
                            name: "John Doe",
                            time: "Yesterday 11:39",
                            status: "red",
                            msg: "Type your message...",
                          },
                        ].map((conv, i) => (
                          <div
                            key={i}
                            className={`p-4 hover:bg-gray-100 cursor-pointer ${
                              i === 0
                                ? "bg-blue-50 border-l-4 border-blue-500"
                                : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm text-gray-900">
                                    {conv.name}
                                  </span>
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      conv.status === "green"
                                        ? "bg-green-500"
                                        : conv.status === "red"
                                        ? "bg-red-500"
                                        : conv.status === "orange"
                                        ? "bg-orange-500"
                                        : "bg-yellow-500"
                                    }`}
                                  ></span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {conv.msg}
                                </p>
                                <span className="text-xs text-gray-400 mt-1 block">
                                  {conv.time}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right side - Chat */}
                    <div className="flex-1 flex flex-col bg-white">
                      {/* Chat header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full"></div>
                          <div>
                            <div className="font-medium text-gray-900">
                              John Doe
                            </div>
                            <div className="text-xs text-gray-500">
                              john.doe@email.com
                            </div>
                          </div>
                        </div>
                        <button className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-medium hover:bg-green-600">
                          ✓ Resolve
                        </button>
                      </div>

                      {/* Chat messages */}
                      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
                        <div className="flex justify-center">
                          <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">
                            Aug, 15th 11:30 | All of conversation
                          </span>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                          <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-md border border-gray-200">
                            <p className="text-sm text-gray-700">
                              Yay, you are most helpful!
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3 justify-end">
                          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm p-4 shadow-sm max-w-md">
                            <p className="text-sm">
                              Im going to finish your work and try this files.
                              You can transfer follow it to review it from the
                              customer questions about the users.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex flex-col space-y-2">
                          <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium transition">
                            🔗 Send Guide
                          </button>
                          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm transition">
                            📋 Send Information
                          </button>
                          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm transition">
                            🌐 Location & Language
                          </button>
                          <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 text-sm transition">
                            📊 Session Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop base */}
              <div className="w-full h-12 bg-gradient-to-b from-gray-800 to-gray-900 flex items-end justify-center rounded-b-3xl border-x border-b border-gray-700">
                <div className="w-32 h-2 bg-gray-700 rounded-t-lg mb-2"></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="text-center relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <span className="text-2xl font-bold ml-3">Echo</span>
              </div>
              <h2 className="text-5xl font-bold mb-8">
                Ready to Transform Your Support?
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition transform hover:scale-105 shadow-lg shadow-blue-500/50">
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Decorative element */}
        <div className="fixed bottom-8 right-8 pointer-events-none">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl transform rotate-45"></div>
            <div className="absolute inset-0 bg-blue-500/50 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
