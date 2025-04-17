
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppointment } from '../context/AppointmentContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

const formSchema = z.object({
  legalFirstName: z.string().min(1, 'First Name is required!'),
  lastName: z.string().min(1, 'Last Name is required!'),
  preferredName: z.string().optional(),
  mobile: z.string().regex(phoneRegex, 'Mobile is required!'),
  email: z.string().email('Email is required!'),
  dob: z.string().regex(dateRegex, 'DOB is required!')
});

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { appointmentRequest, setAppointmentRequest } = useAppointment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      legalFirstName: '',
      lastName: '',
      preferredName: '',
      mobile: '',
      email: '',
      dob: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Store in both localStorage and context
    localStorage.setItem('patientFormData', JSON.stringify({
      ...data,
      email: data.email.toLowerCase().trim()
    }));

    setAppointmentRequest(prev => ({
      ...prev,
      patient_details: data,
      email: data.email.toLowerCase().trim()
    }));

    navigate('/appointment-confirmed');
  };

  return (
    <>
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="legalFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First</FormLabel>
                      <FormControl>
                        <Input placeholder="Legal First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Preferred Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile</FormLabel>
                      <FormControl>
                        <Input placeholder="(000) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DOB</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/DD/YYYY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center mt-8">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Proceed
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Unavailable Appointment Dialog */}
        <Dialog open={false} onOpenChange={() => { }}>
          <DialogContent className="sm:max-w-md">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <DialogDescription className="text-base">
                The appointment date/time you selected is no longer available. Please choose a different date/time for your appointment.
              </DialogDescription>
            </div>
            <DialogFooter className="sm:justify-center">
              <Button
                type="button"
                className="bg-blue-500 text-white px-8"
                onClick={() => navigate('/appointment')}
              >
                Ok
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

// Create a new file for the verification page
export default PatientForm;
