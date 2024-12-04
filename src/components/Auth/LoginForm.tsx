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

interface LogInFormProps {
  onFormSubmit: (data: { email: string; password: string }) => void;
  loading: boolean;
}

export const logInFormSchema = z.object({
  email: z.string().refine((name) => name.length > 0, {
    message: 'Your email cannot be empty.',
  }),
  password: z.string().refine((name) => name.length > 0, {
    message: 'Your password cannot be empty.',
  }),
});

export default function LogInForm({ onFormSubmit, loading }: LogInFormProps) {
  const logInForm = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className="w-full">
      <Form {...logInForm}>
        <form
          onSubmit={logInForm.handleSubmit(onFormSubmit)}
          className="flex flex-col items-center my-4"
        >
          <FormField
            control={logInForm.control}
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
            control={logInForm.control}
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
            LOGIN
          </Button>
        </form>
      </Form>
    </div>
  );
}
