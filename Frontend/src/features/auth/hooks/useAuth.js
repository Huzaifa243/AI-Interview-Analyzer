import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { toast } from "sonner";


export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({email, password})
            setUser(data.user)
            toast.success("Login Successful 🎉");
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid email or password.");
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username,email,password }) => {
        setLoading(true)
        try{
            const data = await register({username, email, password})
            setUser(data.user)
            toast.success("Account Created Successfully 🎉");
            return true
        } catch(err){
            toast.error(err.response?.data?.message || "Registration Failed");
            return false
        } finally{
            setLoading(false)
        }
    }

    // const handleLogout = async () => {
    //     setLoading(true)
    //     try {
    //         const data = await logout()
    //         setUser(null)
    //         toast.success("Logged Out Successfully");
    //     } catch (err) {
    //         toast.error("Logout Failed");
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
            toast.success("Logged out successfully 👋");            
            return true;
        } catch (err) {
            toast.error("Logout failed.");
            return false;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                setUser(data.user)
            } catch (err) { } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}