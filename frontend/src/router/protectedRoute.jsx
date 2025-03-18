import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../Context/FirestoreAuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useUserAuth(); // ✅ Get loading state

  console.log("ProtectedRoute Check:", { user, adminOnly, loading });

  if (loading) {
    console.log("Auth state still loading...");
    return <div>Loading...</div>; // ✅ Prevents premature redirect
  }

  if (!user) {
    console.log("User not logged in - Redirecting to /login");
    return <Navigate to="/login" replace />;
  }


  console.log("User authorized - Rendering outlet");
  return <Outlet />;
};

export default ProtectedRoute;
