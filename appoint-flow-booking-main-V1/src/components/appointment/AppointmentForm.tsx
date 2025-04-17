
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Location, Provider, AppointmentReason } from '../../types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  location_id: z.number().min(1, "Please select a location"),
  provider_id: z.number().min(1, "Please select a provider"),
  reason_id: z.number().min(1, "Please select a reason for appointment"),
});

interface AppointmentFormProps {
  locations: Location[];
  providers: Provider[];
  reasons: AppointmentReason[];
  onLocationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onProviderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onReasonChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  defaultValues: {
    location_id: number;
    provider_id: number;
    reason_id: number;
  };
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  locations,
  providers,
  reasons,
  onLocationChange,
  onProviderChange,
  onReasonChange,
  onSubmit,
  defaultValues,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="location_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Location</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      field.onChange(value);
                      onLocationChange(e);
                    }}
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="provider_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Provider</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={field.value || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      field.onChange(value);
                      onProviderChange(e);
                    }}
                    disabled={!defaultValues.location_id}
                  >
                    <option value="">Select Provider</option>
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Reason</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(value);
                    onReasonChange(e);
                  }}
                >
                  <option value="">Select Reason</option>
                  {reasons.map(reason => (
                    <option key={reason.id} value={reason.id}>
                      {reason.reason}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-center mt-8">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-8 rounded"
          >
            Proceed
          </Button>
        </div>
      </form>
    </Form>
  );
};
