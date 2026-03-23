'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type AuthStep = 'email' | 'otp'

export default function LoginPage() {
  const [step, setStep] = useState<AuthStep>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleEmailOTP = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      if (error) throw error
      setStep('otp')
      setCountdown(30)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    }
    setLoading(false)
  }

  const handleVerifyOTP = async () => {
    const token = otp.join('')
    if (token.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      })
      if (error) throw error
      if (data.session) {
        router.push('/')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code. Try again.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleOTPInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
    if (newOtp.every(d => d !== '')) {
      // Small timeout to allow the UI to reflect the last digit
      setTimeout(() => {
        const token = newOtp.join('')
        if (token.length === 6) {
           handleVerifyOTP()
        }
      }, 100)
    }
  }

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = async () => {
    if (countdown > 0) return
    setLoading(true)
    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    setCountdown(30)
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080810' }}>

      {/* LEFT PANEL */}
      <div style={{
        width: '55%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px',
        background: 'linear-gradient(135deg, #080810 0%, #0D0B1A 50%, #080810 100%)',
        borderRight: '1px solid #1E1E30',
        animation: 'bgShift 8s ease-in-out infinite alternate',
      }} className="left-panel">
        <div />
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Georgia, serif', fontStyle: 'italic',
            fontSize: 36, fontWeight: 300, color: '#fff',
            lineHeight: 1.4, marginBottom: 16
          }}>
            "Every story deserves<br />to be seen"
          </p>
          <p style={{ color: '#8888A8', fontSize: 14 }}>
            Join thousands of filmmakers and cinephiles
          </p>
        </div>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: 24, letterSpacing: 4 }}>
          <span style={{ color: '#6366F1', marginRight: 6 }}>●</span>GARDE
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        width: '45%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '48px',
        background: '#0D0D18'
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ color: '#6366F1', marginRight: 4, fontSize: 10 }}>●</span>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 18, letterSpacing: 3 }}>GARDE</span>
          </div>

          {step === 'email' ? (
            <>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Welcome to Garde</h2>
              <p style={{ color: '#8888A8', fontSize: 14, marginBottom: 24 }}>Enter your email to continue</p>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmailOTP()}
                placeholder="your@email.com"
                style={{
                  width: '100%', padding: '14px', background: '#13131F',
                  border: '1px solid #1E1E30', borderRadius: 8,
                  color: '#fff', fontSize: 14, marginBottom: 12, outline: 'none',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={e => e.currentTarget.style.borderColor = '#1E1E30'}
              />
              {error && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 10 }}>{error}</p>}
              <button onClick={handleEmailOTP} disabled={loading}
                style={{
                  width: '100%', padding: '14px', background: loading ? '#4F46E5' : '#6366F1',
                  border: 'none', borderRadius: 8, color: '#fff',
                  fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}>
                {loading ? 'Sending...' : 'Continue'}
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#1E1E30' }} />
                <span style={{ color: '#8888A8', fontSize: 12 }}>or</span>
                <div style={{ flex: 1, height: 1, background: '#1E1E30' }} />
              </div>
              
              <button onClick={handleGoogle} disabled={loading}
                style={{
                  width: '100%', padding: '13px',
                  background: '#13131F',
                  border: '1px solid #1E1E30',
                  borderRadius: 8, color: '#fff',
                  fontSize: 14, fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 10,
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366F1')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1E1E30')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Redirecting...' : 'Continue with Google'}
              </button>

              <p style={{ color: '#8888A8', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
                New here? We will create your account automatically
              </p>
            </>
          ) : (
            <>
              <button onClick={() => { setStep('email'); setError(''); setOtp(['','','','','','']) }}
                style={{ background: 'none', border: 'none', color: '#8888A8', cursor: 'pointer', marginBottom: 16, fontSize: 13 }}>
                ← Back
              </button>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Check your inbox</h2>
              <p style={{ color: '#8888A8', fontSize: 14, marginBottom: 6 }}>We sent a code to</p>
              <p style={{ color: '#6366F1', fontSize: 14, marginBottom: 24 }}>{email}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
                {otp.map((digit, i) => (
                  <input key={i} ref={el => { otpRefs.current[i] = el }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleOTPInput(i, e.target.value)}
                    onKeyDown={e => handleOTPKeyDown(i, e)}
                    autoFocus={i === 0}
                    style={{
                      width: 48, height: 56, textAlign: 'center',
                      background: '#13131F', border: `1px solid ${digit ? '#6366F1' : '#1E1E30'}`,
                      borderRadius: 8, color: '#fff', fontSize: 22,
                      fontWeight: 700, outline: 'none'
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = '#6366F1'}
                    onBlur={e => e.currentTarget.style.borderColor = digit ? '#6366F1' : '#1E1E30'}
                  />
                ))}
              </div>
              {error && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>{error}</p>}
              <button onClick={handleVerifyOTP} disabled={loading}
                style={{
                  width: '100%', padding: '14px', background: '#6366F1',
                  border: 'none', borderRadius: 8, color: '#fff',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 16
                }}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <p style={{ textAlign: 'center', fontSize: 13 }}>
                <button onClick={handleResend} disabled={countdown > 0}
                  style={{
                    background: 'none', border: 'none', cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                    color: countdown > 0 ? '#8888A8' : '#6366F1', fontSize: 13
                  }}>
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </p>
            </>
          )}

          <p style={{ color: '#8888A8', fontSize: 11, textAlign: 'center', marginTop: 32, lineHeight: 1.5 }}>
            By continuing you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          div[style*="width: 45%"] { width: 100% !important; }
        }
        @keyframes bgShift {
          0% { background: linear-gradient(135deg, #080810 0%, #0D0B1A 100%); }
          100% { background: linear-gradient(135deg, #0A0F1A 0%, #080810 100%); }
        }
      `}</style>
    </div>
  )
}
