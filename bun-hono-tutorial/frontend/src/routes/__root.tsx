import { Toaster } from '@/components/ui/sonner';
import { type QueryClient } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

interface MyRouterContext {
  queryClient: QueryClient;
}

const Root = () => {
  return (
    <>
      <NavBar />
      <hr />
      <div className='p-2 max-w-2xl m-auto'>
        <Outlet />
      </div>
      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

const NavBar = () => {
  return (
    <div className='p-2 flex justify-between max-w-2xl m-auto items-baseline'>
      <Link to='/' className='[&.active]:font-bold'>
        <h2 className='text-2xl font-bold'>Expense Tracker</h2>
      </Link>
      <div className='flex gap-2'>
        <Link to='/about' className='[&.active]:font-bold'>
          About
        </Link>
        <Link to='/expenses' className='[&.active]:font-bold'>
          Expense
        </Link>
        <Link to='/create-expense' className='[&.active]:font-bold'>
          Create
        </Link>
        <Link to='/profile' className='[&.active]:font-bold'>
          Profile
        </Link>
      </div>
    </div>
  );
};
