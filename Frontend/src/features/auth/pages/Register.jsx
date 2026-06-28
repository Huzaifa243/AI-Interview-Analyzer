import React, { useState } from "react";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { toast } from "sonner";


const Register = () => {

    const navigate = useNavigate();

    const { loading, handleRegister } = useAuth();

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ( !username.trim() && !email.trim() && !password.trim()) {
            toast.error("Username, Email and Password are required.");
            return;
        }

        if (!email.trim()) {
            toast.error("Email is required.");
            return;
        }

        if (!username.trim()) {
            toast.error("Username is required.");
            return;
        }

        if (!password.trim()) {
            toast.error("Password is required.");
            return;
        }

        const success = await handleRegister({username, email, password});

        if(success){
            navigate("/");
        }
    }

    if (loading) {

        return (

            <main>

                <h1>Creating your account...</h1>

            </main>

        );

    }

    return (

        <main className="auth-page">

            <div className="auth-card">

                {/* Left */}

                <div className="auth-left">

                    <div>

                        <h1>

                            AI Interview

                            <span> Analyzer</span>

                        </h1>

                        <p>

                            Join thousands of students preparing smarter with
                            AI generated interview reports and ATS optimized
                            resumes.

                        </p>

                        <div className="features">

                            <div>🤖 AI Interview Preparation</div>

                            <div>📊 Match Score Analysis</div>

                            <div>📄 Resume PDF Generator</div>

                            <div>🎯 Roadmap to Crack Interviews</div>

                        </div>

                    </div>

                </div>

                {/* Right */}

                <div className="auth-right">

                    <h2>Create Account ✨</h2>

                    <p className="subtitle">

                        Start your AI powered interview journey.

                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">

                            <label>Username</label>

                            <input

                                type="text"

                                placeholder="Enter username"

                                onChange={(e) => setUsername(e.target.value)}

                            />

                        </div>

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

                                placeholder="Create password"

                                onChange={(e) => setPassword(e.target.value)}

                            />

                        </div>

                        <button
                            className="button primary-button"
                            type="submit"
                        >
                            Create Account
                        </button>

                    </form>

                    <p className="form-footer">

                        Already have an account?

                        <a href="/login"> Login</a>

                    </p>

                </div>

            </div>

        </main>

    );

};

export default Register;


