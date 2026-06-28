import { useState } from "react";
import React from "react";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Login = () => {

    const { loading, handleLogin } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() && !password.trim()) {
            toast.error("Email and Password are required.");
            return;
        }

        if (!email.trim()) {
            toast.error("Email is required.");
            return;
        }

        if (!password.trim()) {
            toast.error("Password is required.");
            return;
        }

        const success = await handleLogin({email, password});

        if(success){
            navigate("/");
        }
    }

    if (loading) {
        return (
            <main>
                <h1>Signing you in...</h1>
            </main>
        );
    }

    return (

        <main className="auth-page">

            <div className="auth-card">

                {/* Left Side */}

                <div className="auth-left">

                    <div>

                        <h1>
                            AI Interview
                            <span> Analyzer</span>
                        </h1>

                        <p>
                            Build ATS Friendly resumes, generate interview
                            questions, evaluate your skills and prepare with an
                            AI powered roadmap.
                        </p>

                        <div className="features">

                            <div>🚀 AI Powered Interview Analysis</div>

                            <div>📄 ATS Resume Generator</div>

                            <div>💼 Personalized Interview Questions</div>

                            <div>🎯 Match Score & Skill Gap Analysis</div>

                        </div>

                    </div>

                </div>

                {/* Right Side */}

                <div className="auth-right">

                    <h2>Welcome Back 👋</h2>

                    <p className="subtitle">
                        Login to continue your interview preparation.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                        </div>

                        <button
                            className="button primary-button"
                            type="submit"
                        >
                            Sign In
                        </button>

                    </form>

                    <p className="form-footer">

                        Don't have an account?

                        <a href="/register"> Create Account</a>

                    </p>

                </div>

            </div>

        </main>

    );

};

export default Login;
