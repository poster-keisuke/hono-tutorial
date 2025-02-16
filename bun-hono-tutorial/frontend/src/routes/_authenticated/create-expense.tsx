import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createExpense,
  getAllExpensesQueryOptions,
  loadingCreteExpenseQueryOptions,
} from '@/lib/api';
import { createExpenseSchema, type CreateExpense } from '@server/sharedTypes';
import { useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
});

function CreateExpense() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: '',
      amount: '0',
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions
      );

      navigate({ to: '/expenses' });

      // loading state
      try {
        const newExpense = await createExpense({ value });
        queryClient.setQueryData(loadingCreteExpenseQueryOptions.queryKey, {
          expense: value,
        });
        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, () => ({
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses],
        }));

        toast('Expense Created', {
          description: `Successfully created expense: ${newExpense.title}`,
        });
      } catch (error) {
        toast('Error', {
          description: `Failed to create expense: ${error}`,
        });
      } finally {
        queryClient.setQueryData(loadingCreteExpenseQueryOptions.queryKey, {});
      }
    },
  });

  return (
    <div className='p-2'>
      <h2>Create Expense</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className='flex flex-col gap-y-4 max-w-xl m-auto'
      >
        <form.Field
          name='title'
          validators={{
            onChange: ({ value }: { value: string }) => {
              const result = createExpenseSchema.shape.title.safeParse(value);
              if (!result.success) {
                return result.error.errors.map((err) => err.message).join(', ');
              }
              return undefined;
            },
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name='amount'
          validators={{
            onChange: ({ value }: { value: string }) => {
              const result = createExpenseSchema.shape.amount.safeParse(value);
              if (!result.success) {
                return result.error.errors.map((err) => err.message).join(', ');
              }
              return undefined;
            },
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type='number'
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name='date'
          validators={{
            onChange: ({ value }: { value: string }) => {
              const result = createExpenseSchema.shape.date.safeParse(value);
              if (!result.success) {
                return result.error.errors.map((err) => err.message).join(', ');
              }
              return undefined;
            },
          }}
          children={(field) => (
            <div className='self-center'>
              <Calendar
                mode='single'
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className='rounded-md border'
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(', ')}</em>
              ) : null}
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className='mt-4' type='submit' disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
