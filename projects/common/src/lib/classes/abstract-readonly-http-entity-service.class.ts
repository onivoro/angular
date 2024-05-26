import { BehaviorSubject, map, shareReplay } from 'rxjs';

export abstract class AbstractReadonlyHttpEntityService<TEntity> {
    data$$ = new BehaviorSubject<TEntity[]>([]);
    data$ = this.data$$.asObservable().pipe(shareReplay());
    count$ = this.data$.pipe(map(data => data?.length || 0));
    some$ = this.count$.pipe(map(count => count > 0));
    none$ = this.some$.pipe(map(present => !present));
    loading$$ = new BehaviorSubject<boolean>(false);
    loading$ = this.loading$$.asObservable().pipe(shareReplay());
    notLoading$ = this.loading$.pipe(map(loading => !loading));

    abstract _index(): Promise<TEntity[]>;
    abstract _get(id: string): Promise<TEntity>;

    async index(): Promise<TEntity[]> {
        return await this.load();
    }

    async get(id: string) {
        return await this._get(id);
    }

    async load(): Promise<TEntity[]> {
        if (!this.data$$.value?.length) {
            await this.reload();
        }

        return this.data$$.value;
    }

    async reload(): Promise<TEntity[]> {
        this.loading$$.next(true);

        try {
            this.data$$.next(await this._index());
            this.loading$$.next(false);
        } catch (error: any) {
            console.warn('error loading data', error);
            this.loading$$.next(false);
            throw error;
        }

        return this.data$$.value;
    }
}
