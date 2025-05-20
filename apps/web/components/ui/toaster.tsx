"use client";

import { AlertCircleIcon, CircleCheck, CircleX } from "lucide-react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex flex-row gap-4 items-center">
              {variant === "destructive" && (
                <CircleX
                  className="min-w-5 min-h-5"
                  color="black"
                  strokeWidth="1.5px"
                />
              )}
              {variant === "success" && (
                <CircleCheck
                  className="min-w-5 min-h-5"
                  color="green"
                  strokeWidth="1.5px"
                />
              )}
              {variant === "default" && (
                <AlertCircleIcon
                  className="min-w-5 min-h-5"
                  strokeWidth="1.5px"
                />
              )}
              <div className="flex flex-col gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
