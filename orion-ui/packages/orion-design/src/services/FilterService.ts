/* eslint-disable no-dupe-class-members */
import { UnionFilters } from '@/services/Filter'
import { FilterDescriptionService } from '@/services/FilterDescriptionService'
import { FilterParseService } from '@/services/FilterParseService'
import { FiltersQueryService } from '@/services/FiltersQueryService'
import { FilterStringifyService } from '@/services/FilterStringifyService'
import { Filter } from '@/types/filters'

export class FilterService {
  public static stringify(filter: Required<Filter>): string
  public static stringify(filters: Required<Filter>[]): string[]
  public static stringify(filterOrFilters: Required<Filter> | Required<Filter>[]): string | string[] {
    if (Array.isArray(filterOrFilters)) {
      return FilterStringifyService.stringifyFilters(filterOrFilters)
    }

    return FilterStringifyService.stringifyFilter(filterOrFilters)
  }

  public static parse(filter: string): Required<Filter>
  public static parse(filters: string[]): Required<Filter>[]
  public static parse(filterOrFilters: string | string[]): Required<Filter> | Required<Filter>[] {
    if (Array.isArray(filterOrFilters)) {
      return FilterParseService.parseFilters(filterOrFilters)
    }

    return FilterParseService.parseFilter(filterOrFilters)
  }

  public static query(filters: Required<Filter>[]): UnionFilters {
    return FiltersQueryService.query(filters)
  }

  public static describe(filter: Filter): string {
    return FilterDescriptionService.describe(filter)
  }

  public static icon(filter: Filter): string {
    // eslint-disable-next-line default-case
    switch (filter.object) {
      case 'flow':
        return 'pi-flow'
      case 'deployment':
        return 'pi-map-pin-line'
      case 'flow_run':
        return 'pi-flow-run'
      case 'task_run':
        return 'pi-task'
      case 'tag':
        return 'pi-label'
    }
  }
}