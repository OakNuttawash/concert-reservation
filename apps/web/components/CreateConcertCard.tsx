"use client";

import { createConcert } from "@/api/concert/action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { concertSchema } from "@/lib/schema/concertSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "./ui/use-toast";

export function CreateConcertCard() {
  const form = useForm({
    resolver: zodResolver(concertSchema),
    defaultValues: {
      name: "",
      totalSeat: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof concertSchema>) {
    startTransition(async () => {
      const res = await createConcert(data);
      form.reset();
      if (res.status === "error") {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: res.message,
          variant: "success",
        });
      }
    });
  }
  return (
    <div className="flex flex-col p-10 gap-8 rounded-sm border bg-white border-gray-200">
      <div className="flex flex-col gap-6">
        <h3 className="font-semibold text-primary">Create</h3>
        <Separator />
      </div>
      <Form {...form}>
        <form
          className="grid grid-cols-2 gap-4 max-md:grid-cols-1"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <h4>Concert Name</h4>
                <FormControl>
                  <Input {...field} placeholder="Please input concert name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalSeat"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <h4>Total of seat</h4>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="500"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4 col-span-full">
                <h4>Description</h4>
                <FormControl>
                  <Textarea {...field} placeholder="Please input description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-fit self-end">
            <Save />
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
