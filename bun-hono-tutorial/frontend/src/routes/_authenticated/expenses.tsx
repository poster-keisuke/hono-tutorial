import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash } from 'lucide-react';

import {
  deleteExpense,
  getAllExpensesQueryOptions,
  loadingCreteExpenseQueryOptions,
} from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
});

function Expenses() {
  const { isPending, error, data } = useQuery(getAllExpensesQueryOptions);
  const { data: loadingCreateExpense } = useQuery(
    loadingCreteExpenseQueryOptions
  );

  if (error) return 'An error occurred: ' + error.message;

  return (
    <div className='p-2 max-w-3xl m-auto'>
      <Table>
        <TableCaption>A list of all your expense.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCreateExpense?.expense && (
            <TableRow>
              <TableCell className='font-medium'>
                <Skeleton className='h-4' />
              </TableCell>
              <TableCell>{loadingCreateExpense?.expense.title}</TableCell>
              <TableCell>{loadingCreateExpense?.expense.amount}</TableCell>
              <TableCell>
                {loadingCreateExpense?.expense.date.split('T')[0]}
              </TableCell>
              <TableCell className='font-medium'>
                <Skeleton className='h-4' />
              </TableCell>
            </TableRow>
          )}

          {isPending
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className='font-medium'>
                      <Skeleton className='h-4' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4' />
                    </TableCell>
                  </TableRow>
                ))
            : data.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className='font-medium'>{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.date.split('T')[0]}</TableCell>
                  <TableCell>
                    <ExpenseDeleteButton id={expense.id} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

const ExpenseDeleteButton = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast('Error', {
        description: `Failed to delete expense with id ${id}`,
      });
    },
    onSuccess: () => {
      toast('Success', {
        description: `Successfully deleted expense with id ${id}`,
      });

      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter((e) => e.id !== id),
        })
      );
    },
  });

  return (
    <Button
      disabled={mutation.isPending}
      variant='outline'
      size='icon'
      onClick={() => mutation.mutate({ id })}
    >
      {mutation.isPending ? '...' : <Trash className='h-4 w-4' />}
    </Button>
  );
};
