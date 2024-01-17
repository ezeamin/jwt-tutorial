import { useSession } from '@/stores/useSession';

const LoginForm = () => {
  const { login } = useSession();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const username = form.username.value;
    const password = form.password.value;

    login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Welcome</h1>
      <fieldset>
        <label htmlFor='username'>Username</label>
        <input type='text' id='username' name='username' />
      </fieldset>
      <fieldset>
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' name='password' />
      </fieldset>
      <button type='submit'>Log in</button>
    </form>
  );
};
export default LoginForm;
