import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../Context/FirestoreAuthContext"; 

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useUserAuth(); 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
