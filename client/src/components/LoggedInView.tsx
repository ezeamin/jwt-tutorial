import { useSession } from '@/stores/useSession';

const LoggedInView = () => {
  const { user, logout } = useSession();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <>
      <h1>Hi {user.name}!</h1>
      <button type='button' onClick={handleLogout}>
        Log out
      </button>
    </>
  );
};
export default LoggedInView;
