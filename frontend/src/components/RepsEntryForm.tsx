"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { moveAPI } from "@/api/moveAPI";

const REPS_EXERCISES = [
  "PUSH_UPS",
  "PULL_UPS",
  "CHIN_UPS",
  "SQUATS",
  "ROMANIAN_DEADLIFTS",
  "ROWS",
  "TIBIALIS_RAISES",
  "CALF_RAISES",
  "NORDIC_CURLS",
  "REVERSE_NORDIC_CURLS",
  "ABS_ROLL_OUTS",
] as const;

const repsEntrySchema = z.object({
  load: z.coerce.number().min(0, "Load must be >= 0"),
  reps: z.coerce.number().min(1, "Reps must be at least 1"),
  exercise: z.enum(REPS_EXERCISES, {
    error: "Please select a valid exercise",
  }),
});

type RepsEntryFormData = z.infer<typeof repsEntrySchema>;

interface RepsEntryFormProps {
  onSuccess: (message?: string) => void;
  onError: (message?: string) => void;
}

export default function RepsEntryForm({onSuccess, onError}: RepsEntryFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: {errors, isSubmitting},
    reset,
    setValue,
  } = useForm<RepsEntryFormData>({
    resolver: zodResolver(repsEntrySchema),
    defaultValues: {
      load: 0,
      reps: 1,
    },
  });

  const selectedExercise = useWatch({
    control,
    name: "exercise",
  });

  const onSubmit = async (data: RepsEntryFormData) => {
    try {
      await moveAPI.createRepsEntry(data);
      reset();
      onSuccess(`${data.exercise}: ${data.reps} reps ${data.load > 0 ? `(+${data.load}kg)` : ""}`);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Unknown error";
      onError(`Failed to save reps entry: ${msg}`);
    }
  };

  return (
    <Card className="p-8 bg-white shadow-xl border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* EXERCISE SELECT */}
          <div className="space-y-3">
            <Label htmlFor="exercise" className="text-base font-semibold text-gray-900">
              Exercise
            </Label>
            <Select onValueChange={(v) => setValue("exercise", v as any)} value={selectedExercise}>
              <SelectTrigger
                className="w-full h-12 px-3 text-base font-medium text-gray-900 data-[placeholder]:text-gray-500 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Choose exercise"/>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-2xl z-50">
                {REPS_EXERCISES.map((ex) => (
                  <SelectItem
                    key={ex}
                    value={ex}
                    className="text-base py-3 font-medium text-gray-900 hover:bg-blue-50 focus:bg-blue-100"
                  >
                    {ex.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.exercise && (
              <p className="text-sm font-medium text-red-600 mt-2">
                {errors.exercise.message || "Please select an exercise"}
              </p>
            )}
          </div>

          {/* REPS INPUT */}
          <div className="space-y-3">
            <Label htmlFor="reps" className="text-base font-semibold text-gray-900">
              Reps
            </Label>
            <Input
              id="reps"
              type="number"
              min="1"
              {...register("reps")}
              placeholder="e.g. 12"
              className="w-full h-12 px-3 text-base font-medium text-gray-900 placeholder:text-gray-400 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.reps && (
              <p className="text-sm font-medium text-red-600 mt-2">{errors.reps.message}</p>
            )}
          </div>
        </div>

        {/* LOAD INPUT */}
        <div className="space-y-3">
          <Label htmlFor="load" className="text-base font-semibold text-gray-900">
            Added Load (kg){" "}
            <span className="text-sm font-normal text-gray-500">(optional)</span>
          </Label>
          <Input
            id="load"
            type="number"
            step="0.5"
            min="0"
            {...register("load")}
            placeholder="0"
            className="h-12 text-base font-medium text-gray-900 placeholder:font-normal placeholder:text-gray-400
                       bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {errors.load && (
            <p className="text-sm font-medium text-red-600 mt-2">{errors.load.message}</p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="h-12 px-8 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin"/>
                Saving...
              </>
            ) : (
              "Save Reps Entry"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
