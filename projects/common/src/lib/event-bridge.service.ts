import { Injectable } from "@angular/core";
import { Observable, Subject, share } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EventBridgeService {
    private registered = false;
    eventBus$$: Record<string, Subject<any>> = {};
    eventBus$: Record<string, Observable<any>> = {};

    listeners: any = {}

    listen(events: string[]) {
        if (!this.registered) {

            events.forEach(eventName => {
                const $$ = new Subject<any>();
                this.eventBus$$[eventName] = $$;
                this.eventBus$[eventName] = $$.asObservable().pipe(share());
                window.addEventListener(eventName, (event: any) => $$.next(event.detail));
            });

            this.registered = true;
        }
    }
}