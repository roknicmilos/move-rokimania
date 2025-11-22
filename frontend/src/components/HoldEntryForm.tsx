"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Play, Pause, Loader2 } from "lucide-react";
import { moveAPI } from "@/api/moveAPI";
import ExerciseSelect from "@/components/ExerciseSelect";

const HOLD_EXERCISES = [
  "PLANK",
  "HANGING",
  "SQUAT_HOLD",
] as const;

const formSchema = z.object({
  exercise: z.enum(HOLD_EXERCISES, {
    required_error: "Please select an exercise",
  }),
  load: z.coerce.number().min(0, "Load must be ≥ 0").optional().default(0),
});

type FormData = z.infer<typeof formSchema>;

interface HoldEntryFormProps {
  onSuccess: (message?: string) => void;
  onError: (message?: string) => void;
}

export default function HoldEntryForm({ onSuccess, onError }: HoldEntryFormProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const {
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      load: 0,
    },
  });

  const selectedExercise = useWatch({ control, name: "exercise" });
  const load = useWatch({ control, name: "load" });

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current!) / 1000));
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${ mins.toString().padStart(2, "0") }:${ secs.toString().padStart(2, "0") }`;
  };

  const handleStartStop = async () => {
    if (!isRunning) {
      // START
      setIsRunning(true);
      setElapsedSeconds(0);
    } else {
      // STOP → Auto-submit
      setIsRunning(false);
      setIsSubmitting(true);

      const now = new Date();
      const started_at = new Date(now.getTime() - elapsedSeconds * 1000).toISOString();
      const ended_at = now.toISOString();

      try {
        await moveAPI.createHoldEntry({
          exercise: selectedExercise,
          load: load ?? 0,
          started_at,
          ended_at,
        });
        onSuccess(`${ selectedExercise }: ${ formatTime(elapsedSeconds) } hold`);
        reset();
        setElapsedSeconds(0);
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Failed to save hold";
        onError(msg);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const canStart = !!selectedExercise && !isRunning;

  return (
      <Card className="p-8 bg-white shadow-xl border border-gray-200">
        <div className="space-y-8">
          {/* Exercise + Load Row */ }
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExerciseSelect
                onValueChange={ (v) => setValue("exercise", v as any) }
                selectedExercise={ selectedExercise }
                exercises={ HOLD_EXERCISES as unknown as string[] }
                error={ errors.exercise }
            />

            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-900">
                Added Load (kg) <span className="text-sm font-normal text-gray-500">(optional)</span>
              </Label>
              <Input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="0"
                  onChange={ (e) => setValue("load", e.target.value ? Number(e.target.value) : 0) }
                  className="h-12 text-base font-medium text-gray-900 placeholder:text-gray-400 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Timer Display */ }
          <div className="text-center py-8">
            <div className="text-7xl font-bold text-blue-900 tabular-nums tracking-wider">
              { formatTime(elapsedSeconds) }
            </div>
          </div>

          {/* Start / Stop Button */ }
          <div className="flex justify-center">
            <Button
                onClick={ handleStartStop }
                disabled={ !canStart && !isRunning }
                size="lg"
                className={ `min-w-64 h-16 text-xl font-bold shadow-xl transition-all ${
                    isRunning
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                } text-white` }
            >
              { isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-7 w-7 animate-spin"/>
                    Saving...
                  </>
              ) : isRunning ? (
                  <>
                    <Pause className="mr-3 h-7 w-7"/>
                    Stop & Save
                  </>
              ) : (
                  <>
                    <Play className="mr-3 h-7 w-7"/>
                    Start Hold
                  </>
              ) }
            </Button>
          </div>

          {/* Optional: Show today's date */ }
          <div className="text-center text-sm text-gray-500">
            Today, { new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          }) }
          </div>
        </div>
      </Card>
  );
}
