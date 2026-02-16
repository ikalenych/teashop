import { useAuth } from "../context/AuthContext";
import { AuthForms } from "../components/account/AuthForms";
import { UserProfile } from "../components/account/UserProfile";

export const Account = () => {
  const { isAuthenticated } = useAuth();

  // Якщо не залогінений → показуємо форму
  if (!isAuthenticated) {
    return <AuthForms />;
  }

  // Якщо залогінений → показуємо профіль
  return <UserProfile />;
};
