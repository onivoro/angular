import { BehaviorSubject, map, shareReplay } from 'rxjs';

const negate = (_: any) => !_;

export abstract class AbstractDataEntityService<TEntity> {
  all$$ = new BehaviorSubject<TEntity[]>([]);
  all$ = this.all$$.asObservable().pipe(shareReplay());
  loading$$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loading$$.asObservable().pipe(shareReplay());
  notLoading$ = this.loading$.pipe(map(negate));

  protected abstract loadAllData(): Promise<TEntity[]>;

  async loadAll() {
    if (!this.all$$.value?.length) {
      this.loading$$.next(true);
    }

    const all = await this.loadAllData();

    this.all$$.next(all);
    this.loading$$.next(false);
  }
}
