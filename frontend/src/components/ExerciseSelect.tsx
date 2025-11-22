"use client";

import { FieldError } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ExerciseSelectProps {
  onValueChange: (value: string) => void;
  selectedExercise: string;
  exercises: string[];
  error?: FieldError;
}

export default function ExerciseSelect(props: ExerciseSelectProps) {
  const { onValueChange, selectedExercise, exercises, error } = props;

  return (
      <div className="space-y-3">
        <Label htmlFor="exercise" className="text-base font-semibold text-gray-900">
          Exercise
        </Label>
        <Select onValueChange={ onValueChange } value={ selectedExercise }>
          <SelectTrigger
              className="w-full h-12 px-3 text-base font-medium text-gray-900 data-[placeholder]:text-gray-500 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="Choose exercise"/>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 shadow-2xl z-50">
            { exercises.map((ex) => (
                <SelectItem
                    key={ ex }
                    value={ ex }
                    className="text-base py-3 font-medium text-gray-900 hover:bg-blue-50 focus:bg-blue-100"
                >
                  { ex.replace(/_/g, " ") }
                </SelectItem>
            )) }
          </SelectContent>
        </Select>
        { error && (
            <p className="text-sm font-medium text-red-600 mt-2">
              { error.message || "Please select an exercise" }
            </p>
        ) }
      </div>
  );
}
