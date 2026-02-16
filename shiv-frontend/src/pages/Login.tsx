import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, Laptop, Users, Shield, UserCog, Mail, Lock, BookOpen, Calendar } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useRole } from "../contexts/RoleContext";
import { useAuth } from "../contexts/AuthContext";

/* ================= ROLES ================= */

const roles = [
  {
    id: "student",
    title: "Student",
    icon: Users,
    description: "Access courses, internships, and grievances",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "professor",
    title: "Professor",
    icon: BookOpen,
    description: "Manage courses, research, and academic grievances",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    id: "club",
    title: "Club Organizer",
    icon: Calendar,
    description: "Manage events, announcements, and club activities",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    id: "admin",
    title: "Admin",
    icon: Shield,
    description: "Full platform analytics and control",
    gradient: "from-orange-500 to-red-500",
  },
];

/* ================= PORTAL WORMHOLE ================= */

const Portal = () => {
  const [rotation, setRotation] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);
  const [pulseScale, setPulseScale] = useState(1);
  const [mouseDistance, setMouseDistance] = useState(1000);
  const [energy, setEnergy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Track mouse distance for energy effect
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      setMouseDistance(dist);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Calculate energy based on mouse proximity
  useEffect(() => {
    const energyLevel = Math.max(0, Math.min(1, 1 - mouseDistance / 300));
    setEnergy(energyLevel);
  }, [mouseDistance]);

  // Rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1 + energy * 2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [energy]);

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(1 + Math.sin(Date.now() / 500) * 0.1 + energy * 0.2);
    }, 16);
    return () => clearInterval(interval);
  }, [energy]);

  // Generate spiral particles
  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now() + Math.random(),
        angle: Math.random() * 360,
        distance: 120,
        size: 2 + Math.random() * 4,
        speed: 2 + Math.random() * 3 + energy * 2,
        opacity: 0.8,
        hue: Math.random() * 30 + 35,
      };
      setParticles((prev) => [...prev, newParticle].slice(-50));
    }, 30 - energy * 20);
    return () => clearInterval(interval);
  }, [energy]);

  // Animate particles spiraling inward
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            distance: p.distance - p.speed,
            angle: p.angle + 5,
            opacity: p.opacity - 0.01,
            size: p.size * 0.98,
          }))
          .filter((p) => p.distance > 5 && p.opacity > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className="relative w-48 h-48 mx-auto mb-8">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-40 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, rgba(59, 130, 246, ${0.3 + energy * 0.5}), rgba(147, 51, 234, ${0.2 + energy * 0.4}), transparent)`,
          transform: `scale(${pulseScale})`,
        }}
      />

      {/* Main portal container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Rotating rings */}
        {[0, 1, 2, 3, 4].map((ringIndex) => {
          const ringSize = 140 - ringIndex * 20;
          const ringRotation = rotation * (1 + ringIndex * 0.3) * (ringIndex % 2 ? 1 : -1);
          const opacity = 0.15 + ringIndex * 0.08;

          return (
            <div
              key={ringIndex}
              className="absolute border-2 rounded-full transition-all duration-100"
              style={{
                width: `${ringSize}px`,
                height: `${ringSize}px`,
                borderColor: `hsla(${200 + ringIndex * 15}, 80%, 60%, ${opacity + energy * 0.3})`,
                transform: `rotate(${ringRotation}deg) scale(${pulseScale})`,
                borderStyle: ringIndex % 2 ? "solid" : "dashed",
              }}
            />
          );
        })}

        {/* Center core */}
        <div
          className="absolute w-16 h-16 rounded-full transition-all duration-300"
          style={{
            background: `radial-gradient(circle, 
              rgba(59, 130, 246, ${0.9 + energy * 0.1}), 
              rgba(99, 102, 241, ${0.7 + energy * 0.2}), 
              rgba(147, 51, 234, ${0.5 + energy * 0.3}))`,
            boxShadow: `0 0 ${20 + energy * 40}px rgba(59, 130, 246, ${0.6 + energy * 0.4})`,
            transform: `scale(${pulseScale})`,
          }}
        >
          {/* Inner core pulse */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent)",
              animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
        </div>

        {/* Spiral particles */}
        {particles.map((particle) => {
          const x = Math.cos((particle.angle * Math.PI) / 180) * particle.distance;
          const y = Math.sin((particle.angle * Math.PI) / 180) * particle.distance;

          return (
            <div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: `hsla(${particle.hue}, 80%, 65%, ${particle.opacity})`,
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 80%, 65%, ${particle.opacity})`,
              }}
            />
          );
        })}

        {/* Energy arcs when mouse is close */}
        {energy > 0.3 && (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-32 h-32 rounded-full border-2 border-cyan-400"
                style={{
                  opacity: energy * 0.4,
                  transform: `rotate(${rotation * 2 + i * 120}deg) scale(${1 + energy * 0.5})`,
                  borderStyle: "dashed",
                  animation: `ping ${1 - energy * 0.3}s ease-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Corner energy sparks */}
        {energy > 0.5 && (
          <>
            {[0, 1, 2, 3].map((i) => {
              const angle = (i * 90 + rotation) % 360;
              const distance = 85;
              const x = Math.cos((angle * Math.PI) / 180) * distance;
              const y = Math.sin((angle * Math.PI) / 180) * distance;

              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-pulse"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    boxShadow: "0 0 10px rgba(103, 232, 249, 0.8)",
                  }}
                />
              );
            })}
          </>
        )}

        {/* Distortion rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={`distort-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${60 + i * 25}px`,
              height: `${60 + i * 25}px`,
              border: `1px solid hsla(${220 - i * 20}, 70%, 60%, ${0.1 + energy * 0.2})`,
              transform: `rotate(${-rotation * 0.5}deg) scale(${pulseScale})`,
              animation: `ping ${2 + i}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Energy level indicator */}
      {energy > 0.2 && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
          PORTAL ACTIVE
        </div>
      )}

      {/* Ambient particles around portal */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 45 + rotation * 0.3) % 360;
        const distance = 95 + Math.sin(Date.now() / 1000 + i) * 10;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        return (
          <div
            key={`ambient-${i}`}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity: 0.3 + energy * 0.4,
              boxShadow: "0 0 4px rgba(147, 197, 253, 0.6)",
            }}
          />
        );
      })}
    </div>
  );
};

/* ================= LOGIN ================= */

export default function Login() {
  const { theme, setTheme } = useTheme();
  const { setRole } = useRole();
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    const success = await login(email, password, selectedRole as any);

    if (success) {
      setRole(selectedRole as any);
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Try: student@campus.edu / professor@campus.edu / club@campus.edu / admin@campus.edu");
    }

    setLoading(false);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <div className="flex gap-1 p-1 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow border">
          <button onClick={() => setTheme("light")} className="p-2">
            <Sun size={18} />
          </button>
          <button onClick={() => setTheme("dark")} className="p-2">
            <Moon size={18} />
          </button>
          <button onClick={() => setTheme("system")} className="p-2">
            <Laptop size={18} />
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl px-6">

        {/* Header */}
        <div className="text-center mb-8">
          <Portal />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Campus Buddy
          </h1>
          <p className="text-muted-foreground mt-3">
            Sign in to your account
          </p>
        </div>

        {/* Email/Password Fields */}
        <div className="max-w-md mx-auto mb-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            <button className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Role Selection Label */}
        <p className="text-center text-sm font-medium text-muted-foreground mb-3">
          Select your role to continue
        </p>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const active = selectedRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 rounded-2xl text-left transition-all duration-300 ${
                  active
                    ? `bg-gradient-to-br ${role.gradient} text-white shadow-2xl scale-105 ring-2 ring-offset-2 ring-blue-500`
                    : "bg-white dark:bg-gray-800 shadow hover:shadow-xl"
                }`}
              >
                <Icon className="mb-4" size={28} />
                <h3 className="text-xl font-semibold">{role.title}</h3>
                <p className="text-sm opacity-80 mt-2">{role.description}</p>
              </button>
            );
          })}
        </div>

        {/* Sign In Button */}
        <div className="text-center mb-4">
          <button
            onClick={handleLogin}
            disabled={!selectedRole || !email || !password || loading}
            className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all ${
              selectedRole && email && password && !loading
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-xl hover:scale-105"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </div>

        {/* Register Button - NEW */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            Don't have an account?
          </p>
          <button
            onClick={handleRegister}
            className="px-8 py-3 rounded-xl font-semibold text-base bg-white dark:bg-gray-800 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-gray-700 transition-all"
          >
            Register Now
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Demo: student@campus.edu / professor@campus.edu / club@campus.edu / admin@campus.edu
          </p>
        </div>

      </div>
    </div>
  );
}