import { CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@a/ui'
import { Button } from '@a/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@a/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@a/ui/popover'

import type { TableFacetedFilterProps } from '~/table/interfaces'

const TableFacetedFilter = <TData, TValue>({
  column,
  options,
  title
}: TableFacetedFilterProps<TData, TValue>) => {
  const facets = column?.getFacetedUniqueValues(),
    selected = new Set(column?.getFilterValue() as string[])
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className='w-full justify-start gap-1.5 px-3 font-normal capitalize'
          variant='outline'>
          {title}
          <p className='w-5 rounded-full bg-muted font-medium'>
            {selected.size ? selected.size : ''}
          </p>
        </Button>
      </PopoverTrigger>
      {Array.from(selected, o => (
        <p className='h-4 rounded-full bg-muted px-1.5 text-xs' key={o}>
          {o}
        </p>
      ))}
      <PopoverContent
        className='w-fit p-0 transition-all duration-300 hover:drop-shadow-xl'
        side='right'>
        <Command>
          <CommandInput className='placeholder:capitalize' placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selected.has(option)
                return (
                  <CommandItem
                    className='gap-2'
                    key={option}
                    onSelect={() => {
                      if (isSelected) {
                        selected.delete(option)
                      } else {
                        selected.add(option)
                      }
                      const filterValues = Array.from(selected)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}>
                    <div
                      className={cn(
                        'flex size-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}>
                      <CheckIcon className='size-4' />
                    </div>
                    <span className='mr-1'>{option}</span>
                    {facets?.get(option) ? (
                      <span className='ml-auto flex size-4 items-center justify-center'>
                        {facets.get(option)}
                      </span>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className='justify-center text-center'
                    onSelect={() => column?.setFilterValue(undefined)}>
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TableFacetedFilter
