import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role='navigation'
    aria-label='pagination'
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({ className, isActive, size = "icon", ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
      }),
      className
    )}
    {...props}
  />
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label='Go to previous page' size='default' className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeft className='h-4 w-4' />
    <span className='hidden sm:flex'>Previous</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label='Go to next page' size='default' className={cn("gap-1 pr-2.5", className)} {...props}>
    <span className='hidden sm:flex'>Next</span>
    <ChevronRight className='h-4 w-4' />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <MoreHorizontal className='h-4 w-4' />
    <span className='sr-only'>More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

const PaginationContainer = ({ table }: any) => {
  if (table.getPageCount() > 0)
    return (
      <div className='flex justify-between items-center w-full border-t pt-3'>
        <p>
          Showing {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className='flex gap-2'>
          <PaginationPrevious onClick={() => table.previousPage()} isActive={table.getCanPreviousPage()} />
          <PaginationNext
            onClick={() => table.getCanNextPage() && table.nextPage()}
            isActive={table.getCanNextPage()}
          />
        </div>
      </div>
    );
  else return null;
};

interface PaginatorProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const CustomPagination = ({
  currentPage,
  totalItems,
  itemsPerPage = 4,
  onPageChange,
  className = "",
}: PaginatorProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const isFirst = currentPage === 0;
  const isLast = currentPage >= totalPages - 1;
  return (
    <div className={`flex items-center justify-between pt-4 ${className}`}>
      <Button onClick={() => onPageChange(Math.max(0, currentPage - 1))} disabled={isFirst} variant='ghost' size='icon'>
        <ChevronLeft size={20} />
      </Button>
      <div className='text-sm'>{totalPages > 0 ? `${currentPage + 1} of ${totalPages}` : "0 of 0"}</div>
      <Button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={isLast}
        variant='ghost'
        size='icon'
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
  CustomPagination,
};
