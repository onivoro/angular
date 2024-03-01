import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';

const negate = (_: any) => !_;

export interface IPagedData<TEntity> {
  data: TEntity[];
  total: number;
  pageSize: number;
}

export abstract class AbstractPagedEntityService<TEntity> {
  all$$ = new BehaviorSubject<TEntity[]>([]);
  all$ = this.all$$.asObservable().pipe(shareReplay());
  data$$ = new BehaviorSubject<TEntity[]>([]);
  data$ = this.data$$.asObservable().pipe(shareReplay());
  page$$ = new BehaviorSubject<number>(0);
  page$ = this.page$$.asObservable();
  pageSize$$ = new BehaviorSubject<number>(2);
  pageSize$ = this.pageSize$$.asObservable().pipe(shareReplay());
  term$$ = new BehaviorSubject<string>('');
  term$ = this.term$$.asObservable().pipe(shareReplay());
  total$$ = new BehaviorSubject<number>(0);
  total$ = this.total$$.asObservable().pipe(shareReplay());
  loading$$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loading$$.asObservable().pipe(shareReplay());
  notLoading$ = this.loading$.pipe(map(negate));
  minDate$$ = new BehaviorSubject<Date | undefined>(undefined);
  minDate$ = this.minDate$$.asObservable().pipe(shareReplay());
  maxDate$$ = new BehaviorSubject<Date | undefined>(undefined);
  maxDate$ = this.maxDate$$.asObservable().pipe(shareReplay());

  protected abstract loadPageData(): Promise<IPagedData<TEntity>>;
  protected abstract loadAllData(): Promise<TEntity[]>;

  async loadPage(page: number) {
    if (!this.data$$.value?.length) {
      this.loading$$.next(true);
    }

    const { data, total } = await this.loadPageData();

    this.page$$.next(page);
    this.data$$.next(data);
    this.total$$.next(total);
    this.loading$$.next(false);
  }

  async loadAll() {
    if (!this.all$$.value?.length) {
      this.loading$$.next(true);
    }

    const all = await this.loadAllData();

    this.all$$.next(all);
    this.loading$$.next(false);
  }

  async setSearchTerm(term?: string) {
    this.term$$.next(term || '');
    this.page$$.next(0);
    await this.loadPage(0);
  }

  async setPageIndex(pageIndex?: number) {
    this.page$$.next(pageIndex || 0);
    await this.loadPage(this.page$$.value);
  }

  async setDateRange({ minDue, maxDue }: any) {
    this.maxDate$$.next(maxDue);
    this.minDate$$.next(minDue);
    this.page$$.next(0);
    await this.loadPage(0);
  }

  async reloadCurrentPage() {
    await this.loadPage(this.page$$.value || 0);
  }
}
