import type { Column, Table } from '@tanstack/react-table'

interface TableColumnHeaderProps<TData, TValue> {
  children: React.ReactNode
  className?: string
  column: Column<TData, TValue>
}

interface TableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  options: string[]
  title?: string
}

interface TableViewOptionsProps<TData> {
  className?: string
  table: Table<TData>
}

interface TablePaginationProps<TData> {
  className?: string
  rowSingular: string
  table: Table<TData>
}

export type {
  TableColumnHeaderProps,
  TableFacetedFilterProps,
  TablePaginationProps,
  TableViewOptionsProps
}
