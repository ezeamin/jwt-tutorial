import { useEffect, useState } from 'react';

import LoggedInView from './components/LoggedInView';
import LoginForm from './components/LoginForm';

import { useSession } from './stores/useSession';

const App = () => {
  const { isLoggedIn, refreshToken } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      refreshToken();

      // Hardcoded delay to simulate the network request
      // In a complex app, we should use something like Tanstack-query to manage this easily
      window.setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isLoggedIn, refreshToken]);

  if (isLoading) return <h1>Loading...</h1>;

  if (isLoggedIn) return <LoggedInView />;

  return <LoginForm />;
};

export default App;
