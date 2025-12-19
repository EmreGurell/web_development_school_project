"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({ className, ...props }) {
  return (
      <AccordionPrimitive.Root
          data-slot="accordion"
          className={cn("space-y-4", className)}
          {...props}
      />
  )
}

function AccordionItem({ className, ...props }) {
  return (
      <AccordionPrimitive.Item
          data-slot="accordion-item"
          className={cn(
              "bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden",
              className
          )}
          {...props}
      />
  )
}

function AccordionTrigger({ className, children, ...props }) {
  return (
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
            data-slot="accordion-trigger"
            className={cn(
                "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white",
                "transition-all hover:bg-gray-100 dark:hover:bg-gray-800/80",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                "[&[data-state=open]>svg]:rotate-180",
                className
            )}
            {...props}
        >
          {children}
          <ChevronDownIcon className="size-4 shrink-0 text-gray-500 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
  )
}

function AccordionContent({ className, children, ...props }) {
  return (
      <AccordionPrimitive.Content
          data-slot="accordion-content"
          className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
          {...props}
      >
        <div
            className={cn(
                "px-5 pb-5 pt-2 text-sm text-gray-500 dark:text-gray-400",
                className
            )}
        >
          {children}
        </div>
      </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
