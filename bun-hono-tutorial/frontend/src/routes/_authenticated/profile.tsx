import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { userQueryOptions } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (isPending) return 'Loading';
  if (error) return 'not logged in';

  return (
    <div className='p-2'>
      <div className='flex items-center gap-2'>
        <Avatar>
          {data.user.picture && (
            <AvatarImage src={data.user.picture} alt={data.user.given_name} />
          )}
          <AvatarFallback>{data.user.given_name}</AvatarFallback>
        </Avatar>
      </div>
      <p>
        {data.user.given_name} {data.user.family_name}
      </p>
      <Button asChild className='my-4'>
        <a href='/api/logout'>Logout!</a>
      </Button>
    </div>
  );
}
