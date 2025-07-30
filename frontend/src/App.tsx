import { AuthProvider } from "@/contexts/AuthContext";
import AppRoutes from "@/shared/assets/AppRoutes";

function App() {

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
