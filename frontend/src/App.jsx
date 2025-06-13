import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

function App() {
  const { checkAuth, authUser, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log("THEME", theme);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log(authUser);
  console.log("onlineusers",onlineUsers)

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />}></Route>
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />}></Route>
        <Route path="/login" element={!authUser ? <LogIn /> : <Navigate to="/" />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />}></Route>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
