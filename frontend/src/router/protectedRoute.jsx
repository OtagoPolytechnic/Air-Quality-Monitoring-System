import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../Context/FirestoreAuthContext"; 

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useUserAuth(); 

  console.log("ProtectedRoute Check:", { user, adminOnly });

  if (!user) {
    console.log("User not logged in - Redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("User authorized - Rendering outlet");
  return <Outlet />;
};

export default ProtectedRoute;
