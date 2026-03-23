/// <reference types="vite/client" />
import { motion as Motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { useGoogleAuth } from "@/src/hooks/useGoogleAuth"

interface SignInModalProps {
  open: boolean
  onClose: () => void
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const onSuccess = useCallback((token: string) => {
    localStorage.setItem("recost_token", token)
    window.location.href = "/dashboard"
  }, [])

  const { login } = useGoogleAuth(onSuccess, (msg) => alert(msg))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <Motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <Motion.div
            key="card"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-8 px-12 py-14 rounded-3xl border border-white/5 bg-zinc-900/90 backdrop-blur-xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="32" height="32">
                  <path d="M55 85 L240 85 L240 140 L105 140 L105 315 L55 315 Z" fill="none" stroke="#fafafa" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
                  <path d="M345 315 L160 315 L160 260 L295 260 L295 85 L345 85 Z" fill="#fafafa" stroke="#fafafa" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
                </svg>
                <h2 className="text-3xl font-black tracking-tight text-white font-mono">recost</h2>
              </div>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Know your API costs
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/5" />

            {/* Sign in prompt */}
            <div className="text-center space-y-1">
              <p className="text-base font-medium text-white">Sign in to your dashboard</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Manage projects and API keys
              </p>
            </div>

            {/* Google Sign-in button */}
            <button
              onClick={login}
              className="group w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                Continue with Google
              </span>
            </button>

            {/* Footer note */}
            <p className="text-center text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
              By signing in you agree to the Recost terms of service.
            </p>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
