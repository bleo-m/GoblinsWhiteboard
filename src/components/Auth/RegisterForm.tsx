import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface RegisterFormProps {
  onFormSubmit: (data: {
    name: string;
    email: string;
    password: string;
  }) => void;
  loading: boolean;
}

export const registerFormSchema = z.object({
  name: z.string().refine((name) => name.length > 0, {
    message: 'Your name cannot be empty.',
  }),
  email: z.string().refine((email) => email.length > 0, {
    message: 'Your email cannot be empty.',
  }),
  password: z.string().refine((password) => password.length > 0, {
    message: 'Your password cannot be empty.',
  }),
});

export default function RegisterForm({
  onFormSubmit,
  loading,
}: RegisterFormProps) {
  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  return (
    <div className="w-full">
      <Form {...registerForm}>
        <form
          onSubmit={registerForm.handleSubmit(onFormSubmit)}
          className="flex flex-col items-center my-4"
        >
          <FormField
            control={registerForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormControl>
                  <Input
                    className="font-normal"
                    placeholder="Enter your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormControl>
                  <Input
                    className="font-normal"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormControl>
                  <Input
                    className="font-normal"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full font-bold" type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            CREATE ACCOUNT
          </Button>
        </form>
      </Form>
    </div>
  );
}
