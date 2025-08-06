
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Default menu items since the API returns empty arrays (stub implementation)
  const menuItems = [
    { slug: 'home', name: 'Home', order: 1 },
    { slug: 'products', name: 'Products', order: 2 },
    { slug: 'pricing', name: 'Pricing', order: 3 },
    { slug: 'community', name: 'Community', order: 4 },
    { slug: 'about', name: 'About', order: 5 }
  ];

  // Default content for each page (since backend returns stubs)
  const defaultContent = {
    home: {
      title: 'Welcome to Our Platform',
      content: `
        <div class="space-y-6">
          <h2 class="text-2xl font-semibold text-gray-800">Discover Amazing Solutions</h2>
          <p class="text-gray-600 text-lg leading-relaxed">
            We're building the future of digital experiences. Our platform combines cutting-edge technology 
            with intuitive design to help you achieve your goals faster and more efficiently.
          </p>
          <div class="grid md:grid-cols-3 gap-6 mt-8">
            <div class="p-6 bg-blue-50 rounded-lg">
              <h3 class="font-semibold text-blue-900 mb-2">🚀 Fast & Reliable</h3>
              <p class="text-blue-700">Lightning-fast performance with 99.9% uptime guarantee</p>
            </div>
            <div class="p-6 bg-green-50 rounded-lg">
              <h3 class="font-semibold text-green-900 mb-2">🔒 Secure by Design</h3>
              <p class="text-green-700">Enterprise-grade security protecting your data</p>
            </div>
            <div class="p-6 bg-purple-50 rounded-lg">
              <h3 class="font-semibold text-purple-900 mb-2">⚡ Easy to Use</h3>
              <p class="text-purple-700">Intuitive interface designed for productivity</p>
            </div>
          </div>
        </div>
      `,
      meta_description: 'Welcome to our innovative platform - fast, secure, and user-friendly solutions'
    },
    products: {
      title: 'Our Products',
      content: `
        <div class="space-y-8">
          <p class="text-gray-600 text-lg">
            Explore our comprehensive suite of products designed to streamline your workflow and boost productivity.
          </p>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-semibold mb-3 text-gray-800">📊 Analytics Dashboard</h3>
              <p class="text-gray-600 mb-4">
                Get real-time insights into your business metrics with our powerful analytics platform.
              </p>
              <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Popular</span>
            </div>
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-semibold mb-3 text-gray-800">🤖 AI Assistant</h3>
              <p class="text-gray-600 mb-4">
                Leverage artificial intelligence to automate tasks and improve decision-making.
              </p>
              <span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">New</span>
            </div>
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-semibold mb-3 text-gray-800">🔄 Integration Hub</h3>
              <p class="text-gray-600 mb-4">
                Connect with over 100+ popular tools and services seamlessly.
              </p>
              <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Essential</span>
            </div>
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-semibold mb-3 text-gray-800">📱 Mobile App</h3>
              <p class="text-gray-600 mb-4">
                Stay productive on the go with our native mobile applications.
              </p>
              <span class="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </div>
      `,
      meta_description: 'Discover our innovative products - Analytics Dashboard, AI Assistant, Integration Hub, and more'
    },
    pricing: {
      title: 'Simple, Transparent Pricing',
      content: `
        <div class="space-y-8">
          <p class="text-gray-600 text-lg text-center">
            Choose the plan that fits your needs. All plans include our core features with no hidden fees.
          </p>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-semibold mb-2">Starter</h3>
              <div class="text-3xl font-bold text-gray-900 mb-4">
                $9<span class="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul class="space-y-3 text-gray-600 mb-6">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Up to 5 projects</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Basic analytics</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Email support</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 1GB storage</li>
              </ul>
              <button class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Start Free Trial
              </button>
            </div>
            <div class="border-2 border-blue-500 rounded-xl p-6 hover:shadow-lg transition-shadow relative">
              <div class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 class="text-xl font-semibold mb-2">Professional</h3>
              <div class="text-3xl font-bold text-gray-900 mb-4">
                $29<span class="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul class="space-y-3 text-gray-600 mb-6">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited projects</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Advanced analytics</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Priority support</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 100GB storage</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> AI features</li>
              </ul>
              <button class="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Get Started
              </button>
            </div>
            <div class="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h3 class="text-xl font-semibold mb-2">Enterprise</h3>
              <div class="text-3xl font-bold text-gray-900 mb-4">
                $99<span class="text-lg font-normal text-gray-600">/month</span>
              </div>
              <ul class="space-y-3 text-gray-600 mb-6">
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Everything in Pro</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Custom integrations</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> 24/7 phone support</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> Unlimited storage</li>
                <li class="flex items-center"><span class="text-green-500 mr-2">✓</span> SLA guarantee</li>
              </ul>
              <button class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      `,
      meta_description: 'Transparent pricing plans for every team size - Starter, Professional, and Enterprise options'
    },
    community: {
      title: 'Join Our Community',
      content: `
        <div class="space-y-8">
          <p class="text-gray-600 text-lg">
            Connect with thousands of users, share ideas, and get support from our vibrant community.
          </p>
          <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <span class="text-2xl mr-3">💬</span>
                Discussion Forum
              </h3>
              <p class="text-gray-700 mb-4">
                Ask questions, share tips, and learn from other community members in our active forum.
              </p>
              <div class="text-sm text-gray-600">
                <span class="font-medium">15,000+</span> active members
              </div>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <span class="text-2xl mr-3">📚</span>
                Knowledge Base
              </h3>
              <p class="text-gray-700 mb-4">
                Access comprehensive guides, tutorials, and documentation created by our community.
              </p>
              <div class="text-sm text-gray-600">
                <span class="font-medium">500+</span> articles and guides
              </div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <span class="text-2xl mr-3">🎥</span>
                Weekly Webinars
              </h3>
              <p class="text-gray-700 mb-4">
                Join our weekly live sessions featuring product updates, best practices, and Q&A.
              </p>
              <div class="text-sm text-gray-600">
                Every <span class="font-medium">Wednesday 2PM EST</span>
              </div>
            </div>
            <div class="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <span class="text-2xl mr-3">🏆</span>
                Community Challenges
              </h3>
              <p class="text-gray-700 mb-4">
                Participate in monthly challenges, showcase your work, and win exciting prizes.
              </p>
              <div class="text-sm text-gray-600">
                Next challenge: <span class="font-medium">Innovation Week</span>
              </div>
            </div>
          </div>
          <div class="text-center bg-gray-50 rounded-xl p-8">
            <h3 class="text-xl font-semibold mb-4">Ready to Join?</h3>
            <p class="text-gray-600 mb-6">
              Become part of our growing community and unlock exclusive resources, networking opportunities, and more.
            </p>
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Join Community
            </button>
          </div>
        </div>
      `,
      meta_description: 'Join our vibrant community - discussion forums, knowledge base, webinars, and challenges'
    },
    about: {
      title: 'About Our Company',
      content: `
        <div class="space-y-8">
          <div class="text-center">
            <p class="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              We're on a mission to revolutionize how teams collaborate and achieve their goals. 
              Founded in 2020, we've grown from a small startup to a trusted platform serving thousands of customers worldwide.
            </p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 class="text-2xl font-semibold mb-4 text-gray-800">Our Story</h3>
              <p class="text-gray-600 mb-4">
                It all started when our founders experienced firsthand the challenges of remote collaboration. 
                Frustrated by scattered tools and inefficient workflows, they set out to create a unified platform 
                that would make teamwork seamless and enjoyable.
              </p>
              <p class="text-gray-600">
                Today, we're proud to serve customers across 50+ countries, helping them save time, 
                reduce complexity, and focus on what matters most: their mission.
              </p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 text-center">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <div class="text-3xl font-bold text-blue-600">50K+</div>
                  <div class="text-sm text-gray-600">Active Users</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-green-600">99.9%</div>
                  <div class="text-sm text-gray-600">Uptime</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-purple-600">24/7</div>
                  <div class="text-sm text-gray-600">Support</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-orange-600">4.8★</div>
                  <div class="text-sm text-gray-600">User Rating</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-2xl font-semibold mb-6 text-gray-800 text-center">Our Values</h3>
            <div class="grid md:grid-cols-3 gap-6">
              <div class="text-center p-6">
                <div class="text-4xl mb-4">🎯</div>
                <h4 class="font-semibold mb-2 text-gray-800">Customer First</h4>
                <p class="text-gray-600 text-sm">Every decision we make starts with our customers' needs and success.</p>
              </div>
              <div class="text-center p-6">
                <div class="text-4xl mb-4">🚀</div>
                <h4 class="font-semibold mb-2 text-gray-800">Innovation</h4>
                <p class="text-gray-600 text-sm">We continuously push boundaries to deliver cutting-edge solutions.</p>
              </div>
              <div class="text-center p-6">
                <div class="text-4xl mb-4">🤝</div>
                <h4 class="font-semibold mb-2 text-gray-800">Collaboration</h4>
                <p class="text-gray-600 text-sm">Great things happen when people work together towards common goals.</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-8 text-center">
            <h3 class="text-xl font-semibold mb-4">Want to Learn More?</h3>
            <p class="text-gray-600 mb-6">
              We'd love to hear from you! Whether you have questions, feedback, or just want to say hello.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                Contact Us
              </button>
              <button class="border border-gray-300 hover:bg-gray-100 px-6 py-2 rounded-lg transition-colors">
                View Careers
              </button>
            </div>
          </div>
        </div>
      `,
      meta_description: 'Learn about our company story, mission, values, and the team behind our innovative platform'
    }
  };

  // Get current page data directly
  const getCurrentPageData = () => {
    const content = defaultContent[currentPage as keyof typeof defaultContent];
    if (!content) return null;
    
    return {
      id: 1,
      menu_item_id: 1,
      name: menuItems.find(item => item.slug === currentPage)?.name || 'Page',
      slug: currentPage,
      title: content.title,
      content: content.content,
      meta_description: content.meta_description || null,
      meta_keywords: null,
      is_active: true,
      order: menuItems.find(item => item.slug === currentPage)?.order || 1
    };
  };

  const pageData = getCurrentPageData();

  const handleNavigation = (slug: string) => {
    setCurrentPage(slug);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">
                🚀 Platform
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => handleNavigation(item.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === item.slug
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item) => (
              <button
                key={item.slug}
                onClick={() => handleNavigation(item.slug)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  currentPage === item.slug
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {pageData ? (
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {pageData.title}
              </h1>
              {pageData.meta_description && (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  {pageData.meta_description}
                </p>
              )}
            </div>

            {/* Page Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-gray-600">The requested page could not be found.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-blue-600 mb-4">
                🚀 Platform
              </div>
              <p className="text-gray-600 text-sm">
                Building the future of digital collaboration with innovative tools and seamless experiences.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Integrations</a></li>
                <li><a href="#" className="hover:text-gray-900">API</a></li>
                <li><a href="#" className="hover:text-gray-900">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Press</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">Status</a></li>
                <li><a href="#" className="hover:text-gray-900">Community</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
