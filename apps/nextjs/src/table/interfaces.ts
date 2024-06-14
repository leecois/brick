import type { Column, Table } from '@tanstack/react-table'

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: string[]
  showBadge: boolean
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  className?: string
}

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  rowString: string
  className?: string
}

export type {
  DataTableColumnHeaderProps,
  DataTableFacetedFilterProps,
  DataTablePaginationProps,
  DataTableViewOptionsProps
}
