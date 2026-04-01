import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Form, FormField, FormActions } from '../components/Form'
import { LogIn, Store, ShoppingBag, TrendingUp, Shield } from 'lucide-react'

export function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid credentials. Try admin@example.com / password')
    }
  }

  const features = [
    { icon: Store, text: 'Inventory Management' },
    { icon: ShoppingBag, text: 'Sales Tracking' },
    { icon: TrendingUp, text: 'Business Analytics' },
    { icon: Shield, text: 'Secure & Reliable' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center px-16 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800"></div>
          <div className="relative z-10">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6">
                <Store className="h-8 w-8 text-black" />
              </div>
              <h1 className="text-4xl font-bold mb-4 tracking-tight">
                Inventory Pro
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Complete inventory management solution for Indian businesses.
                Manage stock, track sales, and grow your business with confidence.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-200">Why Choose Inventory Pro?</h3>
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-300 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">₹10L+ Revenue Managed</p>
                  <p className="text-gray-400 text-sm">Trusted by 500+ Indian businesses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-black">Inventory Pro</h1>
            </div>

            <div className="card p-10 space-y-8 shadow-xl">
              <div className="text-center space-y-4">
                <div className="lg:hidden w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-black tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-gray-600 font-medium">
                  Sign in to access your inventory dashboard
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-semibold text-blue-900">Demo Access</p>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-800">
                    <span className="font-medium">Email:</span> <code className="bg-blue-100 px-2 py-1 rounded">admin@example.com</code>
                  </p>
                  <p className="text-blue-800">
                    <span className="font-medium">Password:</span> <code className="bg-blue-100 px-2 py-1 rounded">password</code>
                  </p>
                </div>
              </div>

              <Form onSubmit={handleSubmit} className="space-y-6">
                <FormField>
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="Enter your email address"
                  />
                </FormField>
                <FormField>
                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />
                </FormField>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <p className="text-red-700 font-medium text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <FormActions className="pt-4">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full gap-3 h-14 text-lg"
                    size="lg"
                  >
                    {!isLoading && <LogIn className="h-5 w-5" />}
                    {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                  </Button>
                </FormActions>
              </Form>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Secure login powered by modern encryption
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2024 Inventory Pro. Built for Indian businesses with ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}