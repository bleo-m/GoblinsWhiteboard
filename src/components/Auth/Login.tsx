import { useState } from 'react';

import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import LogInForm, { logInFormSchema } from './LoginForm';
import RegisterForm, { registerFormSchema } from './RegisterForm';
import { useAuth } from '../../contexts/AuthContext';
import { Alert, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Login() {
  const [loginStep, setLoginStep] = useState('log-in');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, signInUser } = useAuth();
  const navigate = useNavigate();

  const toggleLogInSignUp = () => {
    if (loginStep === 'log-in') {
      setLoginStep('sign-up');
    } else if (loginStep === 'sign-up') {
      setLoginStep('log-in');
    }
  };

  async function onLogInSubmit(data: z.infer<typeof logInFormSchema>) {
    const email = data.email;
    const password = data.password;
    if (signInUser && !loading) {
      try {
        setLoading(true);
        await signInUser(email, password);
        setErrorMessage('');
        navigate('/');
      } catch (e) {
        setErrorMessage('Error occured while signing in.');
      }
      setLoading(false);
    }
  }

  async function onRegisterAccountSubmit(
    data: z.infer<typeof registerFormSchema>,
  ) {
    const name = data.name;
    const email = data.email;
    const password = data.password;
    if (register && !loading) {
      try {
        setLoading(true);
        await register(name, email, password);
        setErrorMessage('');
        navigate('/');
      } catch (e) {
        setErrorMessage('Error occured while registering.');
      }
    }
    setLoading(false);
  }

  return (
    <Card className="w-1/4 min-w-80">
      <CardHeader className="flex items-center">
        <CardTitle>{loginStep === 'log-in' ? 'Log in' : 'Sign up'}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center">
        <div className="w-3/4">
          {loginStep === 'log-in' && (
            <LogInForm onFormSubmit={onLogInSubmit} loading={loading} />
          )}
          {loginStep === 'sign-up' && (
            <RegisterForm
              onFormSubmit={onRegisterAccountSubmit}
              loading={loading}
            />
          )}
          {errorMessage.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle> {errorMessage}</AlertTitle>
            </Alert>
          )}
          <div id="recaptcha-container"></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div>
          <p>
            {loginStep === 'log-in'
              ? 'Dont have an account?'
              : 'Already have an account?'}
          </p>
          <button className="hover:cursor-pointer" onClick={toggleLogInSignUp}>
            <u>{loginStep === 'log-in' ? 'Sign up' : 'Log in'}</u>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
