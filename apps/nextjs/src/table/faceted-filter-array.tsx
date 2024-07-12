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

const TableFacetedFilterContainArray = <TData, TValue>({
  column,
  options,
  title
}: TableFacetedFilterProps<TData, TValue>) => {
  const _facets = column?.getFacetedUniqueValues() as Map<string, number>,
    selected = new Set(column?.getFilterValue() as string[]),
    facets = new Map<string, number>()
  for (const option of options) {
    const count = (
      [..._facets.keys()]
        .filter(key => key.includes(option))
        .map(key => _facets.get(key)) as number[]
    ).reduce((acc, value) => acc + value, 0)
    facets.set(option, count)
  }
  options.sort((a, b) => (facets.get(b) ?? 0) - (facets.get(a) ?? 0))

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
                      const filterValues = [...selected]
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
                    {facets.get(option) && (
                      <span className='ml-auto flex size-4 items-center justify-center'>
                        {facets.get(option)}
                      </span>
                    )}
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

export default TableFacetedFilterContainArray
