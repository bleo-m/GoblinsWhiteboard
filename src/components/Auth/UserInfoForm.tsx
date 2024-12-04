import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { doc, setDoc } from 'firebase/firestore';
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
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';

export const userInfoFormSchema = z.object({
  name: z.string().refine((name) => name.length > 0, {
    message: 'Your name cannot be empty.',
  }),
});

export default function UserInfoForm() {
  const { currentUser, updateUserDisplayName } = useAuth();
  const [loading, setLoading] = useState(false);

  const userInfoForm = useForm<z.infer<typeof userInfoFormSchema>>({
    resolver: zodResolver(userInfoFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const onUserInfoFormSubmit = async (
    data: z.infer<typeof userInfoFormSchema>,
  ) => {
    setLoading(true);
    const name = data.name;
    if (name && updateUserDisplayName) {
      try {
        const userUid = currentUser?.uid;
        if (userUid) {
          await setDoc(doc(db, 'users', userUid), {
            name,
          });
          await updateUserDisplayName(name);
        }
      } catch (e) {
        console.log(e);
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <Form {...userInfoForm}>
        <form
          onSubmit={userInfoForm.handleSubmit(onUserInfoFormSubmit)}
          className="flex flex-col items-center my-4"
        >
          <FormLabel className="mb-4 text-lg">What is your name?</FormLabel>
          <FormField
            control={userInfoForm.control}
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
          <Button className="w-full font-bold" type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            🎉 CREATE MY ACCOUNT 🤩
          </Button>
        </form>
      </Form>
    </div>
  );
}
