//dziala
import { useContext } from "react";
import { AuthContext } from "../services/auth/AuthContex";

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;

// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../services/auth/AuthContex";

// const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }

//   const adminProtectedRoute = (Component) => {
//     return (props) => {
//       if (!context.isLoggedIn) {
//         return <Navigate to="/" replace />;
//       }

//       if (context.currentUser?.role !== "ADMIN") {
//         return <Navigate to="/" replace />;
//       }

//       return <Component {...props} />;
//     };
//   };

//   return {
//     ...context,
//     adminProtectedRoute,
//   };
// };

// export default useAuth;
